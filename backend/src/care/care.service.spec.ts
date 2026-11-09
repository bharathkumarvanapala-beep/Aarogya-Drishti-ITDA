import 'dotenv/config';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Pool } from 'pg';
import sharp from 'sharp';
import { CareService } from './care.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { assessPhoto } from './image-quality';

describe('PostgreSQL care integration', () => {
 let service: CareService, dir: string, schema: string;
 const worker: RequestUser={id:'worker',username:'worker',role:'ASHA_WORKER',assignedVillages:['Kothapalli']};
 const doctor: RequestUser={id:'doctor',username:'doctor',role:'MEDICAL_OFFICER',assignedVillages:['Kothapalli']};
 const hospital: RequestUser={id:'f1e4d653-1421-717e-c072-040404040404',username:'hospital',role:'HOSPITAL_STAFF'};
 const admin: RequestUser={id:'admin',username:'admin',role:'DISTRICT_ADMIN'};
 const payload={name:'Synthetic patient',age:46,sex:'male',village:'Kothapalli',mandal:'G. Madugula',history:'Tobacco daily for 20 years',symptoms:'White patch for 3 weeks',consent:true};
 beforeEach(()=>{dir=mkdtempSync(join(tmpdir(),'care-test-'));schema='test_care_'+Date.now()+'_'+Math.floor(Math.random()*10000);process.env.CARE_SCHEMA=schema;process.env.CARE_DATA_DIR=dir;service=new CareService();});
 afterEach(async()=>{await service.onModuleDestroy();const pool=new Pool({connectionString:process.env.DATABASE_URL?.replace(/\?schema=.*$/,'')});await pool.query('DROP SCHEMA '+schema+' CASCADE');await pool.end();delete process.env.CARE_SCHEMA;delete process.env.CARE_DATA_DIR;rmSync(dir,{recursive:true,force:true});});
 async function photo(){const raw=Buffer.alloc(640*480*3);for(let y=0;y<480;y++)for(let x=0;x<640;x++){const v=((x>>3)+(y>>3))%2?170:80;raw.fill(v,(y*640+x)*3,(y*640+x)*3+3);}return 'data:image/png;base64,'+(await sharp(raw,{raw:{width:640,height:480,channels:3}}).png().toBuffer()).toString('base64');}
 it('persists and deduplicates concurrent retries, denies unassigned access',async()=>{
  const [a,b]=await Promise.all([service.create(payload,worker,'one'),service.create(payload,worker,'one')]);expect(a.id).toBe(b.id);
  await expect(service.get(a.id,admin)).rejects.toThrow();await expect(service.get(a.id,hospital)).rejects.toThrow();
  await service.onModuleDestroy();service=new CareService();expect((await service.get(a.id,worker)).name).toBe(payload.name);
 });
 it('rejects missing consent, stale updates and invalid image bytes',async()=>{
  await expect(service.create({...payload,consent:false},worker,'one')).rejects.toThrow();
  const c=await service.create(payload,worker,'one');
  await expect(service.act(c.id,{action:'SUBMIT',version:0},worker)).rejects.toThrow('Case changed');
  await expect(service.act(c.id,{action:'IMAGE',version:1,photographyConsent:true,site:'Cheek',image:'data:image/jpeg;base64,/9j/2Q=='},worker)).rejects.toThrow();
 });
 it('completes care, supports offline photo retry and refuses revoked consent',async()=>{
  let c=await service.create({...payload,photos:[{site:'Cheek',data:await photo()}],photographyConsent:true},worker,'one');
  const act=async(action:string,u:RequestUser,extra:Record<string,unknown>={})=>c=await service.act(c.id,{action,version:c.version,...extra},u);
  await act('IMAGE',worker,{image:await photo(),site:'Tongue',photographyConsent:true,commandId:'photo-one'});const version=c.version;
  await act('IMAGE',worker,{image:await photo(),site:'Tongue',photographyConsent:true,commandId:'photo-one'});expect(c.version).toBe(version);expect(c.images.length).toBe(2);
  await act('AI_DEMO',worker,{researchConsent:true});await act('SUBMIT',worker);
  await act('REVIEW',doctor,{notes:'Independent findings',decision:'REFER',aiAgreement:'DISAGREE',coordinatorId:hospital.id,hospital:'District hospital'});
  const at=new Date(Date.now()+86400000).toISOString();await act('APPOINTMENT',hospital,{at,location:'Hospital',specialty:'Oral medicine'});
  await act('ATTENDANCE',hospital,{outcome:'MISSED',notes:'Transport'});await act('APPOINTMENT',hospital,{at,location:'Hospital',specialty:'Oral medicine'});
  await act('ATTENDANCE',hospital,{outcome:'ATTENDED',notes:'Arrived'});await act('INVESTIGATION',doctor,{notes:'Simulated biopsy'});
  await act('REPORT',hospital,{stage:'RECEIVED',notes:'Synthetic result'});await act('DIAGNOSIS',doctor,{notes:'Clinician result',treatment:'Treatment linked'});
  await act('FOLLOW_UP',worker,{at,notes:'Attendance confirmed',completed:true});expect(c.status).toBe('COMPLETED');expect((await service.summary(admin)).counts.COMPLETED).toBe(1);
  await act('CONSENT_WITHDRAW',worker,{notes:'Patient requested'});await expect(act('AI_DEMO',worker,{researchConsent:true})).rejects.toThrow('withdrawn');
 });
 it('decodes quality checks and rejects dark, glare and flat blurred images',async()=>{
  expect((await assessPhoto(await photo())).verdict).toBe('ACCEPTABLE');
  for(const value of [0,255,120]){const image=await sharp({create:{width:640,height:480,channels:3,background:{r:value,g:value,b:value}}}).png().toBuffer();await expect(assessPhoto('data:image/png;base64,'+image.toString('base64'))).rejects.toThrow('Retake');}
 });
});
