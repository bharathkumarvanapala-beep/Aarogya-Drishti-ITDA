const assert=require('node:assert/strict'),fs=require('fs');const base='https://aarogya-drishti-demo.vercel.app';
const entries=[['doc_suresh','MEDICAL_OFFICER'],['asha_lakshmi','ASHA_WORKER'],['anm_sarada','ANM_WORKER'],['admin_rajesh','DISTRICT_ADMIN'],['hrc_varma','HOSPITAL_STAFF'],['specialist_priya','SPECIALIST_DOCTOR']];
const headers={'Content-Type':'application/json','X-Session-Mode':'cookie',Origin:base};const results=[];
async function req(path,cookie,body){return fetch(base+'/api/v1'+path,{method:body?'POST':'GET',headers:{...headers,...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});}
(async()=>{
 for(const [username,role] of entries){
  const res=await req('/auth/login','',{username,password:'Aarogya@2026'});const json=await res.json();assert.equal(res.status,200,username+': '+JSON.stringify(json));const data=json.data||json;assert(!data.requiresMfa);assert.equal(data.user.role,role);assert(!data.accessToken&&!data.refreshToken);
  const raw=res.headers.getSetCookie();assert.equal(raw.length,2);assert(raw.every(c=>c.includes('Secure')&&c.includes('HttpOnly')));const cookie=raw.map(c=>c.split(';')[0]).join('; ');
  const me=await req('/auth/me',cookie);assert.equal(me.status,200);const profile=await me.json();assert.equal((profile.data||profile).role,role);
  assert.equal((await req(role==='DISTRICT_ADMIN'?'/care/summary':'/care/cases',cookie)).status,200);
  if(role!=='DISTRICT_ADMIN')assert.equal((await req('/auth/admin/registrations',cookie)).status,403);
  const cross=await fetch('https://aarogya-drishti-api.vercel.app/api/v1/auth/me',{headers:{Cookie:cookie}});assert.equal(cross.status,401,'Demo cookie must be rejected by regular service');
  assert.equal((await req('/auth/logout',cookie,{})).status,200);assert.equal((await req('/auth/me',cookie)).status,401);
  results.push({username,role,passed:true});console.log(username+': login, profile, workspace, permissions, isolation and logout passed');
 }
 fs.writeFileSync('output/demo-login-results.json',JSON.stringify({origin:base,results},null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1});

