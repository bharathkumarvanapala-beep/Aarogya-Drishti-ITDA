import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface OfflineDraft {
  id: string;
  type: 'Screening Record' | 'Citizen Enrollment';
  patientName: string;
  habitation: string;
  savedAt: string;
  size: string;
  payload?: Record<string, unknown>;
}

export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  idempotencyKey: string;
  payload: Record<string, unknown>;
  timestamp: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  retries: number;
}

interface AarogyaDBSchema extends DBSchema {
  aarogya_drafts: {
    key: string;
    value: OfflineDraft;
    indexes: { 'by-patient': string; 'by-type': string };
  };
  sync_queue: {
    key: string;
    value: SyncQueueItem;
    indexes: { 'by-status': string; 'by-timestamp': string };
  };
}

const DB_NAME = 'aarogya_drishti_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<AarogyaDBSchema>> | null = null;

export const getDB = (): Promise<IDBPDatabase<AarogyaDBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<AarogyaDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('aarogya_drafts')) {
          const draftStore = db.createObjectStore('aarogya_drafts', { keyPath: 'id' });
          draftStore.createIndex('by-patient', 'patientName');
          draftStore.createIndex('by-type', 'type');
        }

        if (!db.objectStoreNames.contains('sync_queue')) {
          const queueStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
          queueStore.createIndex('by-status', 'status');
          queueStore.createIndex('by-timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
};

// Drafts Operations
export const getAllDrafts = async (): Promise<OfflineDraft[]> => {
  try {
    const db = await getDB();
    return await db.getAll('aarogya_drafts');
  } catch (err) {
    console.warn('IndexedDB not available, fallback to empty array', err);
    return [];
  }
};

export const putDraft = async (draft: OfflineDraft): Promise<void> => {
  const db = await getDB();
  await db.put('aarogya_drafts', draft);
};

export const deleteDraft = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('aarogya_drafts', id);
};

export const clearAllDrafts = async (): Promise<void> => {
  const db = await getDB();
  await db.clear('aarogya_drafts');
};

// Queue Operations
export const getAllQueueItems = async (): Promise<SyncQueueItem[]> => {
  try {
    const db = await getDB();
    return await db.getAll('sync_queue');
  } catch (err) {
    console.warn('IndexedDB not available, fallback to empty array', err);
    return [];
  }
};

export const enqueueItem = async (item: SyncQueueItem): Promise<void> => {
  const db = await getDB();
  await db.put('sync_queue', item);
};

export const removeQueueItem = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('sync_queue', id);
};

export const clearSyncQueue = async (): Promise<void> => {
  const db = await getDB();
  await db.clear('sync_queue');
};

// Seeding initial drafts only when explicitly requested
export const seedInitialDraftsIfEmpty = async (): Promise<void> => {
  // Real clinical environment: do not auto-inject hardcoded drafts into operational queue.
};
