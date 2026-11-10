import { apiRequest } from './session';
export interface CareRecord {
  id: string; version: number; name: string; age: number; village: string; mandal: string;
  history: string; symptoms: string; status: string; createdAt: string;
  sex?: string;
  patientId?: string;
  images: { site: string; data: string }[];
  events: { id: string; action: string; actor: string; at: string; data: Record<string, unknown> }[];
}
export async function careApi<T>(path: string, body?: unknown, key?: string): Promise<T> {
  if(key) return apiRequest('/care'+path,body,undefined,true,key);
  return apiRequest('/care'+path,body);
}
