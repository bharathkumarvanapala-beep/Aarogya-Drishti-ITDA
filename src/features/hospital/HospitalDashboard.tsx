import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Microscope,
  Compass,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import { INITIAL_INBOUND_REFERRALS, INITIAL_APPOINTMENTS, INITIAL_INVESTIGATIONS } from './hospitalData';

export const HospitalDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useTranslation();

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <Card variant="nature" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900 text-white font-mono">
                District Referral & Cancer Care Hub
              </span>
              <span className="text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
                District Hospital, Paderu (ASR District)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              Hospital Coordination Desk — {currentUser ? (language === 'te' ? currentUser.nameTe : currentUser.name) : 'Rajesh Varma'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Inbound Referral Triage • Specialist OPD Clinic • Diagnostic Biopsies • Tribal Patient Navigation
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/hospital/referrals">
              <Button variant="primary" size="md" icon={Building2}>
                Inbound Referrals ({INITIAL_INBOUND_REFERRALS.length})
              </Button>
            </Link>
            <Link to="/hospital/navigation">
              <Button variant="outline" size="md" icon={Compass}>
                Navigation Desk
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Hospital Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Inbound Referrals"
          labelTe="వచ్చిన రిఫరల్స్"
          value={INITIAL_INBOUND_REFERRALS.length.toString()}
          icon={Building2}
          subtext="From PHCs across ASR District"
          variant="blue"
        />
        <StatCard
          label="Specialist OPD Clinics"
          labelTe="నేటి అపాయింట్‌మెంట్లు"
          value={INITIAL_APPOINTMENTS.length.toString()}
          icon={Calendar}
          subtext="Room 14 (Oral Onco OPD)"
          variant="forest"
        />
        <StatCard
          label="Biopsies Scheduled"
          labelTe="నిర్ధారించాల్సిన బయాప్సీలు"
          value={INITIAL_INVESTIGATIONS.length.toString()}
          icon={Microscope}
          subtext="In-house DH Pathology Lab"
          variant="amber"
        />
        <StatCard
          label="Tribal Patients Navigated"
          labelTe="సమన్వయం పూర్తయిన రోగులు"
          value="48"
          icon={Compass}
          subtext="Free ITDA transport & stay"
          variant="emerald"
        />
      </div>

      {/* Priority Inbound Referrals List */}
      <Card
        title="Priority Inbound Referrals for District Hospital Paderu"
        titleTe="పాడేరు జిల్లా ఆసుపత్రికి వచ్చిన అత్యవసర రిఫరల్ కేసులు"
        subtitle="Review clinical dossier, allocate surgical specialist, and schedule diagnostic biopsy"
      >
        <div className="divide-y divide-forest-100">
          {INITIAL_INBOUND_REFERRALS.slice(0, 3).map((r) => {
            const isKondalaRao = r.id === 'REF-2026-0019';

            return (
              <div
                key={r.id}
                className={`py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                  isKondalaRao ? 'bg-blue-50/40 -mx-6 px-6' : ''
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                      {r.id}
                    </span>
                    <span className="font-mono text-xs text-ink-muted">
                      Card: {r.patientId}
                    </span>
                    <StatusBadge status={r.status} size="sm" />
                    {r.priority === 'HIGH_2W' && (
                      <Badge label="HIGH PRIORITY" variant="warning" size="sm" />
                    )}
                    {r.priority === 'URGENT_72H' && (
                      <Badge label="URGENT (72H)" variant="danger" size="sm" />
                    )}
                    {isKondalaRao && (
                      <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                        Standard Synthetic Demo Scenario
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h4 className="text-base font-bold text-ink">
                      {r.patientName} ({r.age}M)
                    </h4>
                    {language === 'te' && (
                      <span className="text-sm font-telugu text-forest-800">
                        {r.patientNameTe}
                      </span>
                    )}
                    <span className="text-xs text-ink-muted">
                      • {r.habitation}, {r.mandal} Mandal
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted">
                    <strong className="text-ink">Provisional Diagnosis:</strong> {r.provisionalDiagnosis}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-forest-800 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Referred by: {r.referringDoctor} ({r.referringFacility})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      {r.transportAssistance}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <Link to="/hospital/referrals" className="w-full md:w-auto">
                    <Button variant="primary" size="sm">
                      Manage Referral
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-forest-100 flex justify-between items-center text-xs">
          <span className="text-ink-muted">
            Displaying top priority referrals.
          </span>
          <Link
            to="/hospital/referrals"
            className="inline-flex items-center gap-1 font-bold text-blue-900 hover:underline"
          >
            <span>View All Inbound Referrals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

      {/* 2-Column Split: Appointments & Biopsies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Specialist OPD Clinics */}
        <Card
          title="Upcoming Specialist OPD Clinics"
          titleTe="రాబోయే స్పెషలిస్ట్ ఓపీడీ అపాయింట్‌మెంట్లు"
          subtitle="Room 14 & 12 • District Hospital Paderu"
        >
          <div className="space-y-3">
            {INITIAL_APPOINTMENTS.slice(0, 2).map((apt) => (
              <div key={apt.id} className="p-3 bg-forest-50/60 rounded-xl border border-forest-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-ink">{apt.patientName} ({apt.patientId})</span>
                  <Badge label={apt.status} variant="info" size="sm" />
                </div>
                <div className="flex items-center gap-3 text-ink-muted text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-forest-700" />
                    {apt.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-forest-700" />
                    {apt.timeSlot}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-forest-800">
                  <User className="w-3 h-3" />
                  <span>{apt.specialist} ({apt.clinicRoom.split(' (')[0]})</span>
                </div>
              </div>
            ))}

            <Link to="/hospital/appointments" className="block text-center pt-1 text-xs font-bold text-forest-800 hover:underline">
              Open Full OPD Schedule →
            </Link>
          </div>
        </Card>

        {/* Diagnostic Biopsy Pipeline */}
        <Card
          title="Diagnostic Biopsy & Histopathology"
          titleTe="డయాగ్నస్టిక్ బయాప్సీ & ల్యాబ్ ట్రాకర్"
          subtitle="District Hospital Pathology Lab Tracking"
        >
          <div className="space-y-3">
            {INITIAL_INVESTIGATIONS.slice(0, 2).map((inv) => (
              <div key={inv.id} className="p-3 bg-forest-50/60 rounded-xl border border-forest-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-ink">{inv.patientName}</span>
                  <Badge
                    label={inv.status.replace(/_/g, ' ')}
                    variant={inv.status === 'REVIEWED' ? 'success' : 'warning'}
                    size="sm"
                  />
                </div>
                <p className="text-ink-muted text-[11px] truncate">
                  {inv.investigationType}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{inv.interimNotes}</span>
                </div>
              </div>
            ))}

            <Link to="/hospital/investigations" className="block text-center pt-1 text-xs font-bold text-forest-800 hover:underline">
              Open Biopsy Tracking Console →
            </Link>
          </div>
        </Card>

      </div>

    </div>
  );
};
