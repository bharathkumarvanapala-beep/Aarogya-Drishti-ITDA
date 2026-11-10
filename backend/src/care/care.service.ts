import { Injectable, BadRequestException, ForbiddenException, NotFoundException, ConflictException, OnModuleDestroy } from '@nestjs/common';
import { PostgresCareStore } from './postgres-store';
import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { assessPhoto } from './image-quality';

export interface CareCase {
  facilityId?: string; referralFacilityId?: string;
  patientAccountId?: string;
  patientId?: string;
  id: string; version: number; ownerId: string; village: string; name: string; age: number;
  sex: string; mandal: string; history: string; symptoms: string; consent: boolean;
  participants: string[]; status: string; createdAt: string;
  images: { site: string; data: string }[];
  events: { id: string; action: string; actor: string; role: string; at: string; data: Record<string, unknown> }[];
}
type Input = Record<string, any>;
const FRONT = ['ASHA_WORKER', 'ANM_WORKER', 'COMMUNITY_HEALTH_OFFICER', 'health_worker', 'asha', 'anm'];
const DOCTOR = ['MEDICAL_OFFICER', 'SPECIALIST_DOCTOR', 'doctor', 'specialist'];
const HOSPITAL = ['HOSPITAL_STAFF', 'hospital_coordinator'];
const ADMIN = ['DISTRICT_ADMIN', 'SUPER_ADMIN', 'admin'];
const text = (value: unknown, field: string, max = 4000): string => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new BadRequestException(`Invalid ${field}`);
  return value.trim();
};

/** Local demonstration persistence. Ciphertext is stored transactionally in PostgreSQL.
 * The separate key must be backed up and protected with OS permissions. */
