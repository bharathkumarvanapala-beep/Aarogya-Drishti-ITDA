import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { careApi } from '../../services/careApi';
type Staff = { id: string; fullName: string; role: string; accountStatus: string; assignedVillages: string[] };
export function ConnectedAdminPage() {
  const system = useLocation().pathname.endsWith('/system');
  const [staff,setStaff] = useState<Staff[]>([]), [health,setHealth] = useState<Record<string,unknown>>({}), [error,setError] = useState('');
  async function request(path:string, body?:unknown) {
    const r=await fetch('/api/v1/auth'+path,{method:body?'PATCH':'GET',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('aarogya_jwt_token')}`},...(body?{body:JSON.stringify(body)}:{})});
    const data=await r.json();if(!r.ok)throw new Error(data.error?.message||data.message||'Request failed');return data.data;
  }
  async function load(){try{if(system)setHealth(await careApi('/system'));else setStaff(await request('/admin/registrations?status=ALL'));}catch(e){setError(String(e));}}
  useEffect(()=>{void load();},[system]);
  async function update(id:string,action:string){setError('');try{await request(`/admin/registrations/${id}/status`,{action});await load();}catch(e){setError(String(e));}}
  return <section className="space-y-4"><h1 className="text-2xl font-bold">{system?'System health / సిస్టమ్ స్థితి':'Staff approval / సిబ్బంది ఆమోదం'}</h1>{error&&<p role="alert">{error}</p>}
    {system?Object.entries(health).map(([k,v])=><p key={k}>{k}: {String(v)}</p>):staff.map(u=><article key={u.id} className="p-4 bg-white rounded border space-y-2"><h2 className="font-bold">{u.fullName}</h2><p>{u.role} · {u.accountStatus}</p><p>{u.assignedVillages.join(', ')}</p>{['APPROVE','REJECT','SUSPEND'].map(action=><button key={action} className="p-3 border rounded mr-2" onClick={()=>update(u.id,action)}>{action}</button>)}</article>)}
  </section>;
}
