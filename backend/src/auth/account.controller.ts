import { authTable } from './auth-table';
import { Body, Controller, Get, Post, Patch, Param, UseGuards, BadRequestException, ForbiddenException } from '@nestjs/common';
import { IsString, IsEmail, IsIn, IsUUID, IsArray, ArrayMaxSize, MaxLength, MinLength, IsOptional } from 'class-validator';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from './guards/roles.guard';
import { PrismaService } from '../database/prisma.service';
import { PasswordService } from './password.service';
import { newTotpSecret, protectSecret } from './totp';
const roles=['ASHA_WORKER','ANM_WORKER','COMMUNITY_HEALTH_OFFICER','MEDICAL_OFFICER','SPECIALIST_DOCTOR','HOSPITAL_STAFF','DISTRICT_ADMIN'];
export class AssignmentDto {
 @IsOptional() @IsEmail() email?:string;
 @IsIn(roles) role:string;
 @IsUUID() facilityId:string;
 @IsArray() @ArrayMaxSize(100) @IsUUID(undefined,{each:true}) villageIds:string[];
}
export class CreateAccountDto extends AssignmentDto {
 @IsString() @MinLength(3) @MaxLength(64) username:string;
 @IsString() @MinLength(2) @MaxLength(128) fullName:string;
 @IsEmail() email:string;
}
@Controller('auth/admin')
@Roles('DISTRICT_ADMIN','SUPER_ADMIN')
@UseGuards(RolesGuard)
export class AccountController {
 constructor(private readonly db:PrismaService,private readonly passwords:PasswordService){}
 @Get('directory') async directory(){return {facilities:await this.db.facility.findMany({where:{isActive:true},select:{id:true,name:true,mandalId:true}}),villages:await this.db.village.findMany({select:{id:true,name:true,mandalId:true,primaryFacilityId:true}}),roles};}
 private async validate(dto:AssignmentDto){const facility=await this.db.facility.findUnique({where:{id:dto.facilityId}});if(!facility?.isActive)throw new BadRequestException('INVALID_FACILITY');const villages=await this.db.village.findMany({where:{id:{in:dto.villageIds}}});if(villages.length!==new Set(dto.villageIds).size || villages.some(v=>v.mandalId!==facility.mandalId))throw new BadRequestException('INVALID_VILLAGE_SCOPE');}
 @Post('accounts') async create(@Body() dto:CreateAccountDto,@CurrentUser('id') actor:string){
  await this.validate(dto);const secret=newTotpSecret();const privileged=['MEDICAL_OFFICER','SPECIALIST_DOCTOR','DISTRICT_ADMIN'].includes(dto.role);
  const passwordHash=await this.passwords.hash(this.passwords.generateRandomToken(32));
  const user=await this.db.$transaction(async tx=>{const user=await tx.userAccount.create({data:{username:dto.username,email:dto.email,fullName:dto.fullName,passwordHash,accountStatus:'APPROVED',approvedById:actor,approvedAt:new Date(),mfaEnabled:privileged,mfaSecret:privileged?protectSecret(secret):null,roles:{create:{role:{connect:{code:dto.role as any}}}},facilityAssignments:{create:{facilityId:dto.facilityId,isPrimary:true}},villageAssignments:{create:dto.villageIds.map(villageId=>({villageId}))}}});await tx.auditLog.create({data:{action:'ACCOUNT_CREATE',entityName:'UserAccount',entityId:user.id,performedById:actor,changesJson:{role:dto.role,facilityId:dto.facilityId}}});return user;});
  return {id:user.id,username:user.username,enrollmentUri:privileged?`otpauth://totp/Aarogya%20Drishti:${encodeURIComponent(user.username)}?secret=${secret}&issuer=Aarogya%20Drishti`:undefined,message:'Use email password recovery to set the initial password. Deliver authenticator enrollment privately to the verified account owner.'};
 }
 @Patch('accounts/:id/assignments') async assign(@Param('id') id:string,@Body() dto:AssignmentDto,@CurrentUser('id') actor:string){
  if(id===actor)throw new ForbiddenException('SELF_ROLE_CHANGE_DENIED');await this.validate(dto);
  const privileged=['MEDICAL_OFFICER','SPECIALIST_DOCTOR','DISTRICT_ADMIN'].includes(dto.role);
  await this.db.$transaction(async tx=>{await tx.userRole.deleteMany({where:{userId:id}});await tx.userRole.create({data:{userId:id,roleId:(await tx.role.findUniqueOrThrow({where:{code:dto.role as any}})).id}});await tx.userFacilityAssignment.deleteMany({where:{userId:id}});await tx.userFacilityAssignment.create({data:{userId:id,facilityId:dto.facilityId,isPrimary:true}});await tx.userVillageAssignment.deleteMany({where:{userId:id}});await tx.userVillageAssignment.createMany({data:dto.villageIds.map(villageId=>({userId:id,villageId}))});await tx.userAccount.update({where:{id},data:{mfaEnabled:privileged,...(dto.email?{email:dto.email,passwordResetToken:null,passwordResetExpires:null}:{})}});await tx.userSession.updateMany({where:{userId:id,revokedAt:null},data:{revokedAt:new Date()}});await tx.auditLog.create({data:{action:'ASSIGNMENT_CHANGE',entityName:'UserAccount',entityId:id,performedById:actor,changesJson:{role:dto.role,facilityId:dto.facilityId,villageIds:dto.villageIds}}});});return {success:true};
 }
 @Post('accounts/:id/mfa-enrollment') async enroll(@Param('id') id:string,@CurrentUser('id') actor:string){
  if(id===actor)throw new ForbiddenException('SELF_MFA_RESET_DENIED');const secret=newTotpSecret();
  const user=await this.db.userAccount.update({where:{id},data:{mfaEnabled:true,mfaSecret:protectSecret(secret)}});await this.db.$executeRaw`UPDATE ${authTable('user_accounts')} SET "mfaLastStep"=NULL WHERE id=${id}::uuid`;await this.db.userSession.updateMany({where:{userId:id},data:{revokedAt:new Date()}});await this.db.auditLog.create({data:{action:'MFA_ENROLLMENT_RESET',entityName:'UserAccount',entityId:id,performedById:actor}});
  return {enrollmentUri:`otpauth://totp/Aarogya%20Drishti:${encodeURIComponent(user.username)}?secret=${secret}&issuer=Aarogya%20Drishti`};
 }
}

