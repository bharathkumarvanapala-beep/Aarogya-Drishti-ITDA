// Non-destructive migration: preserve SQLite source and ciphertext/key; seed explicit demo accounts.
const fs = require('fs'); const path = require('path'); const { DatabaseSync } = require('node:sqlite');
const { Pool } = require('../backend/node_modules/pg');
const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const argon = require('../backend/node_modules/argon2');
process.loadEnvFile(path.resolve('backend/.env'));
(async () => {
 const prisma = new PrismaClient(); const pool = new Pool({connectionString:process.env.DATABASE_URL.replace(/\?schema=.*$/,'')});
 try {
  await pool.query('CREATE TABLE IF NOT EXISTS care_cases(id text PRIMARY KEY,payload text NOT NULL); CREATE TABLE IF NOT EXISTS care_receipts(id text PRIMARY KEY,owner text NOT NULL,case_id text NOT NULL); CREATE TABLE IF NOT EXISTS care_access_log(id text PRIMARY KEY,case_id text,actor text,action text,at text)');
  if(fs.existsSync('backend/data/care.sqlite')) {
   const old = new DatabaseSync('backend/data/care.sqlite',{readOnly:true}); const client=await pool.connect();
   try {await client.query('BEGIN'); for(const table of ['cases','receipts','access_log']) for(const row of old.prepare('SELECT * FROM '+table).all()) { const cols=Object.keys(row);await client.query(`INSERT INTO care_${table} (${cols.join(',')}) VALUES (${cols.map((_,i)=>'$'+(i+1)).join(',')}) ON CONFLICT(id) DO NOTHING`,Object.values(row)); } await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();old.close();}
  }
  const {AuthService}=require('../backend/dist/src/auth/auth.service'); const {PasswordService}=require('../backend/dist/src/auth/password.service');
  const auth=new AuthService({}, {}, {}, new PasswordService()); const seen=new Set();
  const mandal=await prisma.mandal.upsert({where:{code:'GMAD'},update:{},create:{code:'GMAD',name:'G. Madugula',nameTe:'జి. మాడుగుల'}});
  const hash=await argon.hash('Aarogya@2026');
  for(const p of auth.fallbackPersonas.values()) {
   if(seen.has(p.id))continue;seen.add(p.id);
   const role=await prisma.role.upsert({where:{code:p.role},update:{},create:{code:p.role,name:p.role,description:'Synthetic evaluator role'}});
   const facility=await prisma.facility.upsert({where:{code:p.facilityId},update:{},create:{code:p.facilityId,name:p.facilityName,type:p.facilityType,mandalId:mandal.id}});
   await prisma.userAccount.upsert({where:{id:p.id},update:{},create:{id:p.id,username:p.username,email:p.email,passwordHash:hash,fullName:p.fullName,phone:p.phone,accountStatus:'APPROVED',mfaEnabled:p.mfaEnabled,apmcRegNumber:p.apmcRegNumber,professionalIdNumber:p.professionalIdNumber}});
   await prisma.userRole.upsert({where:{userId_roleId:{userId:p.id,roleId:role.id}},update:{},create:{userId:p.id,roleId:role.id}});
   await prisma.userFacilityAssignment.upsert({where:{userId_facilityId:{userId:p.id,facilityId:facility.id}},update:{},create:{userId:p.id,facilityId:facility.id,isPrimary:true}});
   for(const name of p.assignedVillages) {const code='DEMO-'+Buffer.from(name).toString('hex').slice(0,26);const v=await prisma.village.upsert({where:{code},update:{},create:{code,name,nameTe:name,mandalId:mandal.id,primaryFacilityId:facility.id}});await prisma.userVillageAssignment.upsert({where:{userId_villageId:{userId:p.id,villageId:v.id}},update:{},create:{userId:p.id,villageId:v.id}});}
  }
  console.log('Migration completed; original SQLite files preserved. Seeded',seen.size,'individual evaluator accounts.');
 } finally {await pool.end();await prisma.$disconnect();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
