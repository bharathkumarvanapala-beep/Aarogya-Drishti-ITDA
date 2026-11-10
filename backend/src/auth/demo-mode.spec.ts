import {isDemoAccount, isolatedDemoEnabled} from './demo-mode';
describe('Isolated demonstration boundary',()=>{
 const saved={...process.env};afterEach(()=>{process.env={...saved};});
 it('never bypasses MFA on regular deployments',()=>{delete process.env.DEMO_MODE;expect(isDemoAccount({username:'admin_rajesh',email:'admin_rajesh@demo.aarogya.invalid'})).toBe(false);});
 it('fails closed if either data store points outside the demo schema',()=>{
  process.env.DEMO_MODE='true';process.env.DATABASE_URL='postgres://localhost/app?schema=public';process.env.CARE_SCHEMA='aarogya_demo';expect(isolatedDemoEnabled).toThrow();
  process.env.DATABASE_URL='postgres://localhost/app?schema=aarogya_demo';process.env.CARE_SCHEMA='public';expect(isolatedDemoEnabled).toThrow();
 });
 it('only allows the named synthetic demo accounts',()=>{
  process.env.DEMO_MODE='true';process.env.DATABASE_URL='postgres://localhost/app?schema=aarogya_demo';process.env.CARE_SCHEMA='aarogya_demo';
  expect(isDemoAccount({username:'admin_rajesh',email:'admin_rajesh@demo.aarogya.invalid'})).toBe(true);
  expect(isDemoAccount({username:'admin_rajesh',email:'owner@example.com'})).toBe(false);
  expect(isDemoAccount({username:'new_admin',email:'new_admin@demo.aarogya.invalid'})).toBe(false);
 });
});
