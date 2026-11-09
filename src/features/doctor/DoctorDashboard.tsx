import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Send,
  Video,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import { INITIAL_DOCTOR_CASES } from './doctorData';

export const DoctorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useTranslation();

  const priorityCases = INITIAL_DOCTOR_CASES.filter((c) => c.status !== 'COMPLETED');

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <Card variant="nature" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-white font-mono">
                Primary Health Centre Medical Officer
              </span>
              <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
                G. Madugula PHC (ASR District)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              Clinical Workstation — {currentUser ? (language === 'te' ? currentUser.nameTe : currentUser.name) : 'Dr. K. Suresh, MBBS'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Longitudinal Case Triage • Independent Clinical Assessment • Specialist Referrals • Teleconsultation
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/doctor/telemedicine">
              <Button variant="outline" size="md" icon={Video}>
                Telemedicine Suite
              </Button>
            </Link>
            <Link to="/doctor/cases">
              <Button variant="primary" size="md" icon={Stethoscope}>
                Open Review Queue ({priorityCases.length})
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Primary Clinical Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Cases Awaiting Review"
          labelTe="పరిశీలన జాబితా"
          value="4"
          icon={Stethoscope}
          subtext="Submitted by ASHA workers"
          variant="amber"
        />
        <StatCard
          label="Priority Suspicious"
          labelTe="అత్యవసర కేసులు"
          value="2"
          icon={ShieldAlert}
          subtext="High-risk tobacco / leukoplakia"
          variant="amber"
        />
        <StatCard
          label="Specialist Referrals"
          labelTe="స్పెషలిస్ట్ రిఫరల్స్"
          value="18"
          icon={Send}
          subtext="District Hospital Paderu"
          variant="forest"
        />
        <StatCard
          label="Teleconsultations Completed"
          labelTe="వీడియో సంప్రదింపులు"
          value="14"
          icon={Video}
          subtext="Encrypted WebRTC link"
          variant="blue"
        />
      </div>

      {/* Priority Cases Awaiting Review */}
      <Card
        title="Priority Cases Awaiting Independent Clinical Review"
        titleTe="ప్రాధాన్యత ప్రకారం పరిశీలించాల్సిన కేసులు"
        subtitle="Review frontline photographs, assess mucosal pathology, and dispatch specialist hospital referrals"
      >
        <div className="divide-y divide-forest-100">
          {priorityCases.slice(0, 3).map((c) => {
            const isKondalaRao = c.id === 'SCR-2026-0042';

            return (
              <div
                key={c.id}
                className={`py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                  isKondalaRao ? 'bg-amber-50/30 -mx-6 px-6' : ''
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded border border-forest-200">
                      {c.id}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                    {c.triagePriority === 'HIGH_PRIORITY' && (
                      <Badge label="HIGH PRIORITY" variant="danger" size="sm" />
                    )}
                    {isKondalaRao && (
                      <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                        Target Patient Scenario
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h4 className="text-base font-bold text-ink">
                      {c.patientName} ({c.age}M)
                    </h4>
                    {language === 'te' && (
                      <span className="text-sm font-telugu text-forest-800">
                        {c.patientNameTe}
                      </span>
                    )}
                    <span className="text-xs text-ink-muted">
                      • Habitation: <strong>{c.habitation}</strong>, {c.mandal}
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted">
                    <strong className="text-ink">Complaint:</strong> {c.complaint} ({c.duration}) • <strong>Habits:</strong> {c.tobaccoHistory}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-forest-800">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {c.healthWorkerName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {c.screeningDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <Link to={`/doctor/cases/${c.id}`} className="w-full md:w-auto">
                    <Button variant="primary" size="sm" icon={Stethoscope}>
                      Review Case Details
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-forest-100 flex justify-between items-center text-xs">
          <span className="text-ink-muted">
            Displaying top priority cases. 1 routine case pending.
          </span>
          <Link
            to="/doctor/cases"
            className="inline-flex items-center gap-1 font-bold text-forest-800 hover:underline"
          >
            <span>View Full Triage Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

      {/* Clinical Reference & Workflow Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding="md" className="border-forest-200 bg-white space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-forest-800" />
            <h4 className="text-sm font-bold text-ink">
              Clinical Safety & Diagnostic Separation
            </h4>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            All AI research tags provided in case records are experimental demonstrators and do not constitute clinical findings. The Medical Officer conducts an independent review and signs all diagnosis, staging, and referral decisions.
          </p>
        </Card>

        <Card padding="md" className="border-forest-200 bg-white space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <h4 className="text-sm font-bold text-ink">
              District Hospital Referral Integration
            </h4>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Specialist referrals dispatched here automatically appear in District Hospital Paderu's incoming referral registry (Phase 9), enabling tribal patient transport coordination and biopsy scheduling.
          </p>
        </Card>
      </div>

    </div>
  );
};
