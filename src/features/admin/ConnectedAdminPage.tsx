import {careLabel} from '../../i18n/care-ui';
import { apiRequest } from '../../services/session';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { careApi } from '../../services/careApi';
import { useTranslation } from '../../i18n';
import { authCopy,authErrorKey } from '../../i18n/auth';
type Staff={email?:string;id:string;fullName:string;username:string;role:string;accountStatus:string;facilityId?:string;assignedVillages:string[];assignedVillageIds:string[]};
type Directory={facilities:{id:string;name:string;mandalId:string}[];villages:{id:string;name:string;mandalId:string}[];roles:string[]};
export function ConnectedAdminPage(){
 const {language}=useTranslation(),c=authCopy[language];const system=useLocation().pathname.endsWith('/system');
 const [staff,setStaff]=useState<Staff[]>([]),[directory,setDirectory]=useState<Directory|null>(null),[health,setHealth]=useState<Record<string,unknown>>({}),[error,setError]=useState(''),[busy,setBusy]=useState(false),[enrollment,setEnrollment]=useState('');
 const [selected,setSelected]=useState(''),[role,setRole]=useState('ASHA_WORKER'),[facilityId,setFacility]=useState(''),[villageIds,setVillages]=useState<string[]>([]);
 const [creating,setCreating]=useState(false),[username,setUsername]=useState(''),[fullName,setName]=useState(''),[email,setEmail]=useState('');
 async function load(){if(system)setHealth(await careApi('/system'));else{setStaff(await apiRequest('/auth/admin/registrations?status=ALL'));setDirectory(await apiRequest('/auth/admin/directory'));}}
 async function run(work:()=>Promise<void>){setBusy(true);setError('');try{await work();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 useEffect(()=>{void run(load);},[system]);
 function choose(u:Staff){setEmail(u.email||'');setSelected(u.id);setCreating(false);setRole(u.role);setFacility(u.facilityId||'');setVillages(u.assignedVillageIds||[]);setEnrollment('');}
 const roleLabel=(r:string)=>c[r==='MEDICAL_OFFICER'?'medical':r==='SPECIALIST_DOCTOR'?'specialist':r==='HOSPITAL_STAFF'?'navigator':r==='DISTRICT_ADMIN'?'admin':'health'];
 return <section className="space-y-5"><h1 className="text-3xl font-bold">{system?c.system:c.staff}</h1>{error&&<p role="alert" className="p-4 bg-rose-50 text-rose-800">{error==='ASSIGN_FACILITY_BEFORE_APPROVAL'?c.facility+' · '+c.save:c[authErrorKey(error)]}</p>}{busy&&<p role="status">{c.working}</p>}
 {system?Object.entries(health).map(([k,v])=><p key={k}>{k}: {String(v)}</p>):<>
 <button className="p-3 rounded bg-forest-800 text-white" onClick={()=>{setCreating(true);setSelected('');setRole('ASHA_WORKER');setFacility('');setVillages([]);setEnrollment('');}}>{c.create}</button>
 {(creating||selected)&&directory&&<form className="p-5 bg-white rounded-xl border space-y-4" onSubmit={e=>{e.preventDefault();void run(async()=>{const result=await apiRequest(creating?'/auth/admin/accounts':`/auth/admin/accounts/${selected}/assignments`,{role,facilityId,villageIds,...(email?{email}:{}),...(creating?{username,fullName}:{})},creating?'POST':'PATCH');setEnrollment(result.enrollmentUri||'');await load();});}}>
 {creating&&<><label className="block">{c.identifier}<input required className="block border rounded p-3 w-full" value={username} onChange={e=>setUsername(e.target.value)}/></label><label className="block">{c.name}<input required className="block border rounded p-3 w-full" value={fullName} onChange={e=>setName(e.target.value)}/></label></>}
 <label className="block">{c.email}<input required type="email" className="block border rounded p-3 w-full" value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="block">{c.role}<select className="block border rounded p-3 w-full" value={role} onChange={e=>setRole(e.target.value)}>{directory.roles.map(r=><option key={r} value={r}>{roleLabel(r)} · {r}</option>)}</select></label>
 <label className="block">{c.facility}<select required className="block border rounded p-3 w-full" value={facilityId} onChange={e=>{setFacility(e.target.value);setVillages([]);}}><option value="">—</option>{directory.facilities.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
 <fieldset><legend>{c.villages}</legend>{directory.villages.filter(v=>v.mandalId===directory.facilities.find(f=>f.id===facilityId)?.mandalId).map(v=><label key={v.id} className="inline-flex p-3 gap-2"><input type="checkbox" checked={villageIds.includes(v.id)} onChange={e=>setVillages(e.target.checked?[...villageIds,v.id]:villageIds.filter(id=>id!==v.id))}/>{v.name}</label>)}</fieldset>
 <button disabled={busy} className="p-3 bg-forest-800 text-white rounded">{creating?c.create:c.save}</button><button type="button" className="p-3" onClick={()=>{setCreating(false);setSelected('');setEnrollment('');}}>{c.cancel}</button>
 </form>}
 {enrollment&&<div className="p-4 bg-amber-50 rounded break-all" role="status"><p>{c.mfaSetup}</p><code>{enrollment}</code><button className="block p-3" onClick={()=>setEnrollment('')}>{c.hide}</button></div>}
 {staff.map(u=><article key={u.id} className="p-5 bg-white rounded-xl border space-y-3"><h2 className="font-bold text-lg">{u.fullName}</h2><p>{roleLabel(u.role)} · {careLabel(language,u.accountStatus)}</p><p>{u.assignedVillages.join(', ')}</p><div className="flex flex-wrap gap-2"><button className="p-3 border rounded" onClick={()=>choose(u)}>{c.save}</button>{(['APPROVE','REJECT','SUSPEND'] as const).map(action=><button disabled={busy} key={action} className="p-3 border rounded" onClick={()=>void run(async()=>{await apiRequest(`/auth/admin/registrations/${u.id}/status`,{action},'PATCH');await load();})}>{c[action==='APPROVE'?'approve':action==='REJECT'?'reject':'suspend']}</button>)}<button disabled={busy} className="p-3 border rounded" onClick={()=>void run(async()=>{setEnrollment((await apiRequest(`/auth/admin/accounts/${u.id}/mfa-enrollment`,{})).enrollmentUri);})}>{c.mfa}</button></div></article>)}{!staff.length&&!busy&&<p>{c.empty}</p>}
 </>}
 </section>;
}
