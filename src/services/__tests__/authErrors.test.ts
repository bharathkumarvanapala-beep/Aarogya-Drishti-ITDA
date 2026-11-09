import { describe, it, expect } from 'vitest';
import { authErrorMessage } from '../authErrors';
describe('Backend login error display', () => {
  it('shows the actual nested credential error instead of claiming wrong portal', () => {
    expect(authErrorMessage({ error: { message: 'Invalid credentials' } }, 401)).toBe('Invalid credentials');
  });
  it('preserves account approval and role errors', () => {
    expect(authErrorMessage({ error: { message: 'Account awaiting administrative verification' } }, 403)).toContain('awaiting');
  });
  it('uses a credential fallback only for 401', () => {
    expect(authErrorMessage({}, 401)).toContain('password');
    expect(authErrorMessage({}, 500)).not.toContain('authorized');
  });
});
