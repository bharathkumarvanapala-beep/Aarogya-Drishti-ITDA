import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context';
import {useTranslation} from '../../i18n';
import {authCopy,authErrorKey} from '../../i18n/auth';
import {dashboardFor} from '../../services/session';
import type {UserRole} from '../../types';

export const DEMO_PASSWORD='Aarogya@2026';
export const demoAccounts:{role:UserRole;username:string;name:string;label:string;te:string;id:string}[]=[
 {role:'patient',username:'pat_kondala',name:'Kondala Rao (Citizen / Caregiver)',label:'Patient & Family Portal',te:'రోగి మరియు కుటుంబ పోర్టల్',id:'ASR-PAT-2026-0842'},
 {role:'asha',username:'asha_lakshmi',name:'Lakshmi Devi',label:'ASHA Worker Portal',te:'ఆశా కార్యకర్త పోర్టల్',id:'ASHA-GMAD-01'},
 {role:'doctor',username:'doc_suresh',name:'Dr. K. Suresh Kumar',label:'Doctor Portal',te:'వైద్యుల పోర్టల్',id:'APMC/2018/04912'},
 {role:'hospital_coordinator',username:'hosp_paderu',name:'Rajesh Varma',label:'Hospital Referral Coordinator',te:'ఆసుపత్రి రిఫరల్ సమన్వయకర్త',id:'HRC-ASR-042'},
 {role:'admin',username:'admin_rajesh',name:'District Administrator',label:'District Admin Portal',te:'జిల్లా నిర్వాహక పోర్టల్',id:'ADM-ITDA-01'},
 {role:'specialist',username:'spec_anitha',name:'Dr. Anitha (Specialist Oncologist)',label:'Specialist Portal',te:'ప్రత్యేక వైద్యుల పోర్టల్',id:'APMC/2012/59021'},
];
export function DemoAccounts(){
 const {language}=useTranslation(),auth=useAuth(),navigate=useNavigate();const [busy,setBusy]=useState(''),[error,setError]=useState('');
 async function enter(account:typeof demoAccounts[number]){setBusy(account.username);setError('');try{const result=await auth.signIn(account.role,account.username,DEMO_PASSWORD);if(result.success&&result.role)navigate(dashboardFor(result.role),{replace:true});else setError(authCopy[language][authErrorKey(result.error||'')]);}finally{setBusy('');}}
 return <section className="mx-auto max-w-6xl px-5 pb-12" aria-labelledby="demo-title"><h2 id="demo-title" className="text-2xl font-bold">{language==='te'?'ప్రదర్శన ఖాతాలు':'Demo accounts'}</h2><p className="my-3">{language==='te'?'కల్పిత సమాచారం మాత్రమే. పాత్రను ఎంచుకుని ప్రదర్శనలోకి ప్రవేశించండి. అన్ని ప్రదర్శన ఖాతాల పాస్‌వర్డ్:':'Synthetic data only. Choose a role to enter the demo. Default password for every demo account:'} <code className="font-bold">{DEMO_PASSWORD}</code></p>{error&&<p role="alert" className="p-3 bg-rose-50 text-rose-800">{error}</p>}<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{demoAccounts.map(a=><article key={a.username} className="rounded-2xl bg-white border border-teal-100 p-6 shadow-sm"><h3 className="text-xl font-bold">{language==='te'?a.te:a.label}</h3><p className="mt-2">{a.name}</p><p className="text-sm mt-1">{a.id}</p><p className="mt-4">{authCopy[language].identifier}: <code>{a.username}</code></p><button disabled={!!busy} className="mt-5 w-full rounded-xl bg-forest-800 text-white p-3 disabled:opacity-60" onClick={()=>void enter(a)}>{busy===a.username?authCopy[language].signing:language==='te'?'ప్రదర్శనలోకి ప్రవేశించండి':'Quick evaluator demo →'}</button></article>)}</div></section>;
}
