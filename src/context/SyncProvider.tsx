import React, { useState, useEffect, useCallback } from 'react';
import {
  getAllDrafts,
  putDraft,
  deleteDraft,
  clearAllDrafts,
  seedInitialDraftsIfEmpty,
  type OfflineDraft,
} from '../services/db';
import { SyncContext, type GlobalSyncState } from './SyncContext';

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [drafts, setDrafts] = useState<OfflineDraft[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const refreshDrafts = useCallback(async () => {
    try {
      const all = await getAllDrafts();
      setDrafts(all);
    } catch (err) {
      console.warn('Failed to fetch drafts', err);
    }
  }, []);

  // Initial DB setup & network listeners
  useEffect(() => {
    const init = async () => {
      await seedInitialDraftsIfEmpty();
      await refreshDrafts();
    };
    init();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshDrafts]);

  const toggleOnlineSimulation = () => {
    setIsOnline((prev) => !prev);
  };

  const addTestDraft = async (name = 'G. Somulu (50M)', habitation = 'Kothapalli') => {
    const newId = `DRAFT-SCR-${Math.floor(Math.random() * 800) + 200}`;
    const newDraft: OfflineDraft = {
      id: newId,
      type: 'Screening Record',
      patientName: name,
      habitation,
      savedAt: 'Just now',
      size: '3.8 MB (5 Photos)',
      payload: {
        timestamp: new Date().toISOString(),
        site: 'buccal_mucosa',
      },
    };
    await putDraft(newDraft);
    await refreshDrafts();
  };

  const removeDraft = async (id: string) => {
    await deleteDraft(id);
    await refreshDrafts();
  };

  const clearAll = async () => {
    await clearAllDrafts();
    await refreshDrafts();
  };

  const syncAllDraftsNow = async () => {
    if (!isOnline) {
      throw new Error('Cannot sync while offline. Your drafts remain saved on this device.');
    }
    setIsSyncing(true);
    try {
      // Never discard records without a durable server acknowledgement.
      throw new Error('Server synchronization is not implemented. Your drafts remain saved on this device.');
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingCount = drafts.length;

  let syncState: GlobalSyncState = 'SYNCED';
  if (!isOnline) {
    syncState = 'OFFLINE';
  } else if (isSyncing) {
    syncState = 'SYNCING';
  } else if (pendingCount > 0) {
    syncState = 'SAVED_LOCALLY';
  }

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        syncState,
        drafts,
        pendingCount,
        syncAllDraftsNow,
        addTestDraft,
        removeDraft,
        clearAll,
        toggleOnlineSimulation,
        refreshDrafts,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};
