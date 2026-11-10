// Creates only a new isolated demonstration schema; never reseeds the live schema.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');const dep=n=>require(path.join(root,'backend/node_modules',n));
async function main(){
 if(process.env.CONFIRM_ISOLATED_DEMO!=='yes')throw Error('CONFIRM_ISOLATED_DEMO=yes required');
 const source=dep('dotenv').parse(fs.readFileSync(path.join(root,'backend/.env.vercel')));
 const url=new URL(source.DATABASE_URL);url.searchParams.set('schema','aarogya_demo');
 const env={...process.env,DATABASE_URL:url.href,DEMO_MODE:'true',CARE_SCHEMA:'aarogya_demo',NODE_ENV:'staging',JWT_SECRET:crypto.randomBytes(32).toString('hex'),JWT_REFRESH_SECRET:crypto.randomBytes(32).toString('hex'),CARE_KEY_BASE64:crypto.randomBytes(32).toString('base64'),JWT_EXPIRES_IN:'15m',ALLOW_DEMO_AUTH_FALLBACK:'false',CORS_ORIGIN:'https://aarogya-drishti-demo.vercel.app',APP_ORIGIN:'https://aarogya-drishti-demo.vercel.app',OPENCV_SERVICE_URL:'https://aarogya-drishti-quality.vercel.app'};
 const pool=new (dep('pg').Pool)({connectionString:source.DATABASE_URL});
 try{const existing=await pool.query("SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema='aarogya_demo'");if(existing.rows[0].n)throw Error('Demo schema already exists; refusing to overwrite it');}finally{await pool.end();}
 fs.mkdirSync(path.join(root,'.local'),{recursive:true});
 const schema=path.join(root,'.local/demo-schema.prisma');fs.copyFileSync(path.join(root,'backend/prisma/schema.prisma'),schema);
 const push=cp.spawnSync(process.execPath,[path.join(root,'backend/node_modules/prisma/build/index.js'),'db','push','--schema',schema,'--skip-generate'],{env,encoding:'utf8'});if(push.status)throw Error('Creating isolated demo schema failed');
 const db=new (dep('@prisma/client').PrismaClient)({datasourceUrl:env.DATABASE_URL});
 try{
  await db.$executeRawUnsafe('CREATE TABLE aarogya_demo.auth_attempts(key text PRIMARY KEY,attempts integer NOT NULL DEFAULT 0,window_start timestamptz NOT NULL DEFAULT now())');
  const mandal=await db.mandal.create({data:{code:'DEMO-GMAD',name:'G. Madugula',nameTe:'జి. మాడుగుల'}});
  const clinic=await db.facility.create({data:{code:'DEMO-PHC',name:'G. Madugula Demo PHC',type:'PRIMARY_HEALTH_CENTRE',mandalId:mandal.id}});
  const hospital=await db.facility.create({data:{code:'DEMO-DH',name:'Paderu Demo Hospital',type:'DISTRICT_HOSPITAL',mandalId:mandal.id}});
  const village=await db.village.create({data:{code:'DEMO-KOTHA',name:'Kothapalli',nameTe:'కొత్తపల్లి',mandalId:mandal.id,primaryFacilityId:clinic.id}});
  const entries=[['asha_lakshmi','Lakshmi Devi','ASHA_WORKER','ASHA-GMAD-01'],['anm_sarada','Sarada Devi','ANM_WORKER','ANM-GMAD-01'],['doc_suresh','Dr. K. Suresh','MEDICAL_OFFICER','APMC/2018/04912'],['admin_rajesh','District Administrator','DISTRICT_ADMIN','admin_rajesh'],['hrc_varma','Rajesh Varma','HOSPITAL_STAFF','HRC-ASR-042'],['specialist_priya','Dr. Priya','SPECIALIST_DOCTOR','specialist_priya']];
  const hash=await dep('argon2').hash('Aarogya@2026',{type:dep('argon2').argon2id});
  for(const [username,name,code,professionalIdNumber] of entries){const role=await db.role.create({data:{code,name:code,description:'Isolated synthetic evaluator role'}});await db.userAccount.create({data:{username,fullName:name+' (Demo)',email:username+'@demo.aarogya.invalid',passwordHash:hash,professionalIdNumber,accountStatus:'APPROVED',isActive:true,mfaEnabled:false,roles:{create:{roleId:role.id}},facilityAssignments:{create:{facilityId:['HOSPITAL_STAFF','SPECIALIST_DOCTOR'].includes(code)?hospital.id:clinic.id,isPrimary:true}},villageAssignments:{create:{villageId:village.id}}}});}
  const keys=['DATABASE_URL','DEMO_MODE','CARE_SCHEMA','NODE_ENV','JWT_SECRET','JWT_REFRESH_SECRET','CARE_KEY_BASE64','JWT_EXPIRES_IN','ALLOW_DEMO_AUTH_FALLBACK','CORS_ORIGIN','APP_ORIGIN','OPENCV_SERVICE_URL'];
  fs.writeFileSync(path.join(root,'.local/demo-api.env'),keys.map(k=>`${k}=${JSON.stringify(env[k])}`).join('\n'));
  console.log('Created six approved demo accounts in the isolated aarogya_demo schema. Live accounts unchanged.');
 }finally{await db.$disconnect();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
