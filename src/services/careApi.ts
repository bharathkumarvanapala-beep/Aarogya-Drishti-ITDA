export interface CareRecord {
  id: string; version: number; name: string; age: number; village: string; mandal: string;
  history: string; symptoms: string; status: string; createdAt: string;
  images: { site: string; data: string }[];
  events: { id: string; action: string; actor: string; at: string; data: Record<string, unknown> }[];
}
export async function careApi<T>(path: string, body?: unknown, key?: string): Promise<T> {
  const token = localStorage.getItem('aarogya_jwt_token');
  if (!token) throw new Error('Sign in through the server to continue. / దయచేసి లాగిన్ అవ్వండి.');
  const response = await fetch('/api/v1/care' + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(key ? { 'X-Idempotency-Key': key } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(20000),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || result.message || `Request failed (${response.status}). Your entry has not been confirmed.`);
  return result.data;
}
