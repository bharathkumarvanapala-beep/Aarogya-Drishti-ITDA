export function authErrorMessage(payload: { error?: { message?: string }; message?: string }, status: number): string {
  return payload.error?.message || payload.message || (status === 401 ? 'Invalid mobile number/ID or password.' : 'Sign in failed. Please retry.');
}
