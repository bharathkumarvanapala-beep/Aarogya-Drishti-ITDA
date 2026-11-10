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
import { careApi } from '../services/careApi';

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
    const currentDrafts = await getAllDrafts();
    if (currentDrafts.length === 0) {
      return;
    }

    setIsSyncing(true);
    let successCount = 0;
    const errors: string[] = [];

    try {
      for (const draft of currentDrafts) {
        try {
          if (draft.payload && Object.keys(draft.payload).length > 0) {
            if (draft.type === 'Citizen Enrollment') {
              await careApi('/cases', draft.payload, draft.id);
            } else if (draft.type === 'Screening Record') {
              const p = draft.payload as any;
              const targetCaseId = p.caseId || p.patientId || p.patient?.id;
              if (targetCaseId && !targetCaseId.startsWith('DRAFT-')) {
                await careApi(`/cases/${targetCaseId}/actions`, p, draft.id);
              }
            }
          }
          await deleteDraft(draft.id);
          successCount++;
        } catch (itemErr: any) {
          console.warn(`Draft ${draft.id} sync failed:`, itemErr);
          // If server reports duplicate or already processed, safely remove draft
          if (itemErr?.message?.includes('already registered') || itemErr?.message?.includes('duplicate')) {
            await deleteDraft(draft.id);
            successCount++;
          } else {
            errors.push(`${draft.patientName}: ${itemErr?.message || 'Server rejected record'}`);
          }
        }
      }
    } finally {
      await refreshDrafts();
      setIsSyncing(false);
    }

    if (errors.length > 0) {
      throw new Error(`${successCount} synced, ${errors.length} failed: ${errors.join('; ')}`);
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
