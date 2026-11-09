import { useContext } from 'react';
import { SyncContext, type SyncContextValue } from './SyncContext';

export const useSync = (): SyncContextValue => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
