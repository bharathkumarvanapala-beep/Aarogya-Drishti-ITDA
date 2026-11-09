import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  PhoneCall,
  Home,
  MessageSquare,
  Plus,
  CheckCircle2,
  Calendar,
  User
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';
import { INITIAL_NAVIGATION_LOGS } from './hospitalData';
import type { NavigationLog } from './hospitalData';

export const PatientNavigationPage: React.FC = () => {
  const { language } = useTranslation();

  const [logs, setLogs] = useState<NavigationLog[]>(INITIAL_NAVIGATION_LOGS);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Log State
  const [patientName, setPatientName] = useState('Kondala Rao');
  const [contactMethod, setContactMethod] = useState('ASHA Liaison Call (Lakshmi Devi)');
  const [transportType, setTransportType] = useState('ITDA Tribal Patient Van Desk 04');
  const [counselingGiven, setCounselingGiven] = useState(
    'Telugu counseling provided. Reconfirmed pickup time at G. Madugula crossroad. Patient reassured that all diagnostic tests and lodging are completely free.'
  );
  const [showToast, setShowToast] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: NavigationLog = {
      id: `NAV-2026-0${Math.floor(Math.random() * 900) + 100}`,
      patientId: 'ASR-PAT-2026-0842',
      patientName,
      patientNameTe: 'కొండల రావు',
      navigatorName: 'Rajesh Varma (Lead Navigator)',
      contactMethod,
      transportType,
      counselingGiven,
      timestamp: 'Just now',
      status: 'CONFIRMED',
    };

    setLogs((prev) => [newEntry, ...prev]);
    setShowAddModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/hospital" className="hover:underline">Hospital Hub</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Patient Navigation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Tribal Patient Navigation Desk
            <span className="text-xs font-mono font-semibold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              ITDA Paderu Desk
            </span>
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Dedicating assisted care, transportation desk coordination, and bilingual reassurance for remote tribal households.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Log Navigation Touchpoint
          </Button>
        </div>
      </div>

      {showToast && (
        <Alert 
          type="success" 
          title="Navigation Touchpoint Recorded" 
          titleTe="పేషెంట్ నావిగేషన్ వివరాలు నమోదు చేయబడ్డాయి"
        >
          Patient transport and counseling status updated. Information synchronized with village ASHA worker tablet.
        </Alert>
      )}

      {/* 4 Pillars of Tribal Patient Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="border-forest-200 bg-white space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
            1. Free ITDA Transport
          </h4>
          <p className="text-xs text-ink-muted leading-relaxed">
            Coordinated pickup vans and feeder ambulances linking deep hill hamlets to Paderu.
          </p>
        </Card>

        <Card padding="md" className="border-forest-200 bg-white space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
            <PhoneCall className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
            2. ASHA Worker Liaison
          </h4>
          <p className="text-xs text-ink-muted leading-relaxed">
            Direct verbal coordination with village frontline workers for zero smartphone dependency.
          </p>
        </Card>

        <Card padding="md" className="border-forest-200 bg-white space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
            3. Telugu Counseling
          </h4>
          <p className="text-xs text-ink-muted leading-relaxed">
            Compassionate explanation to dispel surgical fear, cancer stigma, and procedural anxiety.
          </p>
        </Card>

        <Card padding="md" className="border-forest-200 bg-white space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
            4. Ashram Stay & Meals
          </h4>
          <p className="text-xs text-ink-muted leading-relaxed">
            Free overnight lodging and nutritious meals at Paderu ITDA transit ashram for patient & attendant.
          </p>
        </Card>
      </div>

      {/* Navigation Logs Feed */}
      <Card
        title="Recent Navigation Logs & Coordination Touchpoints"
        titleTe="ఇటీవలి నావిగేషన్ రికార్డులు"
        subtitle="Chronological audit log of patient coordination contacts across ASR District"
      >
        <div className="divide-y divide-forest-100">
          {logs.map((log) => {
            const isKondalaRao = log.patientId === 'ASR-PAT-2026-0842';

            return (
              <div
                key={log.id}
                className={`py-4 space-y-2 transition-colors ${
                  isKondalaRao ? 'bg-forest-50/40 -mx-6 px-6' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded border border-forest-200">
                      {log.id}
                    </span>
                    <span className="font-bold text-sm text-ink">
                      {log.patientName}
                    </span>
                    {language === 'te' && (
                      <span className="text-xs font-telugu text-forest-800">
                        ({log.patientNameTe})
                      </span>
                    )}
                    <span className="font-mono text-xs text-ink-muted">
                      ({log.patientId})
                    </span>
                    <Badge label={log.status} variant="success" size="sm" />
                    {isKondalaRao && (
                      <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                        Kondala Rao (Phase 9 Navigation)
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-ink-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-forest-700" />
                    {log.timestamp}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-forest-50 border border-forest-200/80">
                    <span className="text-[11px] text-ink-muted block">Contact Channel</span>
                    <span className="font-medium text-ink flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-forest-700" />
                      {log.contactMethod}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-forest-50 border border-forest-200/80">
                    <span className="text-[11px] text-ink-muted block">Transport Facilitation</span>
                    <span className="font-medium text-ink flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-forest-700" />
                      {log.transportType}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-forest-200 text-xs">
                  <strong className="text-forest-950">Counseling & Guidance Summary:</strong>{' '}
                  <span className="text-ink-muted">{log.counselingGiven}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-forest-800 pt-0.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Logged by: <strong>{log.navigatorName}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ADD LOG MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log Patient Navigation Touchpoint"
        titleTe="పేషెంట్ నావిగేషన్ రికార్డు నమోదు"
        maxWidth="md"
      >
        <form onSubmit={handleAddLog} className="space-y-4 py-2 text-xs">
          <div>
            <label className="block font-bold text-ink mb-1">Patient Name:</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full p-2.5 border border-forest-300 rounded-lg text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Contact Method / Liaison:</label>
            <input
              type="text"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              className="w-full p-2.5 border border-forest-300 rounded-lg text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Transport Facilitated:</label>
            <select
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
              className="w-full p-2.5 border border-forest-300 rounded-lg text-xs"
            >
              <option value="ITDA Tribal Patient Van Desk 04">ITDA Tribal Patient Van Desk 04 (Free)</option>
              <option value="108 Tribal Emergency Feeder Route">108 Tribal Emergency Feeder Route</option>
              <option value="ITDA Inter-District Medical Transport">ITDA Inter-District Medical Transport</option>
              <option value="Local Transit Assistance Sanctioned">Local Transit Assistance Sanctioned</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Counseling & Patient Guidance Notes:</label>
            <textarea
              rows={3}
              value={counselingGiven}
              onChange={(e) => setCounselingGiven(e.target.value)}
              className="w-full p-2.5 border border-forest-300 rounded-lg text-xs"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              icon={CheckCircle2}
            >
              Save Navigation Touchpoint
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
