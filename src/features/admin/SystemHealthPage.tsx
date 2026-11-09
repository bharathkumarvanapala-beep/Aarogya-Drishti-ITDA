import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Server,
  Wifi,
  WifiOff,
  RotateCw,
  CheckCircle2,
  Smartphone,
  HardDrive
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { SUB_CENTRE_SYNCS } from './adminData';
import type { SubCentreSyncStatus } from './adminData';

export const SystemHealthPage: React.FC = () => {
  const [syncs, setSyncs] = useState<SubCentreSyncStatus[]>(SUB_CENTRE_SYNCS);
  const [isPinging, setIsPinging] = useState(false);
  const [pingToast, setPingToast] = useState(false);

  const handleTriggerSyncPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setSyncs((prev) =>
        prev.map((s) => ({
          ...s,
          lastHeartbeat: 'Just now',
          pendingDrafts: 0,
          syncState: 'SYNCED',
        }))
      );
      setIsPinging(false);
      setPingToast(true);
      setTimeout(() => setPingToast(false), 3500);
    }, 1500);
  };

  const totalPending = syncs.reduce((acc, curr) => acc + curr.pendingDrafts, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/admin" className="hover:underline">District Admin</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">System & Sync Health</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            District Offline Synchronization Telemetry
            <Badge label="EDGE MESH ONLINE" variant="success" size="sm" />
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Real-time status of frontline ASHA tablets, offline SQLite queues, and BSNL/Airtel rural connectivity links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={RotateCw}
            onClick={handleTriggerSyncPing}
            disabled={isPinging}
          >
            {isPinging ? 'Pinging Field Sub-Centres...' : 'Trigger District Sync Ping'}
          </Button>
        </div>
      </div>

      {pingToast && (
        <Alert 
          type="success" 
          title="District Sync Ping Successful" 
          titleTe="జిల్లా సింక్ పింగ్ విజయవంతమైంది"
        >
          All 5 reporting sub-centres acknowledged heartbeat. 12 queued frontline drafts flushed to Paderu central gateway.
        </Alert>
      )}

      {/* Gateway Infrastructure KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="border-forest-200 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-ink-muted uppercase">Paderu Edge Server</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-ink">Operational</div>
          <span className="text-[11px] text-emerald-800 font-semibold">100% Uptime (Last 90 Days)</span>
        </Card>

        <Card padding="md" className="border-forest-200 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-ink-muted uppercase">Pending Offline Drafts</span>
            <HardDrive className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-900">{totalPending} Records</div>
          <span className="text-[11px] text-ink-muted">Awaiting network reconnection</span>
        </Card>

        <Card padding="md" className="border-forest-200 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-ink-muted uppercase">Conflict Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-forest-900">0.00%</div>
          <span className="text-[11px] text-emerald-800 font-semibold">Idempotent vector clocks</span>
        </Card>

        <Card padding="md" className="border-forest-200 bg-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-ink-muted uppercase">Active Field Tablets</span>
            <Smartphone className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-900">94 Devices</div>
          <span className="text-[11px] text-ink-muted">Samsung / Lenovo ITDA Assets</span>
        </Card>
      </div>

      {/* Sub-Centres Telemetry Table */}
      <Card
        title="Field Sub-Centres Connectivity & Sync Status"
        titleTe="సబ్-సెంటర్ల కనెక్టివిటీ మరియు సింక్ స్థితి"
        subtitle="Monitors last check-in, local draft queue, and wireless network carrier"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-forest-100 text-[11px] text-ink-muted uppercase font-mono">
                <th className="pb-3 font-semibold">Sub-Centre Name</th>
                <th className="pb-3 font-semibold">Mandal</th>
                <th className="pb-3 font-semibold">Primary Worker</th>
                <th className="pb-3 font-semibold">Pending Drafts</th>
                <th className="pb-3 font-semibold">Last Heartbeat</th>
                <th className="pb-3 font-semibold">Carrier / Link</th>
                <th className="pb-3 font-semibold">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {syncs.map((s) => (
                <tr key={s.id} className="hover:bg-forest-50/50">
                  <td className="py-3 font-bold text-ink">
                    {s.subCentreName}
                    <span className="block text-[10px] font-normal text-ink-muted font-mono">
                      {s.deviceModel}
                    </span>
                  </td>
                  <td className="py-3 text-ink-muted font-medium">{s.mandal}</td>
                  <td className="py-3 text-ink font-medium">{s.primaryWorker}</td>
                  <td className="py-3 font-mono font-bold">
                    {s.pendingDrafts > 0 ? (
                      <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {s.pendingDrafts} Pending
                      </span>
                    ) : (
                      <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        0 Drafts
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-ink-muted font-mono">{s.lastHeartbeat}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1.5 text-ink-muted">
                      {s.syncState === 'PENDING_OFFLINE' ? (
                        <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>{s.networkCarrier}</span>
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge
                      label={s.syncState.replace(/_/g, ' ')}
                      variant={s.syncState === 'SYNCED' ? 'success' : s.syncState === 'SYNCING' ? 'info' : 'warning'}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Offline Resilience Architecture Note */}
      <Card padding="md" className="border-forest-200 bg-forest-50/40 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-forest-800" />
          <h4 className="font-bold text-ink">
            Offline-First Design Guarantee (CRDT & Idempotency)
          </h4>
        </div>
        <p className="text-ink-muted leading-relaxed">
          Frontline screening data is persisted locally in device IndexedDB (`aarogya_drafts`) before any network dispatch. All uploads use UUIDv4 idempotency keys, guaranteeing that intermittent rural connections or duplicate submissions never corrupt patient records or create phantom appointments.
        </p>
      </Card>

    </div>
  );
};
