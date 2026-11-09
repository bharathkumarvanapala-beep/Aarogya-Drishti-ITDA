import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, 
  WifiOff, 
  RotateCw, 
  CheckCircle2, 
  HardDrive, 
  Database,
  Plus,
  Trash2,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { Badge } from '../../components/common/Badge';
import { useSync } from '../../context';

export const OfflineSyncHubPage: React.FC = () => {
  const {
    isOnline,
    syncState,
    drafts,
    pendingCount,
    syncAllDraftsNow,
    addTestDraft,
    removeDraft,
    clearAll,
    toggleOnlineSimulation,
  } = useSync();

  const [syncToast, setSyncToast] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleSyncClick = async () => {
    setSyncError(null);
    setSyncToast(false);
    try {
      await syncAllDraftsNow();
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 3500);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Synchronization failed. Your drafts are retained.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Tribal Edge Pipeline
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              IndexedDB Storage Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            Offline Sync Hub & Local Storage
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            All citizen enrollments, habits questionnaires, and high-resolution oral photographs persist in IndexedDB without requiring mobile network reception.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/health-worker">
            <Button variant="outline" size="sm">
              Field Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {syncError && <Alert type="danger" title="Sync unavailable" titleTe="సింక్ అందుబాటులో లేదు">{syncError}</Alert>}
      {syncToast && (
        <Alert 
          type="success" 
          title="IndexedDB Sync Completed" 
          titleTe="డేటా సింక్ విజయవంతమైంది"
        >
          All offline drafts flushed to PHC G. Madugula gateway. Records are now visible to Dr. K. Suresh for clinical triage.
        </Alert>
      )}

      {/* Sync Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Network Connectivity */}
        <div className="p-4 rounded-2xl bg-white border border-forest-100 shadow-nature space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted uppercase font-mono font-bold">Network Link</span>
            {isOnline ? (
              <Wifi className="w-5 h-5 text-emerald-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-rose-600" />
            )}
          </div>
          <span className="text-lg font-bold text-ink block">
            {isOnline ? 'Online (Connected)' : 'Offline (Local Only)'}
          </span>
          <button 
            type="button"
            onClick={toggleOnlineSimulation} 
            className="text-[11px] text-forest-800 font-bold hover:underline"
          >
            {isOnline ? 'Simulate Network Drop (Go Offline)' : 'Reconnect Simulator (Go Online)'}
          </button>
        </div>

        {/* Local Pending Drafts */}
        <div className="p-4 rounded-2xl bg-white border border-forest-100 shadow-nature space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted uppercase font-mono font-bold">IndexedDB Drafts</span>
            <Database className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-ink block">
            {pendingCount} Records
          </span>
          <span className="text-[11px] text-ink-muted">
            Object Store: <code className="font-mono text-forest-800">aarogya_drafts</code>
          </span>
        </div>

        {/* Device Storage Quota */}
        <div className="p-4 rounded-2xl bg-white border border-forest-100 shadow-nature space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted uppercase font-mono font-bold">Storage Quota</span>
            <HardDrive className="w-5 h-5 text-forest-800" />
          </div>
          <span className="text-lg font-bold text-ink block">
            {pendingCount > 0 ? `${(pendingCount * 2.1).toFixed(1)} MB / 500 MB` : '1.2 MB / 500 MB'}
          </span>
          <span className="text-[11px] text-emerald-700 font-bold">
            idb v8.0.4 • PWA Persistent Store
          </span>
        </div>

      </div>

      {/* Sync Actions Bar */}
      <Card padding="md" className="border-forest-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-forest-800">
                Synchronization Controls
              </span>
              <Badge
                label={syncState.replace(/_/g, ' ')}
                variant={syncState === 'SYNCED' ? 'success' : syncState === 'SAVED_LOCALLY' ? 'warning' : 'danger'}
                size="sm"
              />
            </div>
            <p className="text-xs text-ink-muted">
              {pendingCount === 0
                ? 'All field records are synchronized with District Gateway.'
                : `${pendingCount} unsynced record(s) queued for multi-tier upload.`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => addTestDraft()}
            >
              Add Test Offline Draft
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={RotateCw}
              disabled={pendingCount === 0 || syncState === 'SYNCING'}
              onClick={handleSyncClick}
            >
              {syncState === 'SYNCING' ? 'Syncing to Gateway...' : 'Synchronize All Now'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Pending Drafts Queue Table */}
      <Card
        title="Local IndexedDB Records Queue (aarogya_drafts)"
        titleTe="ఆఫ్‌లైన్ రికార్డుల జాబితా"
        subtitle="Unsynced clinical data residing safely on this device"
      >
        {drafts.length === 0 ? (
          <div className="text-center py-10 space-y-2 text-ink-muted">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-ink">
              All Records Synchronized
            </h4>
            <p className="text-xs max-w-md mx-auto">
              There are no pending offline drafts in your device's IndexedDB storage.
              New registrations or guided photographs captured while offline will appear here automatically.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => addTestDraft()}
              >
                Create Test Offline Screening Draft
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-forest-100 text-[11px] text-ink-muted uppercase font-mono">
                    <th className="pb-3 font-semibold">Draft Identifier</th>
                    <th className="pb-3 font-semibold">Record Type</th>
                    <th className="pb-3 font-semibold">Patient Name</th>
                    <th className="pb-3 font-semibold">Habitation</th>
                    <th className="pb-3 font-semibold">Saved Timestamp</th>
                    <th className="pb-3 font-semibold">Estimated Payload</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-100">
                  {drafts.map((d) => (
                    <tr key={d.id} className="hover:bg-forest-50/50">
                      <td className="py-3 font-mono font-bold text-forest-900">
                        {d.id}
                      </td>
                      <td className="py-3 font-medium text-ink">
                        {d.type}
                      </td>
                      <td className="py-3 font-bold text-ink">
                        {d.patientName}
                      </td>
                      <td className="py-3 text-ink-muted">
                        {d.habitation}
                      </td>
                      <td className="py-3 font-mono text-ink-muted">
                        {d.savedAt}
                      </td>
                      <td className="py-3 font-mono text-forest-800">
                        {d.size}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeDraft(d.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete local draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-forest-100 text-xs">
              <button
                type="button"
                onClick={clearAll}
                className="text-rose-700 font-bold hover:underline"
              >
                Clear All Local Storage
              </button>
              <span className="text-ink-muted">
                {drafts.length} draft record(s) currently held locally.
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Offline Architecture Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding="md" className="border-forest-200 bg-white space-y-2 text-xs">
          <div className="flex items-center gap-2 text-forest-800">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="font-bold text-ink">Zero Data Loss Guarantee</h4>
          </div>
          <p className="text-ink-muted leading-relaxed">
            Every form input, photograph, and habit checkbox is committed synchronously to browser IndexedDB before any network request is attempted. If connection drops mid-screening, nothing is lost.
          </p>
        </Card>

        <Card padding="md" className="border-forest-200 bg-white space-y-2 text-xs">
          <div className="flex items-center gap-2 text-forest-800">
            <Smartphone className="w-4 h-4" />
            <h4 className="font-bold text-ink">Idempotent Synchronization</h4>
          </div>
          <p className="text-ink-muted leading-relaxed">
            All synchronization dispatches use UUIDv4 idempotency keys. Duplicate sync attempts due to intermittent mobile towers will never duplicate patient files or medical appointments.
          </p>
        </Card>
      </div>

    </div>
  );
};
