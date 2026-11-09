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
  const t = (en: string, te: string) => language === 'te' ? te : en;
  const [cases, setCases] = useState<CareRecord[]>([]), [active, setActive] = useState<CareRecord | null>(null);
  const [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<{total: number; counts: Record<string, number>} | null>(null);
  const [form, setForm] = useState({ name: '', age: 46, sex: 'male', village: 'Kothapalli', mandal: 'G. Madugula', history: '', symptoms: '', consent: false });
  const [passphrase, setPassphrase] = useState('');
  const [action, setAction] = useState(''), [notes, setNotes] = useState(''), [at, setAt] = useState('');
  const [decision, setDecision] = useState('REFER'), [stage, setStage] = useState('SCHEDULED'), [outcome, setOutcome] = useState('ATTENDED');
  const [treatment, setTreatment] = useState(''), [agreement, setAgreement] = useState('DEFER'), [completed, setCompleted] = useState(false);
  const [site, setSite] = useState('Right cheek'), [image, setImage] = useState(''), [photoConsent, setPhotoConsent] = useState(false), [researchConsent, setResearchConsent] = useState(false);
  const [location, setLocation] = useState('District Hospital Paderu'), [specialty, setSpecialty] = useState('Oral medicine');
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
      setActive(record); await refresh(); setMessage(t('Registration saved on server.', 'నమోదు సర్వర్‌లో భద్రపరచబడింది.'));
    });
  }
  async function apply(e: React.FormEvent) {
    e.preventDefault(); if (!active) return;
    await run(async () => {
      setActive(await careApi(`/cases/${active.id}/actions`, { version: active.version, action, notes, at: at ? new Date(at).toISOString() : '', decision, stage, outcome, treatment, aiAgreement: agreement, completed, image, site, photographyConsent: photoConsent, researchConsent, ...(action === 'REPORT' ? { attachment } : {}),
        coordinatorId: 'f1e4d653-1421-717e-c072-040404040404', hospital: location, location, specialty }));
      await refresh(); setMessage(t('Saved and recorded in the case history.', 'వివరాలు కేసు చరిత్రలో భద్రపరచబడ్డాయి.')); setAction(''); setNotes('');
    });
  }
  async function readImage(file?: File) {
    if (!file) return;
    await run(async () => {
      if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 1300000) throw new Error('Select a JPEG/PNG smaller than 1.3 MB.');
      const data = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); });
      const img = await createImageBitmap(file);
      if (img.width < 320 || img.height < 240) { img.close(); throw new Error('Image resolution is too low. Retake with better framing.'); }
      const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64; const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0, 64, 64); img.close();
      const pixels = ctx.getImageData(0, 0, 64, 64).data; let brightness = 0;
      for (let i = 0; i < pixels.length; i += 4) brightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      brightness /= 4096;
      if (brightness < 25 || brightness > 240) throw new Error('Image is too dark or overexposed. Adjust lighting and retake.');
      setImage(data); setMessage('Preview checked for resolution and exposure. Review focus and glare before submitting.');
    });
  }
  const actions: [string, string][] = [];
  if (front && active && ['REGISTERED', 'RECAPTURE'].includes(active.status)) actions.push(['IMAGE', t('Add oral photograph', 'నోటి ఫోటో జోడించండి')], ['SUBMIT', t('Send for doctor review', 'వైద్య సమీక్షకు పంపండి')]);
  if ((front || doctor) && active?.images?.length) actions.push(['AI_DEMO', t('Research demonstration', 'పరిశోధన ప్రదర్శన')]);
  if (doctor && active?.status === 'AWAITING_REVIEW') actions.push(['REVIEW', t('Sign clinical review', 'వైద్య సమీక్ష నమోదు')]);
  if (hospital && active && ['REFERRED', 'APPOINTMENT', 'MISSED', 'CANCELLED'].includes(active.status)) actions.push(['APPOINTMENT', t('Book / reschedule appointment', 'అపాయింట్‌మెంట్ నమోదు')]);
  if (hospital && active?.status === 'APPOINTMENT') actions.push(['ATTENDANCE', t('Attendance / missed visit', 'హాజరు వివరాలు')]);
  if (doctor && active && ['ATTENDED', 'INVESTIGATION'].includes(active.status)) actions.push(['INVESTIGATION', t('Order investigation', 'పరీక్ష సూచించండి')]);
  if (hospital && active && ['INVESTIGATION', 'REPORT_RECEIVED'].includes(active.status)) actions.push(['REPORT', t('Update investigation / report', 'పరీక్ష నివేదిక నమోదు')]);
  if (doctor && active?.status === 'REPORT_RECEIVED') actions.push(['DIAGNOSIS', t('Review result and treatment plan', 'ఫలితం మరియు చికిత్స ప్రణాళిక')]);
  if (doctor) actions.push(['CONSULTATION', t('Document consultation', 'సంప్రదింపు నమోదు')]);
  if (front || doctor || hospital) actions.push(['FOLLOW_UP', t('Navigation and follow-up', 'సహాయం మరియు తదుపరి పరిశీలన')]);
  if (front || doctor) actions.push(['CONSENT_WITHDRAW', t('Withdraw consent', 'సమ్మతి ఉపసంహరణ')]);
  if (front) actions.push(['PATIENT_ACCESS', t('Link patient account (enter username in notes)', 'రోగి ఖాతాను అనుసంధానించండి')]);
  if (role === 'patient') actions.push(['CAREGIVER_ACCESS', t('Authorize caregiver (enter username in notes)', 'సహాయకునికి అనుమతి ఇవ్వండి')], ['CAREGIVER_REVOKE', t('Revoke caregiver (enter username in notes)', 'సహాయకుని అనుమతి తొలగించండి')]);
  const field = (label: string, value: string, change: (s: string) => void, type = 'text') => <label className="block space-y-1">{label}<input className={inputClass} type={type} value={value} onChange={e => change(e.target.value)} required /></label>;
  return <div className="space-y-5 pb-10">
    <header className="space-y-3"><h1 className="text-3xl font-bold">{t('Connected care journey', 'సమగ్ర ఆరోగ్య సేవలు')}</h1><p>{t('Synthetic demonstration only — not for clinical use.', 'నమూనా ప్రదర్శన మాత్రమే — వైద్య వినియోగానికి కాదు.')}</p><LanguageSwitcher /></header>
    <div className="flex gap-4"><Link to="/login" className="underline">{t('Sign in / change staff account', 'లాగిన్ / ఖాతా మార్చండి')}</Link><button onClick={() => run(async () => { await refresh(); if (active) await open(active.id); })}>{t('Refresh', 'రిఫ్రెష్')}</button></div>
    {error && <p role="alert" className="p-4 bg-red-50 text-red-800 rounded">{t('Could not complete action: ', 'చర్య పూర్తి కాలేదు: ')}{error}</p>}
    {message && <p role="status" className="p-4 bg-green-50 rounded">{message}</p>}
    {summary && <section className="p-5 bg-white rounded-xl"><h2 className="text-xl font-bold">{t('District indicators', 'జిల్లా సూచికలు')}</h2><p>Total: {summary.total}</p>{Object.entries(summary.counts).map(([k,v]) => <p key={k}>{k}: {v}</p>)}<p>Aggregates only; individual records are restricted.</p></section>}
    {front && <details className="p-5 bg-white rounded-xl" open={!cases.length}><summary className="font-bold text-xl">{t('Register patient', 'రోగి నమోదు')}</summary><form onSubmit={register} className="grid sm:grid-cols-2 gap-4 mt-4">
      {field(t('Name', 'పేరు'), form.name, name => setForm({ ...form, name }))}
      {field(t('Age', 'వయస్సు'), String(form.age), age => setForm({ ...form, age: Number(age) }), 'number')}
      {field(t('Sex', 'లింగం'), form.sex, sex => setForm({ ...form, sex }))}
      {field(t('Village', 'గ్రామం'), form.village, village => setForm({ ...form, village }))}
      {field(t('Mandal', 'మండలం'), form.mandal, mandal => setForm({ ...form, mandal }))}
      {field(t('Habits, frequency and duration', 'అలవాట్లు, తరచుదనం మరియు వ్యవధి'), form.history, history => setForm({ ...form, history }))}
      {field(t('Symptoms and duration', 'లక్షణాలు మరియు వ్యవధి'), form.symptoms, symptoms => setForm({ ...form, symptoms }))}
      <label className="p-3"><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} required /> {t('Consent for examination and data processing', 'పరీక్ష మరియు వివరాల వినియోగానికి సమ్మతి')}</label>
      <button disabled={busy} className="p-3 bg-forest-800 text-white rounded-lg">{t('Register on server', 'సర్వర్‌లో నమోదు')}</button>
      <label>{t('Offline passphrase (12+ characters)', 'ఆఫ్‌లైన్ పాస్‌ఫ్రేజ్ (12+ అక్షరాలు)')}<input className={inputClass} type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} /></label>
      <label>Optional registration photo (also saved offline)<input className={inputClass} type="file" accept="image/jpeg,image/png" capture="environment" onChange={e => readImage(e.target.files?.[0])} /></label>
      <label><input type="checkbox" checked={photoConsent} onChange={e => setPhotoConsent(e.target.checked)} /> Photography consent / ఫోటో సమ్మతి</label>
      <button type="button" disabled={busy || !form.consent || (!!image && !photoConsent)} onClick={() => run(async () => { await saveOffline(currentUser!.id, registration(), passphrase); setMessage('Encrypted draft saved on this device. Keep your passphrase to synchronize.'); })} className="p-3 border rounded">{t('Save encrypted offline draft', 'ఆఫ్‌లైన్‌లో భద్రపరచండి')}</button>
      <button type="button" disabled={busy} onClick={() => run(async () => { const count = await syncOffline(currentUser!.id, passphrase); await refresh(); setMessage(`${count} registrations acknowledged by server.`); })} className="p-3 border rounded">{t('Synchronize saved registrations', 'భద్రపరచిన నమోదులను సింక్ చేయండి')}</button>
    </form></details>}
    {role !== 'admin' && <section className="grid md:grid-cols-[240px_1fr] gap-5"><nav aria-label="Care cases" className="space-y-2"><h2 className="font-bold">{t('Assigned cases', 'కేటాయించిన కేసులు')}</h2>{cases.map(c => <button key={c.id} className="block text-left w-full p-3 bg-white rounded border" onClick={() => run(() => open(c.id))}>{c.name}<small className="block">{c.status}</small></button>)}{!cases.length && <p>{t('No assigned cases yet.', 'కేటాయించిన కేసులు లేవు.')}</p>}</nav>
      {active && <article className="bg-white p-5 rounded-xl space-y-5 min-w-0"><h2 className="text-2xl font-bold">{active.name} · {active.age}</h2><p className="break-all">{active.id}</p><p>{active.village} / {active.mandal} · {active.status} · v{active.version}</p><p>{active.history}</p><p>{active.symptoms}</p>
        <div className="flex gap-3 flex-wrap">{active.images.map((im, i) => <figure key={i}><a href={im.data} target="_blank" rel="noreferrer"><img className="w-40 h-32 object-contain" src={im.data} alt={im.site} /></a><figcaption>{im.site}</figcaption></figure>)}</div>
        <label className="block">{t('Next action', 'తదుపరి చర్య')}<select className={inputClass} value={action} onChange={e => setAction(e.target.value)}><option value="">{t('Choose action', 'చర్య ఎంచుకోండి')}</option>{actions.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {action && <form onSubmit={apply} className="space-y-3">
          {action === 'IMAGE' && <><label>{t('Oral photograph', 'నోటి ఫోటో')}<input aria-label="Oral photograph" className={inputClass} type="file" accept="image/jpeg,image/png" capture="environment" onChange={e => readImage(e.target.files?.[0])} /></label>{field(t('Body site', 'శరీర భాగం'), site, setSite)}{image && <img className="w-60" src={image} alt="Preview" />}<label><input type="checkbox" required checked={photoConsent} onChange={e => setPhotoConsent(e.target.checked)} /> {t('Photography consent recorded', 'ఫోటో సమ్మతి నమోదు చేయబడింది')}</label></>}
          {action === 'AI_DEMO' && <label><input type="checkbox" required checked={researchConsent} onChange={e => setResearchConsent(e.target.checked)} /> {t('Separate research consent. Mock output, no diagnosis or localization.', 'పరిశోధన సమ్మతి. నమూనా ఫలితం మాత్రమే.')}</label>}
          {action === 'REVIEW' && <><label>Decision<select className={inputClass} value={decision} onChange={e => setDecision(e.target.value)}>{['REFER','URGENT_REFERRAL','FOLLOW_UP','RECAPTURE'].map(x => <option key={x}>{x}</option>)}</select></label><label>AI assessment<select className={inputClass} value={agreement} onChange={e => setAgreement(e.target.value)}>{['DEFER','AGREE','DISAGREE'].map(x => <option key={x}>{x}</option>)}</select></label>{field('Referral hospital', location, setLocation)}</>}
          {['APPOINTMENT','FOLLOW_UP'].includes(action) && field(t('Date and time (local)', 'తేదీ మరియు సమయం'), at, setAt, 'datetime-local')}
          {action === 'APPOINTMENT' && <>{field('Hospital / location', location, setLocation)}{field('Specialty', specialty, setSpecialty)}</>}
          {action === 'ATTENDANCE' && <select aria-label="Attendance" className={inputClass} value={outcome} onChange={e => setOutcome(e.target.value)}>{['ATTENDED','MISSED','CANCELLED'].map(x => <option key={x}>{x}</option>)}</select>}
          {action === 'REPORT' && <select aria-label="Investigation stage" className={inputClass} value={stage} onChange={e => setStage(e.target.value)}>{['SCHEDULED','SAMPLE_COLLECTED','REPORT_PENDING','RECEIVED'].map(x => <option key={x}>{x}</option>)}</select>}
          {action === 'REPORT' && <label>Attach synthetic pathology PDF<input className={inputClass} type="file" accept="application/pdf" onChange={e => { const file = e.target.files?.[0]; if (!file) return; void run(async () => { if (file.size > 1000000) throw new Error('Report must be smaller than 1 MB'); const data = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); }); setAttachment({ name: file.name, data }); }); }} /></label>}
          {action === 'DIAGNOSIS' && field(t('Treatment linkage plan', 'చికిత్స ప్రణాళిక'), treatment, setTreatment)}
          {action === 'CONSULTATION' && field(t('Outcome and next action', 'ఫలితం మరియు తదుపరి చర్య'), outcome, setOutcome)}
          {!['IMAGE','SUBMIT','AI_DEMO','APPOINTMENT'].includes(action) && <label className="block">{t('Independent notes / report / reason', 'వివరాలు / నివేదిక / కారణం')}<textarea className={inputClass} required value={notes} onChange={e => setNotes(e.target.value)} /></label>}
          {action === 'FOLLOW_UP' && <label><input type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)} /> {t('Follow-up completed', 'తదుపరి పరిశీలన పూర్తయింది')}</label>}
          <button disabled={busy || (action === 'IMAGE' && !image)} className="p-3 bg-forest-800 text-white rounded">{t('Save action', 'భద్రపరచండి')}</button>
          {action === 'IMAGE' && <><label>Offline passphrase<input type="password" className={inputClass} value={passphrase} onChange={e => setPassphrase(e.target.value)} /></label><button type="button" className="p-3 border rounded" disabled={busy || !image || !photoConsent} onClick={() => run(async () => { await saveOffline(currentUser!.id, { operation: 'ACTION', caseId: active.id, body: { version: active.version, action: 'IMAGE', image, site, photographyConsent: photoConsent } }, passphrase); setMessage('Photo encrypted and queued. Synchronize from the registration section when connected.'); })}>Save photo offline / ఫోటో ఆఫ్‌లైన్‌లో భద్రపరచండి</button></>}
        </form>}
        <CareVideo key={active.id} caseId={active.id} />
        <button onClick={() => window.print()} className="p-3 border rounded">{t('Print referral and case history', 'రిఫరల్ మరియు కేసు చరిత్ర ముద్రించండి')}</button>
        <h3 className="text-xl font-bold">{t('Longitudinal history and audit', 'కేసు చరిత్ర')}</h3>{active.events.map(e => <section key={e.id} className="p-3 border-l-4 border-forest-200"><strong>{e.action}</strong><p>{new Date(e.at).toLocaleString(language === 'te' ? 'te-IN' : 'en-IN')} · {e.actor}</p>{Object.entries(e.data).map(([k,v]) => k === 'attachment' && v && typeof v === 'object' ? <a className="underline" key={k} download={String((v as {name:string}).name)} href={String((v as {data:string}).data)}>Download simulated report</a> : <p key={k} className="break-words">{k}: {String(v)}</p>)}</section>)}
      </article>}
    </section>}
  </div>;
}
