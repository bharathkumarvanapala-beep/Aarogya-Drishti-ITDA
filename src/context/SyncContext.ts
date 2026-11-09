import { createContext } from 'react';
import type { OfflineDraft } from '../services/db';

export type GlobalSyncState = 'SYNCED' | 'SYNCING' | 'SAVED_LOCALLY' | 'OFFLINE';

export interface SyncContextValue {
  isOnline: boolean;
  syncState: GlobalSyncState;
  drafts: OfflineDraft[];
  pendingCount: number;
  syncAllDraftsNow: () => Promise<void>;
  addTestDraft: (name?: string, habitation?: string) => Promise<void>;
  removeDraft: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  toggleOnlineSimulation: () => void;
  refreshDrafts: () => Promise<void>;
}

export const SyncContext = createContext<SyncContextValue | undefined>(undefined);
