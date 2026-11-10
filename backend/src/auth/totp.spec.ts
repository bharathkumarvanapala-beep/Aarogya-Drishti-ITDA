import { totp, verifyTotp, protectSecret, revealSecret } from './totp';
describe('TOTP and secret encryption',()=>{
 it('matches RFC 6238 six-digit truncation and rejects invalid/replayed time windows',()=>{
  const key='GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
  expect(totp(key,1)).toBe('287082');
  expect(verifyTotp(key,'287082',59000)).toBe(1);
  expect(verifyTotp(key,'000000',59000)).toBeNull();
  expect(verifyTotp(key,'287082',200000)).toBeNull();
 });
 it('authenticates encrypted MFA secrets and detects tampering',()=>{
  process.env.CARE_KEY_BASE64=Buffer.alloc(32,9).toString('base64');
  const encrypted=protectSecret('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
  expect(revealSecret(encrypted)).toBe('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
  const b=Buffer.from(encrypted,'base64');b[15]^=1;expect(()=>revealSecret(b.toString('base64'))).toThrow();
 });
});