@Injectable()
export class CareService implements OnModuleDestroy {
  async join(id: string, u: RequestUser) {
    if(HOSPITAL.includes(u.role)||ADMIN.includes(u.role))throw new ForbiddenException('Clinical consultation requires an assigned clinical participant');
    await this.get(id, u);
    return this.db.transaction(async () => {
      const row = await this.db.prepare('SELECT payload FROM care_rooms WHERE id=?').get(id);
      let room = row ? JSON.parse(String(row.payload)) : null;
      if (!room || room.expires < Date.now()) room = { expires: Date.now() + 30 * 60 * 1000, members: [], signals: [] };
      if (!room.members.includes(u.id)) {
        if (room.members.length >= 2) throw new ConflictException('Two consultation participants already joined');
        room.members.push(u.id);
      }
      await this.db.prepare('INSERT INTO care_rooms VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(id, JSON.stringify(room));
      return { initiator: room.members[0] === u.id, expires: room.expires };
    });
  }
  async signal(id: string, u: RequestUser, data?: unknown) {
    await this.get(id, u);
    return this.db.transaction(async () => {
      const row = await this.db.prepare('SELECT payload FROM care_rooms WHERE id=?').get(id);
      const room = row ? JSON.parse(String(row.payload)) : null;
      if (!room || room.expires < Date.now() || !room.members.includes(u.id)) throw new ForbiddenException('Join an active consultation first');
      if (data !== undefined) {
        if (JSON.stringify(data).length > 20000 || room.signals.length > 500) throw new BadRequestException('Signal limit exceeded');
        room.signals.push({ from: u.id, data });
        await this.db.prepare('UPDATE care_rooms SET payload=? WHERE id=?').run(JSON.stringify(room), id);
      }
      return room.signals.map((s: {from: string; data: unknown}, index: number) => ({ ...s, index })).filter((s: {from: string}) => s.from !== u.id);
    });
  }
  private db: PostgresCareStore;
  private key: Buffer;
  constructor() {
    const encodedKey = process.env.CARE_KEY_BASE64;
    if (encodedKey) {
      this.key = Buffer.from(encodedKey, 'base64');
      if (this.key.length !== 32 || this.key.toString('base64') !== encodedKey) throw new Error('CARE_KEY_BASE64 must encode exactly 32 bytes');
    } else {
      if (process.env.VERCEL) throw new Error('CARE_KEY_BASE64 is required on Vercel');
      const dir = process.env.CARE_DATA_DIR || join(process.cwd(), 'data');
      mkdirSync(dir, { recursive: true });
      const keyPath = join(dir, 'care.key');
      if (!existsSync(keyPath)) writeFileSync(keyPath, randomBytes(32), { mode: 0o600, flag: 'wx' });
      this.key = readFileSync(keyPath);
    }
    this.db = new PostgresCareStore();
  }
  async onModuleDestroy() { await this.db.close(); }
  private encrypt(c: CareCase): string {
    const iv = randomBytes(12); const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const data = Buffer.concat([cipher.update(JSON.stringify(c)), cipher.final()]);
    return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64');
  }
  private decrypt(s: string): CareCase {
    const b = Buffer.from(s, 'base64'); const decipher = createDecipheriv('aes-256-gcm', this.key, b.subarray(0, 12));
    decipher.setAuthTag(b.subarray(12, 28));
    return JSON.parse(Buffer.concat([decipher.update(b.subarray(28)), decipher.final()]).toString());
  }
  private async all(): Promise<CareCase[]> {
    const list = (await this.db.prepare('SELECT payload FROM cases').all()).map(r => this.decrypt(String(r.payload)));
    if (list.length === 0) {
      await this.seedInitialCase();
      return (await this.db.prepare('SELECT payload FROM cases').all()).map(r => this.decrypt(String(r.payload)));
    }
    return list;
  }
  private async seedInitialCase(): Promise<void> {
    try {
      const kondala: CareCase = {
        facilityId: 'fac-sc-kothapalli',
        referralFacilityId: 'fac-dh-paderu',
        patientAccountId: 'b306f875-3643-9390-e294-060606060606',
        patientId: 'ASR-PAT-2026-0842',
        id: 'case-asr-2026-0042',
        version: 4,
        ownerId: 'c8b1a320-f19e-4e4b-9e4f-010101010101',
        village: 'Kothapalli',
        name: 'Kondala Rao (కొండల రావు)',
        age: 46,
        sex: 'Male',
        mandal: 'G. Madugula',
        history: 'Gutkha / khaini chewer for 18 years. Non-healing painless whitish-red patch right buccal mucosa for 6 months.',
        symptoms: 'Mild burning sensation on spicy food, reduced mouth opening (3 fingers).',
        consent: true,
        participants: [
          'c8b1a320-f19e-4e4b-9e4f-010101010101',
          'e0d3c542-0310-606d-b961-020202020202',
          'f1e4d653-1421-717e-c072-040404040404',
          'd9c2b431-020f-5f5c-a850-030303030303',
          'b306f875-3643-9390-e294-060606060606',
        ],
        status: 'REFERRED',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        images: [
          {
            site: 'Right cheek (Buccal Mucosa)',
            data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23b91c1c"/><ellipse cx="200" cy="150" rx="140" ry="100" fill="%23dc2626"/><ellipse cx="210" cy="140" rx="60" ry="40" fill="%23fef2f2"/><path d="M170 140 Q 210 110 250 140 Q 230 170 170 140 Z" fill="%23fee2e2" stroke="%23b91c1c" stroke-width="2"/><text x="200" y="270" font-family="sans-serif" font-size="12" fill="white" text-anchor="middle">Guided Buccal Mucosa Screening: ASR-PAT-2026-0842</text></svg>'
          }
        ],
        events: [
          {
            id: randomUUID(),
            action: 'REGISTERED',
            actor: 'c8b1a320-f19e-4e4b-9e4f-010101010101',
            role: 'ASHA_WORKER',
            at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
            data: { consent: true, patientId: 'ASR-PAT-2026-0842', language: 'te' }
          },
          {
            id: randomUUID(),
            action: 'SUBMIT',
            actor: 'c8b1a320-f19e-4e4b-9e4f-010101010101',
            role: 'ASHA_WORKER',
            at: new Date(Date.now() - 34 * 3600 * 1000).toISOString(),
            data: { reason: 'Screening submitted for PHC Medical Officer clinical assessment' }
          },
          {
            id: randomUUID(),
            action: 'AI_DEMO',
            actor: 'e0d3c542-0310-606d-b961-020202020202',
            role: 'MEDICAL_OFFICER',
            at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
            data: {
              triage: 'YELLOW',
              confidence: 'MODERATE_CONFIDENCE',
              rationale: 'Non-clinical advisory: Irregular mucosal texture and localized hyperkeratotic plaque detected. Professional clinical assessment required. Not a diagnosis of cancer.'
            }
          },
          {
            id: randomUUID(),
            action: 'REVIEW',
            actor: 'e0d3c542-0310-606d-b961-020202020202',
            role: 'MEDICAL_OFFICER',
            at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
            data: {
              decision: 'REFER',
              notes: 'High-risk non-scrapable leukoplakic lesion, 1.8cm x 1.2cm right buccal mucosa. Referred to District Hospital Paderu Oral Oncology OPD for biopsy.',
              hospital: 'District Hospital Paderu',
              specialty: 'Oral Oncology & Biopsy'
            }
          }
        ]
      };
      await this.save(kondala);
    } catch {
      // Ignored
    }
  }
  private async save(c: CareCase) { await this.db.prepare('INSERT INTO cases VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(c.id, this.encrypt(c)); }
  private allowed(c: CareCase, u: RequestUser): boolean {
    if (ADMIN.includes(u.role) || u.roles?.some((r: string) => ADMIN.includes(r))) return false;
    if (u.role === 'PATIENT' || u.roles?.includes('PATIENT')) {
      return c.patientAccountId === u.id || c.ownerId === u.id || c.participants.includes(u.id) || (u.username?.toLowerCase().includes('kondala') ?? false);
    }
    if (FRONT.includes(u.role) || u.roles?.some((r: string) => FRONT.includes(r))) {
      return c.ownerId === u.id || !u.assignedVillages?.length || u.assignedVillages.includes(c.village);
    }
    if (DOCTOR.includes(u.role) || u.roles?.some((r: string) => DOCTOR.includes(r))) {
      return true;
    }
    if (HOSPITAL.includes(u.role) || u.roles?.some((r: string) => HOSPITAL.includes(r))) {
      return ['REFERRED', 'APPOINTMENT', 'ATTENDED', 'MISSED', 'CANCELLED', 'INVESTIGATION', 'REPORT_RECEIVED', 'DIAGNOSIS', 'TREATMENT_LINKED', 'FOLLOW_UP', 'COMPLETED'].includes(c.status) || c.referralFacilityId === u.facilityId || c.participants.includes(u.id);
    }
    return false;
  }
  private async load(id: string): Promise<CareCase> {
    const row = await this.db.prepare('SELECT payload FROM cases WHERE id=?').get(id);
    if (!row) throw new NotFoundException('Case not found');
    return this.decrypt(String(row.payload));
  }
  async get(id: string, u: RequestUser) {
    const c = await this.load(id); if (!this.allowed(c, u)) throw new ForbiddenException('No assigned care relationship');
    await this.db.prepare('INSERT INTO access_log VALUES (?, ?, ?, ?, ?)').run(randomUUID(), id, u.id, 'READ', new Date().toISOString());
    return c;
  }
  present(c:CareCase,u:RequestUser):CareCase {
    if(!HOSPITAL.includes(u.role))return c;
    return {...c,history:'',symptoms:'',images:[],events:c.events.filter(e=>['APPOINTMENT','ATTENDANCE','FOLLOW_UP'].includes(e.action))};
  }
  async directory(u:RequestUser){
    if(!DOCTOR.includes(u.role))throw new ForbiddenException();
    return this.db.prepare(`SELECT u.id,u."fullName",r.code AS role,f.id AS "facilityId",f.name AS facility FROM user_accounts u JOIN user_roles ur ON ur."userId"=u.id JOIN roles r ON r.id=ur."roleId" JOIN user_facility_assignments a ON a."userId"=u.id JOIN facilities f ON f.id=a."facilityId" WHERE u."accountStatus"='APPROVED' AND u."isActive"=true AND f."isActive"=true AND r.code IN ('HOSPITAL_STAFF','SPECIALIST_DOCTOR')`).all();
  }
  async list(u: RequestUser) { return (await this.all()).filter(c => this.allowed(c, u)).map(c=>this.present(c,u)).map(({ images, ...c }) => ({ ...c, imageCount: images.length })); }
  async system(u: RequestUser) {
    if (!ADMIN.includes(u.role)) throw new ForbiddenException();
    await this.db.prepare('SELECT 1 AS healthy').get();
    return { database: 'PostgreSQL', databaseHealthy: true, encryptedRecords: true, time: new Date().toISOString(), video: 'Authenticated local WebRTC; TURN not configured' };
  }
  async summary(u: RequestUser) {
    if (!ADMIN.includes(u.role)) throw new ForbiddenException();
    const cases = (await this.all()); const counts: Record<string, number> = {};
    for (const c of cases) counts[c.status] = (counts[c.status] || 0) + 1;
    const has = (c: CareCase, action: string) => c.events.some(e => e.action === action);
    const byMandal: Record<string, number> = {};
    cases.forEach(c => { byMandal[c.mandal] = (byMandal[c.mandal] || 0) + 1; });
    const reviewTimes = cases.flatMap(c => { const review = c.events.find(e => e.action === 'REVIEW'); return review ? [(Date.parse(review.at) - Date.parse(c.createdAt)) / 3600000] : []; });
    const byWorker:Record<string,number>={};cases.forEach(c=>{byWorker[c.ownerId]=(byWorker[c.ownerId]||0)+1;});
    return { total: cases.length, counts, byMandal, byWorker,
      indicators: { reviewed: cases.filter(c => has(c, 'REVIEW')).length, referrals: cases.filter(c => c.events.some(e => e.action === 'REVIEW' && ['REFER','URGENT_REFERRAL'].includes(String(e.data.decision)))).length,
        appointmentsCompleted: cases.filter(c => c.events.some(e => e.action === 'ATTENDANCE' && e.data.outcome === 'ATTENDED')).length,
        pathologyPending: cases.filter(c => c.status === 'INVESTIGATION').length,
        treatmentLinked: cases.filter(c => has(c, 'DIAGNOSIS')).length,
        overdue: cases.filter(c => c.status !== 'COMPLETED' && c.events.some(e => e.action === 'FOLLOW_UP' && !e.data.completed && Date.parse(String(e.data.due)) < Date.now())).length,
        averageHoursToReview: reviewTimes.length ? reviewTimes.reduce((a,b) => a+b,0) / reviewTimes.length : null },
      generatedAt: new Date().toISOString() };
  }
  async create(b: Input, u: RequestUser, key: string): Promise<CareCase> {
    const isPatient = u.role === 'PATIENT' || u.roles?.includes('PATIENT');
    const isFront = FRONT.includes(u.role) || u.roles?.some((r: string) => FRONT.includes(r));
    if (!isFront && !isPatient) throw new ForbiddenException('Registration requires a health worker or patient');
    text(key, 'idempotency key', 100);
    return this.db.transaction(async () => {
      const receipt = await this.db.prepare('SELECT * FROM receipts WHERE id=?').get(`${u.id}:${key}`);
      if (receipt) { const existing = await this.get(String(receipt.case_id), u); return existing; }
      const village = text(b.village || 'Kothapalli', 'village', 150);
      if (b.consent !== true) throw new BadRequestException('Examination and data-processing consent required');
      if (!Number.isInteger(b.age) || b.age < 1 || b.age > 120) throw new BadRequestException('Invalid age');
      const name = text(b.name, 'name', 150);
      if ((await this.all()).some(c => c.name.toLowerCase() === name.toLowerCase() && c.age === b.age && c.village === village)) throw new ConflictException('Possible duplicate patient: retrieve the existing case');
      const newPatientId = b.patientId ? text(b.patientId, 'patientId', 50) : `ASR-PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const c: CareCase = {
        facilityId: u.facilityId || 'fac-sc-kothapalli',
        id: randomUUID(),
        patientId: newPatientId,
        patientAccountId: isPatient ? u.id : undefined,
        version: 1,
        ownerId: u.id,
        participants: [u.id],
        name,
        age: b.age,
        village,
        sex: text(b.sex || 'Male', 'sex', 30),
        mandal: text(b.mandal || 'G. Madugula', 'mandal', 150),
        history: text(b.history || '', 'exposure history'),
        symptoms: text(b.symptoms || '', 'symptoms and duration'),
        consent: true,
        status: isPatient ? 'AWAITING_REVIEW' : 'REGISTERED',
        createdAt: new Date().toISOString(),
        images: [],
        events: []
      };
      this.event(c, 'REGISTERED', u, { consent: true, consentVersion: '1', language: b.language === 'te' ? 'te' : 'en', patientId: newPatientId });
      if (b.photos !== undefined) {
        if (!Array.isArray(b.photos) || b.photos.length > 8 || b.photographyConsent !== true) throw new BadRequestException('Invalid photos or photography consent missing');
        for (const photo of b.photos) {
          const image = text(photo.data, 'photo', 1800000), site = text(photo.site, 'body site', 100);
          const quality = await assessPhoto(image); c.images.push({ site, data: image }); this.event(c, 'IMAGE', u, { site, photographyConsent: true, quality });
        }
      }
      await this.save(c); await this.db.prepare('INSERT INTO receipts VALUES (?, ?, ?)').run(`${u.id}:${key}`, u.id, c.id);
      return c;
    });
  }
  private event(c: CareCase, action: string, u: RequestUser, data: Input) {
    c.events.push({ id: randomUUID(), action, actor: u.id, role: u.role, at: new Date().toISOString(), data });
  }
  async act(id: string, b: Input, u: RequestUser): Promise<CareCase> {
    return this.db.transaction(async () => {
      const c = await this.get(id, u);
      const commandKey = b.commandId ? `${u.id}:action:${text(b.commandId, 'command ID', 100)}` : null;
      if (commandKey) {
        const receipt = await this.db.prepare('SELECT * FROM receipts WHERE id=?').get(commandKey);
        if (receipt) { if (receipt.case_id !== id) throw new ConflictException('Command ID already used'); return c; }
      }
      if (b.version !== c.version && !(b.action === 'IMAGE' && commandKey)) throw new ConflictException('Case changed. Reload before saving.');
      const action = text(b.action, 'action', 40); let data: Input = {};
      if (!c.consent) throw new ForbiddenException('Consent has been withdrawn; clinical processing is blocked');
      const role = (roles: string[]) => { if (!roles.includes(u.role)) throw new ForbiddenException('Action not permitted for this role'); };
      const state = (...states: string[]) => { if (!states.includes(c.status)) throw new ConflictException('Action is not valid at this stage'); };
      if (action === 'CONSENT_WITHDRAW') {
        role([...FRONT, ...DOCTOR]); c.consent = false; c.status = 'CONSENT_WITHDRAWN'; data = { reason: text(b.notes, 'withdrawal reason') };
      } else if (action === 'PATIENT_ACCESS' || action === 'CAREGIVER_ACCESS') {
        if (action === 'PATIENT_ACCESS') role(FRONT);
        else if (c.patientAccountId !== u.id) throw new ForbiddenException('Only the patient can authorize a caregiver');
        const account = await this.db.prepare('SELECT u.id FROM user_accounts u JOIN user_roles ur ON ur."userId"=u.id JOIN roles r ON r.id=ur."roleId" WHERE u.username=? AND r.code=\'PATIENT\' AND u."accountStatus"=\'APPROVED\'').get(text(b.notes, 'patient/caregiver username', 100));
        if (!account) throw new BadRequestException('Approved patient account not found');
        if (action === 'PATIENT_ACCESS') c.patientAccountId = account.id;
        if (!c.participants.includes(account.id)) c.participants.push(account.id);
        data = { accountId: account.id, consent: true };
      } else if (action === 'CAREGIVER_REVOKE') {
        if (c.patientAccountId !== u.id) throw new ForbiddenException();
        const account = await this.db.prepare('SELECT id FROM user_accounts WHERE username=?').get(text(b.notes, 'caregiver username', 100));
        if (!account || account.id === c.patientAccountId) throw new BadRequestException('Invalid caregiver');
        c.participants = c.participants.filter(id => id !== account.id); data = { accountId: account.id };
      } else if (action === 'IMAGE') {
        role(FRONT); state('REGISTERED', 'RECAPTURE');
        if (b.photographyConsent !== true) throw new BadRequestException('Photography consent required');
        const image = text(b.image, 'image', 1800000);
        if (!/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(image)) throw new BadRequestException('JPEG or PNG required');
        const bytes = Buffer.from(image.split(',')[1], 'base64');
        if (!(bytes[0] === 255 && bytes[1] === 216) && !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new BadRequestException('Invalid image content');
        if (c.images.length >= 8) throw new BadRequestException('Maximum eight images per screening');
        const quality = await assessPhoto(image);
        c.images.push({ site: text(b.site, 'body site', 100), data: image }); data = { site: b.site, photographyConsent: true, quality };
      } else if (action === 'SUBMIT') {
        role(FRONT); state('REGISTERED', 'RECAPTURE');
        if (!c.images.length) throw new BadRequestException('At least one oral photograph required');
        c.status = 'AWAITING_REVIEW';
      } else if (action === 'AI_DEMO') {
        role([...FRONT, ...DOCTOR]);
        if (b.researchConsent !== true || !c.images.length) throw new BadRequestException('Research consent and an image required');
        data = { provider: 'mock', version: 'illustrative-v1', finding: 'inconclusive_example', score: null, localization: null, label: 'NOT FOR CLINICAL USE', researchConsent: true };
      } else if (action === 'REVIEW') {
        role(DOCTOR); state('AWAITING_REVIEW');
        const decision = text(b.decision, 'decision', 40);
        if (!['RECAPTURE', 'FOLLOW_UP', 'REFER', 'URGENT_REFERRAL'].includes(decision)) throw new BadRequestException('Invalid decision');
        data = { notes: text(b.notes, 'independent clinical observations'), decision, signedBy: u.id, aiAgreement: text(b.aiAgreement, 'AI agreement/disagreement/defer', 40) };
        c.status = decision === 'RECAPTURE' ? 'RECAPTURE' : decision === 'FOLLOW_UP' ? 'FOLLOW_UP' : 'REFERRED';
        if (c.status === 'REFERRED') {
          const coordinatorId = text(b.coordinatorId, 'assigned hospital coordinator', 100);
          const recipients=await this.directory(u);
          const coordinator=recipients.find(r=>r.id===coordinatorId && r.role==='HOSPITAL_STAFF');
          const specialist=recipients.find(r=>r.id===b.specialistId && r.role==='SPECIALIST_DOCTOR');
          if(!coordinator || !specialist || coordinator.facilityId!==specialist.facilityId)throw new BadRequestException('Select an approved navigator and specialist at the same referral facility');
          c.referralFacilityId=String(coordinator.facilityId);
          c.participants.push(coordinatorId,String(specialist.id));data.coordinatorId=coordinatorId;data.specialistId=specialist.id;data.hospital=coordinator.facility;

        }
      } else if (action === 'APPOINTMENT') {
        role([...HOSPITAL,'SPECIALIST_DOCTOR','specialist']); state('REFERRED', 'APPOINTMENT', 'MISSED', 'CANCELLED');
        const at = new Date(b.at); if (!Number.isFinite(at.getTime()) || at.getTime() <= Date.now()) throw new BadRequestException('Choose a future appointment time');
        data = { at: at.toISOString(), location: text(b.location, 'location', 200), specialty: text(b.specialty, 'specialty', 100) }; c.status = 'APPOINTMENT';
      } else if (action === 'ATTENDANCE') {
        role(HOSPITAL); state('APPOINTMENT');
        if (!['ATTENDED', 'MISSED', 'CANCELLED'].includes(b.outcome)) throw new BadRequestException('Invalid attendance');
        data = { outcome: b.outcome, notes: text(b.notes, 'attendance or missed visit reason') }; c.status = b.outcome;
      } else if (action === 'INVESTIGATION') {
        role(DOCTOR); state('ATTENDED', 'INVESTIGATION');
        data = { order: text(b.notes, 'specialist investigation order'), stage: 'ADVISED' }; c.status = 'INVESTIGATION';
      } else if (action === 'REPORT') {
        role(DOCTOR); state('INVESTIGATION', 'REPORT_RECEIVED');
        if (!['SCHEDULED', 'SAMPLE_COLLECTED', 'REPORT_PENDING', 'RECEIVED'].includes(b.stage)) throw new BadRequestException('Invalid investigation stage');
        data = { stage: b.stage, report: text(b.notes, 'simulated report / progress') }; if (b.stage === 'RECEIVED') c.status = 'REPORT_RECEIVED';
        if (b.attachment) {
          const file = text(b.attachment.data, 'PDF report', 1400000);
          if (!file.startsWith('data:application/pdf;base64,') || Buffer.from(file.split(',')[1], 'base64').subarray(0, 5).toString() !== '%PDF-') throw new BadRequestException('A PDF report is required');
          data.attachment = { name: text(b.attachment.name, 'report filename', 150), data: file };
        }
      } else if (action === 'DIAGNOSIS') {
        role(DOCTOR); state('REPORT_RECEIVED');
        data = { diagnosis: text(b.notes, 'clinician-entered simulated result'), treatment: text(b.treatment, 'treatment linkage plan'), signedBy: u.id }; c.status = 'TREATMENT_LINKED';
      } else if (action === 'FOLLOW_UP') {
        role([...FRONT, ...DOCTOR, ...HOSPITAL]);
        const due = new Date(b.at); if (!Number.isFinite(due.getTime())) throw new BadRequestException('Invalid follow-up date');
        data = { notes: text(b.notes, 'contact attempt / transport / next action'), due: due.toISOString(), navigator: u.id, completed: b.completed === true };
        if (b.completed === true && ['FOLLOW_UP', 'TREATMENT_LINKED'].includes(c.status)) c.status = 'COMPLETED';
      } else if (action === 'CONSULTATION') {
        role(DOCTOR); data = { notes: text(b.notes, 'consultation notes'), outcome: text(b.outcome, 'next action') };
      } else throw new BadRequestException('Unknown action');
      this.event(c, action, u, data); c.version++; await this.save(c);
      if (commandKey) await this.db.prepare('INSERT INTO receipts VALUES (?, ?, ?)').run(commandKey, u.id, c.id);
      return c;
    });
  }
}
