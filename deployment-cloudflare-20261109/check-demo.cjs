const assert = require('node:assert/strict');
const base = process.env.DEMO_CHECK_URL || 'http://127.0.0.1:3202';
async function call(p, body, token, expected = 200, key) {
 const r = await fetch(base + '/api/v1' + p, {method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(key?{'X-Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const j=await r.json(); assert.equal(r.status,expected,`${p}: ${r.status}`); return j.data;
}
(async()=>{
 const page=await fetch(base+'/login',{headers:{accept:'text/html'}}); assert.equal(page.status,200); assert.match(await page.text(),/DEMO ONLY/);
 await call('/care/cases',null,null,401);
 let worker;
 for(const [username,requestedRole] of [['asha_lakshmi','asha'],['anm_sarada','anm'],['dr_suresh','doctor'],['dr_ananya','specialist'],['hosp_paderu','hospital_coordinator'],['admin_rajesh','admin'],['pat_kondala','patient']]){
  let a=await call('/auth/login',{username,password:'Aarogya@2026',requestedRole});
  if(a.requiresMfa) a=await call('/auth/mfa/verify',{mfaSessionToken:a.mfaSessionToken,totpCode:'123456'});
  assert.ok(a.accessToken); if(username==='asha_lakshmi')worker=a;
  if(username==='admin_rajesh'){const s=await call('/care/system',null,a.accessToken);assert.equal(s.database,'PostgreSQL');assert.equal(s.databaseHealthy,true);}
  console.log(requestedRole+' login passed');
 }
 const c=await call('/care/cases',{name:'Synthetic Demo Patient',age:45,sex:'Female',mandal:'G. Madugula',village:worker.user.assignedVillages[0],history:'Synthetic example: no tobacco exposure',symptoms:'Synthetic screening demonstration',consent:true,language:'en'},worker.accessToken,201,'public-demo-synthetic-patient-1');
 assert.equal((await call('/care/cases/'+c.id,null,worker.accessToken)).name,'Synthetic Demo Patient');
 console.log('Demo notice, anonymous denial, PostgreSQL health, synthetic registration and retrieval passed.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
