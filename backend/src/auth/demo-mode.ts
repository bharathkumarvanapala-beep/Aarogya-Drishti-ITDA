const demoNames = new Set(['asha_lakshmi','anm_sarada','doc_suresh','specialist_priya','admin_rajesh','hrc_varma']);

export function isolatedDemoEnabled(): boolean {
  if (process.env.DEMO_MODE !== 'true') return false;
  const schema = new URL(process.env.DATABASE_URL || 'postgres://localhost/invalid').searchParams.get('schema');
  if (schema !== 'aarogya_demo' || process.env.CARE_SCHEMA !== 'aarogya_demo') {
    throw new Error('Demo mode requires the isolated aarogya_demo schema for authentication and care');
  }
  return true;
}

export function isDemoAccount(account: {username:string;email?:string|null}): boolean {
  return isolatedDemoEnabled() && demoNames.has(account.username) && account.email === `${account.username}@demo.aarogya.invalid`;
}
