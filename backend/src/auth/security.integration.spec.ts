import { PrismaService } from '../database/prisma.service';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { newTotpSecret,protectSecret,totp } from './totp';
import { sendRecoveryEmail } from './recovery-mail';
jest.mock('./recovery-mail',()=>({sendRecoveryEmail:jest.fn().mockResolvedValue(undefined)}));
const describeDatabase=process.env.AUTH_ISOLATED_TEST==='yes'?describe:describe.skip;
describeDatabase('Auth with isolated real PostgreSQL',()=>{
 let db:PrismaService,auth:AuthService,pass:PasswordService,jwt:JwtService;let user:any,hash:string;const password='Synthetic-only-'+randomBytes(20).toString('hex');
 beforeAll(async()=>{
  db=new PrismaService();await db.$connect();db.isDbConnected=true;
  pass=new PasswordService();jwt=new JwtService();const config=new ConfigService({jwt:{secret:process.env.JWT_SECRET,refreshSecret:process.env.JWT_REFRESH_SECRET,expiresIn:'15m',refreshExpiresIn:'7d'}});auth=new AuthService(db,jwt,config,pass);hash=await pass.hash(password);
  await db.$executeRawUnsafe('CREATE TABLE IF NOT EXISTS auth_attempts(key text PRIMARY KEY,attempts integer NOT NULL DEFAULT 0,window_start timestamptz NOT NULL DEFAULT now())');
 });
 beforeEach(async()=>{
  const role=await db.role.upsert({where:{code:'ASHA_WORKER'},update:{},create:{code:'ASHA_WORKER',name:'Health worker',description:'Synthetic test role'}});
  user=await db.userAccount.create({data:{username:'test_'+randomBytes(6).toString('hex'),email:randomBytes(6).toString('hex')+'@example.invalid',fullName:'Synthetic test',passwordHash:hash,accountStatus:'APPROVED',roles:{create:{roleId:role.id}}}});
 });
 afterAll(async()=>{await db.$disconnect();});
 it('valid login persists session; invalid password and unknown user fail',async()=>{
  const result=await auth.login({username:user.username,password});expect(result.accessToken).toBeTruthy();expect(await db.userSession.count({where:{userId:user.id}})).toBe(1);
  await expect(auth.login({username:user.username,password:'wrong'})).rejects.toThrow();
  await expect(auth.login({username:'unknown',password})).rejects.toThrow();
 });
 it('inactive and unapproved accounts cannot log in',async()=>{
  await db.userAccount.update({where:{id:user.id},data:{accountStatus:'PENDING_VERIFICATION'}});await expect(auth.login({username:user.username,password})).rejects.toThrow();
  await db.userAccount.update({where:{id:user.id},data:{accountStatus:'APPROVED',isActive:false}});await expect(auth.login({username:user.username,password})).rejects.toThrow();
 });
 it('refresh rotates once and rejects replay',async()=>{
  const first=await auth.login({username:user.username,password});const next=await auth.refreshTokens({refreshToken:first.refreshToken!});expect(next.accessToken).toBeTruthy();
  await expect(auth.refreshTokens({refreshToken:first.refreshToken!})).rejects.toThrow();
 });
 it('parallel sessions remain independent and logout revokes only its session',async()=>{
  const one=await auth.login({username:user.username,password}),two=await auth.login({username:user.username,password});await auth.logout(user.id,one.refreshToken);
  await expect(auth.assertActiveSession(jwt.decode(one.accessToken!))).rejects.toThrow();
  await expect(auth.assertActiveSession(jwt.decode(two.accessToken!))).resolves.toBeUndefined();
 });
 it('expired and suspended sessions are rejected',async()=>{
  const one=await auth.login({username:user.username,password});await db.userSession.updateMany({where:{userId:user.id},data:{expiresAt:new Date(0)}});await expect(auth.assertActiveSession(jwt.decode(one.accessToken!))).rejects.toThrow();
 });
 it('reset hashes token, expires it, consumes once, and revokes sessions',async()=>{
  const login=await auth.login({username:user.username,password});const token=randomBytes(32).toString('hex');await db.userAccount.update({where:{id:user.id},data:{passwordResetToken:pass.hashToken(token),passwordResetExpires:new Date(Date.now()+900000)}});
  const dto={token,newPassword:password+'new',confirmPassword:password+'new'};await auth.resetPassword(dto);await expect(auth.resetPassword(dto)).rejects.toThrow();await expect(auth.assertActiveSession(jwt.decode(login.accessToken!))).rejects.toThrow();
  await db.userAccount.update({where:{id:user.id},data:{passwordResetToken:pass.hashToken(token),passwordResetExpires:new Date(0)}});await expect(auth.resetPassword(dto)).rejects.toThrow();
 });
 it('recovery sends privately and never returns a token',async()=>{
  process.env.SMTP_USER='sender@example.invalid';process.env.SMTP_PASSWORD='test-only';await db.userAccount.update({where:{id:user.id},data:{email:'synthetic@example.test'}});
  const response=await auth.forgotPassword({identifier:user.username});expect(response).not.toHaveProperty('resetToken');expect(sendRecoveryEmail).toHaveBeenCalled();const stored=await db.userAccount.findUniqueOrThrow({where:{id:user.id}});const delivered=(sendRecoveryEmail as jest.Mock).mock.calls.at(-1)[1];expect(stored.passwordResetToken).toBe(pass.hashToken(delivered));
 });
 it('privileged MFA requires real TOTP and persistently rejects replay',async()=>{
  const secret=newTotpSecret();await db.userAccount.update({where:{id:user.id},data:{mfaEnabled:true,mfaSecret:protectSecret(secret)}});const challenge=await auth.login({username:user.username,password});expect(challenge.accessToken).toBeUndefined();
  await expect(auth.verifyMfa({mfaSessionToken:challenge.mfaSessionToken!,totpCode:'nototp'})).rejects.toThrow();
  const dto={mfaSessionToken:challenge.mfaSessionToken!,totpCode:totp(secret,Math.floor(Date.now()/30000))};expect((await auth.verifyMfa(dto)).accessToken).toBeTruthy();await expect(auth.verifyMfa(dto)).rejects.toThrow();
 });
 it('public users cannot request a privileged role',async()=>{
  await expect(auth.register({portalRole:'doctor',fullName:'Synthetic',mobileNumber:'0000000000',password,confirmPassword:password})).rejects.toThrow();
 });
 it('private reset link enrolls MFA once and requires proof before changing password',async()=>{
  const token=randomBytes(32).toString('hex');
  await db.userAccount.update({where:{id:user.id},data:{mfaEnabled:true,passwordResetToken:pass.hashToken(token),passwordResetExpires:new Date(Date.now()+900000)}});
  const setup=await auth.setupRecoveryMfa(token);expect(setup.required).toBe(true);expect(setup.secret).toBeTruthy();
  expect((await auth.setupRecoveryMfa(token)).secret).toBe(setup.secret);
  const dto={token,newPassword:password+'new',confirmPassword:password+'new'};
  await expect(auth.resetPassword(dto)).rejects.toThrow('MFA_INVALID');
  await auth.resetPassword({...dto,mfaCode:totp(setup.secret!,Math.floor(Date.now()/30000))});
  await expect(auth.setupRecoveryMfa(token)).rejects.toThrow('RESET_INVALID');
  const stored=await db.userAccount.findUniqueOrThrow({where:{id:user.id}});expect(stored.mfaSecret).toBeTruthy();expect(stored.mfaSecret).not.toBe(setup.secret);
 });
 it('backend rejects a caller-selected privileged portal',async()=>{
  await expect(auth.login({username:user.username,password,requestedRole:'admin'})).rejects.toThrow();
 });
});
