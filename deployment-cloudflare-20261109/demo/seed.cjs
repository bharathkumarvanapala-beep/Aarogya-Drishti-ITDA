const path=require('node:path'); const root=path.resolve(__dirname,'../..'); const {PrismaClient}=require(root+'/backend/node_modules/@prisma/client'); const argon=require(root+'/backend/node_modules/argon2');
module.exports=async()=>{const prisma=new PrismaClient();try{
  if(process.env.CONFIRM_SYNTHETIC_SEED!=='yes'||!process.env.DEMO_SEED_PASSWORD||process.env.DEMO_SEED_PASSWORD.length<12)throw Error('Explicit synthetic seed confirmation and private password required');
  const {AuthService}=require(root+'/backend/dist/src/auth/auth.service'); const {PasswordService}=require(root+'/backend/dist/src/auth/password.service');
  const auth=new AuthService({}, {}, {}, new PasswordService()); const seen=new Set();
  const mandal=await prisma.mandal.upsert({where:{code:'GMAD'},update:{},create:{code:'GMAD',name:'G. Madugula',nameTe:'జి. మాడుగుల'}});
  const hash=await argon.hash(process.env.DEMO_SEED_PASSWORD);
  for(const p of auth.fallbackPersonas.values()) {
   if(seen.has(p.id))continue;seen.add(p.id);
   p.email=p.username+'@example.invalid'; p.fullName='Synthetic Demo '+p.role; p.phone=null;
   const role=await prisma.role.upsert({where:{code:p.role},update:{},create:{code:p.role,name:p.role,description:'Synthetic evaluator role'}});
   const facility=await prisma.facility.upsert({where:{code:p.facilityId},update:{},create:{code:p.facilityId,name:p.facilityName,type:p.facilityType,mandalId:mandal.id}});
   await prisma.userAccount.upsert({where:{id:p.id},update:{},create:{id:p.id,username:p.username,email:p.email,passwordHash:hash,fullName:p.fullName,phone:p.phone,accountStatus:'APPROVED',mfaEnabled:p.mfaEnabled,apmcRegNumber:p.apmcRegNumber,professionalIdNumber:p.professionalIdNumber}});
   await prisma.userRole.upsert({where:{userId_roleId:{userId:p.id,roleId:role.id}},update:{},create:{userId:p.id,roleId:role.id}});
   await prisma.userFacilityAssignment.upsert({where:{userId_facilityId:{userId:p.id,facilityId:facility.id}},update:{},create:{userId:p.id,facilityId:facility.id,isPrimary:true}});
   for(const name of p.assignedVillages) {const code='DEMO-'+Buffer.from(name).toString('hex').slice(0,26);const v=await prisma.village.upsert({where:{code},update:{},create:{code,name,nameTe:name,mandalId:mandal.id,primaryFacilityId:facility.id}});await prisma.userVillageAssignment.upsert({where:{userId_villageId:{userId:p.id,villageId:v.id}},update:{},create:{userId:p.id,villageId:v.id}});}
  }

return seen.size;}finally{await prisma.$disconnect();}};
