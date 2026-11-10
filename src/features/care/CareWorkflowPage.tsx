import {careLabel} from '../../i18n/care-ui';
import {careCopy,type CareCopyKey} from '../../i18n/care';
import { authCopy } from '../../i18n/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import { careApi, type CareRecord } from '../../services/careApi';
import { saveOffline, syncOffline } from '../../services/careOffline';
import { CareVideo } from '../doctor/CareVideo';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

const inputClass = 'w-full border border-forest-200 rounded-lg p-3 bg-white';
export function CareWorkflowPage() {
  const { currentUser, role } = useAuth(); const { language } = useTranslation();
  const l=(text:string)=>careLabel(language,text);
  const t = (key:CareCopyKey) => careCopy[language][key];
  const [cases, setCases] = useState<CareRecord[]>([]), [active, setActive] = useState<CareRecord | null>(null);
  const [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<{total: number; counts: Record<string, number>; byMandal:Record<string,number>;byWorker:Record<string,number>;indicators:Record<string,number|null>} | null>(null);
  const [form, setForm] = useState({ name: '', age: 46, sex: 'male', village: 'Kothapalli', mandal: 'G. Madugula', history: '', symptoms: '', consent: false });
  const [passphrase, setPassphrase] = useState('');
  const [action, setAction] = useState(''), [notes, setNotes] = useState(''), [at, setAt] = useState('');
  const [decision, setDecision] = useState('REFER'), [stage, setStage] = useState('SCHEDULED'), [outcome, setOutcome] = useState('ATTENDED');
  const [treatment, setTreatment] = useState(''), [agreement, setAgreement] = useState('DEFER'), [completed, setCompleted] = useState(false);
  const [site, setSite] = useState('Right cheek'), [image, setImage] = useState(''), [photoConsent, setPhotoConsent] = useState(false), [researchConsent, setResearchConsent] = useState(false);
  const [location, setLocation] = useState('District Hospital Paderu'), [specialty, setSpecialty] = useState('Oral medicine');
  const [directory,setDirectory]=useState<{id:string;fullName:string;role:string;facilityId:string;facility:string}[]>([]);
  const [coordinatorId,setCoordinatorId]=useState(''),[specialistId,setSpecialistId]=useState('');
  useEffect(()=>{if(role==='doctor'||role==='specialist')void careApi<typeof directory>('/directory').then(setDirectory).catch(()=>{});},[role]);
  const [attachment, setAttachment] = useState<{ name: string; data: string } | undefined>();
  const registration = () => ({ ...form, language, ...(image ? { photos: [{ site, data: image }], photographyConsent: photoConsent } : {}) });
  const front = ['health_worker', 'asha', 'anm'].includes(role || ''); const doctor = ['doctor', 'specialist'].includes(role || ''); const hospital = role === 'hospital_coordinator';
  async function refresh() {
    if (role === 'admin') setSummary(await careApi('/summary'));
    else setCases(await careApi('/cases'));
  }
  async function run(work: () => Promise<void>) {
    setBusy(true); setError(''); setMessage('');
    try { await work(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save. Please retry.'); } finally { setBusy(false); }
  }
  useEffect(() => { void run(refresh); }, [role]);
  async function open(id: string) { setActive(await careApi(`/cases/${id}`)); setAction(''); setNotes(''); setImage(''); }
  async function register(e: React.FormEvent) {
    e.preventDefault(); await run(async () => {
      const record = await careApi<CareRecord>('/cases', registration(), crypto.randomUUID());
      setActive(record); await refresh(); setMessage(t('care0'));
    });
  }
  async function apply(e: React.FormEvent) {
    e.preventDefault(); if (!active) return;
    await run(async () => {
      setActive(await careApi(`/cases/${active.id}/actions`, { version: active.version, action, notes, at: at ? new Date(at).toISOString() : '', decision, stage, outcome, treatment, aiAgreement: agreement, completed, image, site, photographyConsent: photoConsent, researchConsent, ...(action === 'REPORT' ? { attachment } : {}),
        coordinatorId, specialistId, hospital: location, location, specialty }));
      await refresh(); setMessage(t('care1')); setAction(''); setNotes('');
    });
  }
  async function readImage(file?: File) {
    if (!file) return;
    await run(async () => {
      if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 1300000) throw new Error(l('Select a JPEG/PNG smaller than 1.3 MB.'));
      const data = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); });
      const img = await createImageBitmap(file);
      if (img.width < 320 || img.height < 240) { img.close(); throw new Error('Image resolution is too low. Retake with better framing.'); }
      const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64; const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0, 64, 64); img.close();
      const pixels = ctx.getImageData(0, 0, 64, 64).data; let brightness = 0;
      for (let i = 0; i < pixels.length; i += 4) brightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      brightness /= 4096;
      if (brightness < 25 || brightness > 240) throw new Error(l('Image is too dark or overexposed. Adjust lighting and retake.'));
      setImage(data); setMessage(l('Preview checked for resolution and exposure. Review focus and glare before submitting.'));
    });
  }
  const actions: [string, string][] = [];
  if (front && active && ['REGISTERED', 'RECAPTURE'].includes(active.status)) actions.push(['IMAGE', t('care2')], ['SUBMIT', t('care3')]);
  if ((front || doctor) && active?.images?.length) actions.push(['AI_DEMO', t('care4')]);
  if (doctor && active?.status === 'AWAITING_REVIEW') actions.push(['REVIEW', t('care5')]);
  if ((hospital || role==='specialist') && active && ['REFERRED', 'APPOINTMENT', 'MISSED', 'CANCELLED'].includes(active.status)) actions.push(['APPOINTMENT', t('care6')]);
  if (hospital && active?.status === 'APPOINTMENT') actions.push(['ATTENDANCE', t('care7')]);
  if (doctor && active && ['ATTENDED', 'INVESTIGATION'].includes(active.status)) actions.push(['INVESTIGATION', t('care8')]);
  if (doctor && active && ['INVESTIGATION', 'REPORT_RECEIVED'].includes(active.status)) actions.push(['REPORT', t('care9')]);
  if (doctor && active?.status === 'REPORT_RECEIVED') actions.push(['DIAGNOSIS', t('care10')]);
  if (doctor) actions.push(['CONSULTATION', t('care11')]);
  if (front || doctor || hospital) actions.push(['FOLLOW_UP', t('care12')]);
  if (front || doctor) actions.push(['CONSENT_WITHDRAW', t('care13')]);
  if (front) actions.push(['PATIENT_ACCESS', t('care14')]);
  if (role === 'patient') actions.push(['CAREGIVER_ACCESS', t('care15')], ['CAREGIVER_REVOKE', t('care16')]);
  const field = (label: string, value: string, change: (s: string) => void, type = 'text') => <label className="block space-y-1">{label}<input className={inputClass} type={type} value={value} onChange={e => change(e.target.value)} required /></label>;
  return <div className="space-y-5 pb-10">
    <header className="space-y-3"><h1 className="text-3xl font-bold">{authCopy[language][role==='admin'?'admin':role==='specialist'?'specialist':role==='doctor'?'medical':role==='hospital_coordinator'?'navigator':'health']}</h1><p>{t('care17')}</p><LanguageSwitcher /></header>
    <div className="flex gap-4"><Link to="/login" className="underline">{t('care18')}</Link><button onClick={() => run(async () => { await refresh(); if (active) await open(active.id); })}>{t('care19')}</button></div>
    {error && <p role="alert" className="p-4 bg-red-50 text-red-800 rounded">{t('care20')}{error}</p>}
    {message && <p role="status" className="p-4 bg-green-50 rounded">{message}</p>}
    {summary && <section className="p-5 bg-white rounded-xl"><h2 className="text-xl font-bold">{t('care21')}</h2><p>{l('Total')}: {summary.total}</p>{Object.entries(summary.counts).map(([k,v]) => <p key={k}>{k}: {v}</p>)}<p>{l('Aggregates only; individual records are restricted.')}</p></section>}
    {front && <details className="p-5 bg-white rounded-xl" open={!cases.length}><summary className="font-bold text-xl">{t('care22')}</summary><form onSubmit={register} className="grid sm:grid-cols-2 gap-4 mt-4">
      {field(t('care23'), form.name, name => setForm({ ...form, name }))}
      {field(t('care24'), String(form.age), age => setForm({ ...form, age: Number(age) }), 'number')}
      {field(t('care25'), form.sex, sex => setForm({ ...form, sex }))}
      {field(t('care26'), form.village, village => setForm({ ...form, village }))}
      {field(t('care27'), form.mandal, mandal => setForm({ ...form, mandal }))}
      {field(t('care28'), form.history, history => setForm({ ...form, history }))}
      {field(t('care29'), form.symptoms, symptoms => setForm({ ...form, symptoms }))}
      <label className="p-3"><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} required /> {t('care30')}</label>
      <button disabled={busy} className="p-3 bg-forest-800 text-white rounded-lg">{t('care31')}</button>
      <label>{t('care32')}<input className={inputClass} type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} /></label>
      <label>{l('Optional registration photo (also saved offline)')}<input className={inputClass} type="file" accept="image/jpeg,image/png" capture="environment" onChange={e => readImage(e.target.files?.[0])} /></label>
      <label><input type="checkbox" checked={photoConsent} onChange={e => setPhotoConsent(e.target.checked)} /> {l('Photography consent')}</label>
      <button type="button" disabled={busy || !form.consent || (!!image && !photoConsent)} onClick={() => run(async () => { await saveOffline(currentUser!.id, registration(), passphrase); setMessage(l('Encrypted draft saved on this device. Keep your passphrase to synchronize.')); })} className="p-3 border rounded">{t('care33')}</button>
      <button type="button" disabled={busy} onClick={() => run(async () => { const count = await syncOffline(currentUser!.id, passphrase); await refresh(); setMessage(`${count} ${l('registrations acknowledged by server.')}`); })} className="p-3 border rounded">{t('care34')}</button>
    </form></details>}
    {role==='admin'&&summary&&<div className="grid gap-5 md:grid-cols-2">{[[l('Mandal'),summary.byMandal],[l('Health worker activity'),summary.byWorker],[l('Programme indicators'),summary.indicators]].map(([heading,values])=><section key={String(heading)} className="bg-white rounded-xl p-5"><h2 className="font-bold">{String(heading)}</h2><dl>{Object.entries(values||{}).map(([key,value])=><div className="flex justify-between gap-4 py-2 border-b break-all" key={key}><dt>{key}</dt><dd>{String(value??'—')}</dd></div>)}</dl></section>)}</div>}
    {role !== 'admin' && <section className="grid md:grid-cols-[240px_1fr] gap-5"><nav aria-label={l('Care cases')} className="space-y-2"><h2 className="font-bold">{t('care35')}</h2>{cases.map(c => <button key={c.id} className="block text-left w-full p-3 bg-white rounded border" onClick={() => run(() => open(c.id))}>{c.name}<small className="block">{l(c.status)}</small></button>)}{!cases.length && <p>{t('care36')}</p>}</nav>
      {active && <article className="bg-white p-5 rounded-xl space-y-5 min-w-0"><h2 className="text-2xl font-bold">{active.name} · {active.age}</h2><p className="break-all">{active.id}</p><p>{active.village} / {active.mandal} · {l(active.status)} · v{active.version}</p><p>{active.history}</p><p>{active.symptoms}</p>
        <div className="flex gap-3 flex-wrap">{active.images.map((im, i) => <figure key={i}><a href={im.data} target="_blank" rel="noreferrer"><img className="w-40 h-32 object-contain" src={im.data} alt={im.site} /></a><figcaption>{im.site}</figcaption></figure>)}</div>
        <label className="block">{t('care37')}<select className={inputClass} value={action} onChange={e => setAction(e.target.value)}><option value="">{t('care38')}</option>{actions.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {action && <form onSubmit={apply} className="space-y-3">
          {action === 'IMAGE' && <><label>{t('care39')}<input aria-label={l('Oral photograph')} className={inputClass} type="file" accept="image/jpeg,image/png" capture="environment" onChange={e => readImage(e.target.files?.[0])} /></label>{field(t('care40'), site, setSite)}{image && <img className="w-60" src={image} alt={l('Preview')} />}<label><input type="checkbox" required checked={photoConsent} onChange={e => setPhotoConsent(e.target.checked)} /> {t('care41')}</label></>}
          {action === 'AI_DEMO' && <label><input type="checkbox" required checked={researchConsent} onChange={e => setResearchConsent(e.target.checked)} /> {t('care42')}</label>}
          {action === 'REVIEW' && <><label>{l('Decision')}<select className={inputClass} value={decision} onChange={e => setDecision(e.target.value)}>{['REFER','URGENT_REFERRAL','FOLLOW_UP','RECAPTURE'].map(x => <option key={x} value={x}>{l(x)}</option>)}</select></label><label>{l('AI assessment')}<select className={inputClass} value={agreement} onChange={e => setAgreement(e.target.value)}>{['DEFER','AGREE','DISAGREE'].map(x => <option key={x} value={x}>{l(x)}</option>)}</select></label><label>{authCopy[language].navigator}<select required className={inputClass} value={coordinatorId} onChange={e=>setCoordinatorId(e.target.value)}><option value="">—</option>{directory.filter(u=>u.role==='HOSPITAL_STAFF').map(u=><option key={u.id} value={u.id}>{u.fullName} · {u.facility}</option>)}</select></label><label>{authCopy[language].specialist}<select required className={inputClass} value={specialistId} onChange={e=>setSpecialistId(e.target.value)}><option value="">—</option>{directory.filter(u=>u.role==='SPECIALIST_DOCTOR'&&u.facilityId===directory.find(x=>x.id===coordinatorId)?.facilityId).map(u=><option key={u.id} value={u.id}>{u.fullName}</option>)}</select></label></>}
          {['APPOINTMENT','FOLLOW_UP'].includes(action) && field(t('care43'), at, setAt, 'datetime-local')}
          {action === 'APPOINTMENT' && <>{field(l('Hospital / location'), location, setLocation)}{field(l('Specialty'), specialty, setSpecialty)}</>}
          {action === 'ATTENDANCE' && <select aria-label={l('Attendance')} className={inputClass} value={outcome} onChange={e => setOutcome(e.target.value)}>{['ATTENDED','MISSED','CANCELLED'].map(x => <option key={x} value={x}>{l(x)}</option>)}</select>}
          {action === 'REPORT' && <select aria-label={l('Investigation stage')} className={inputClass} value={stage} onChange={e => setStage(e.target.value)}>{['SCHEDULED','SAMPLE_COLLECTED','REPORT_PENDING','RECEIVED'].map(x => <option key={x} value={x}>{l(x)}</option>)}</select>}
          {action === 'REPORT' && <label>{l('Attach synthetic pathology PDF')}<input className={inputClass} type="file" accept="application/pdf" onChange={e => { const file = e.target.files?.[0]; if (!file) return; void run(async () => { if (file.size > 1000000) throw new Error(l('Report must be smaller than 1 MB')); const data = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); }); setAttachment({ name: file.name, data }); }); }} /></label>}
          {action === 'DIAGNOSIS' && field(t('care44'), treatment, setTreatment)}
          {action === 'CONSULTATION' && field(t('care45'), outcome, setOutcome)}
          {!['IMAGE','SUBMIT','AI_DEMO','APPOINTMENT'].includes(action) && <label className="block">{t('care46')}<textarea className={inputClass} required value={notes} onChange={e => setNotes(e.target.value)} /></label>}
          {action === 'FOLLOW_UP' && <label><input type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)} /> {t('care47')}</label>}
          <button disabled={busy || (action === 'IMAGE' && !image)} className="p-3 bg-forest-800 text-white rounded">{t('care48')}</button>
          {action === 'IMAGE' && <><label>{l('Offline passphrase')}<input type="password" className={inputClass} value={passphrase} onChange={e => setPassphrase(e.target.value)} /></label><button type="button" className="p-3 border rounded" disabled={busy || !image || !photoConsent} onClick={() => run(async () => { await saveOffline(currentUser!.id, { operation: 'ACTION', caseId: active.id, body: { version: active.version, action: 'IMAGE', image, site, photographyConsent: photoConsent } }, passphrase); setMessage(l('Photo encrypted and queued. Synchronize from the registration section when connected.')); })}>{l('Save photo offline')}</button></>}
        </form>}
        {!hospital && <CareVideo key={active.id} caseId={active.id} />}
        <button onClick={() => window.print()} className="p-3 border rounded">{t('care49')}</button>
        <h3 className="text-xl font-bold">{t('care50')}</h3>{active.events.map(e => <section key={e.id} className="p-3 border-l-4 border-forest-200"><strong>{e.action}</strong><p>{new Date(e.at).toLocaleString(language === 'te' ? 'te-IN' : 'en-IN')} · {e.actor}</p>{Object.entries(e.data).map(([k,v]) => k === 'attachment' && v && typeof v === 'object' ? <a className="underline" key={k} download={String((v as {name:string}).name)} href={String((v as {data:string}).data)}>{l('Download simulated report')}</a> : <p key={k} className="break-words">{k}: {String(v)}</p>)}</section>)}
      </article>}
    </section>}
  </div>;
}

