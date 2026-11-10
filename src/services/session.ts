import type { UserRole } from '../types';
export function serverRole(role:string):UserRole {
 const roles:Record<string,UserRole>={ASHA_WORKER:'asha',ANM_WORKER:'anm',COMMUNITY_HEALTH_OFFICER:'health_worker',MEDICAL_OFFICER:'doctor',SPECIALIST_DOCTOR:'specialist',HOSPITAL_STAFF:'hospital_coordinator',DISTRICT_ADMIN:'admin',SUPER_ADMIN:'admin',PATIENT:'patient'};
 if(!roles[role])throw new Error('ROLE_UNSUPPORTED');return roles[role];
}
export function dashboardFor(role:UserRole):string {return ({doctor:'/doctor',specialist:'/specialist',hospital_coordinator:'/navigator',admin:'/admin',patient:'/patient/portal'} as Partial<Record<UserRole,string>>)[role]||'/health-worker';}
let renewal:Promise<boolean>|null=null;
export async function apiRequest(path:string,body?:unknown,method?:string,retry=true,key?:string):Promise<any> {
 const options:RequestInit={method:method||(body===undefined?'GET':'POST'),credentials:'same-origin',headers:{...(key?{'X-Idempotency-Key':key}:{}),'Content-Type':'application/json','X-Session-Mode':'cookie','X-Remember-Me':localStorage.getItem('ad_remember')==='true'?'true':'false'},signal:AbortSignal.timeout(path === '/medgemma/analyze' ? 65000 : 25000),...(body===undefined?{}:{body:JSON.stringify(body)})};
 let response:Response;
 try{response=await fetch('/api/v1'+path,options);}catch{throw new Error('NETWORK_ERROR');}
 if(response.status===401 && retry && !path.startsWith('/auth/login') && !path.startsWith('/auth/mfa') && !path.startsWith('/auth/reset')) {
  if(!renewal)renewal=apiRequest('/auth/refresh',{},'POST',false).then(()=>true,()=>false).finally(()=>{renewal=null;});
  if(await renewal)return apiRequest(path,body,method,false,key);
  window.dispatchEvent(new Event('ad-session-expired'));
 }
 let json:any;try{json=await response.json();}catch{throw new Error('SERVER_ERROR');}
 if(!response.ok){
  let msg = json.error?.message || json.message || 'SERVER_ERROR';
  if(json.error?.details && Array.isArray(json.error.details) && json.error.details.length > 0) {
    msg = json.error.details.map((d: any) => d.message).join(' • ');
  }
  throw new Error(msg);
 }
 return json.data??json;
}
