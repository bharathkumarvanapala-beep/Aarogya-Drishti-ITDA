import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Ambulance, 
  Phone, 
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';

interface ReferralItem {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  habitation: string;
  referredBy: string;
  referredTo: string;
  reason: string;
  reasonTe: string;
  appointmentDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  transportArranged: boolean;
  navigatorContact: string;
}

const MOCK_REFERRALS: ReferralItem[] = [
  {
    id: 'REF-2026-0189',
    patientId: 'ASR-PAT-2026-0842',
    patientName: 'Kondala Rao',
    age: 46,
    gender: 'Male',
    habitation: 'Kothapalli',
    referredBy: 'Dr. K. Suresh, MBBS (G. Madugula PHC)',
    referredTo: 'District Hospital Paderu (Specialist Oral OPD)',
    reason: 'Suspicious persistent leukoplakic patch on right buccal mucosa (> 3 weeks duration)',
    reasonTe: 'కుడి దవడ లోపల తగ్గని తెల్లటి మచ్చ పరిశీలన కొరకు',
    appointmentDate: '04 Nov 2026',
    status: 'IN_PROGRESS',
    transportArranged: true,
    navigatorContact: 'Rajesh Varma (08935-250000)',
  },
  {
    id: 'REF-2026-0142',
    patientId: 'ASR-PAT-2026-0810',
    patientName: 'Bala Raju',
    age: 52,
    gender: 'Male',
    habitation: 'Nurmati',
    referredBy: 'Dr. K. Suresh, MBBS',
    referredTo: 'District Hospital Paderu',
    reason: 'Restricted mouth opening (1.5 fingers) - Oral Submucous Fibrosis management',
    reasonTe: 'నోరు తెరవలేకపోవడం - ఓఎస్‌ఎంఎఫ్ చికిత్స',
    appointmentDate: '12 Nov 2026',
    status: 'PENDING',
    transportArranged: false,
    navigatorContact: 'Pending Desk Allocation',
  },
];

export const ReferralTrackingPage: React.FC = () => {
  const { language } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress'>('all');

  const filteredReferrals = MOCK_REFERRALS.filter((r) => {
    if (filter === 'pending') return r.status === 'PENDING';
    if (filter === 'in_progress') return r.status === 'IN_PROGRESS';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Care Coordination
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              G. Madugula Sub-Centre
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            Outbound Specialist Referral Tracking
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Track patients referred from your villages to Primary Health Centres and District Hospital Paderu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filter === 'all' ? 'bg-forest-900 text-white' : 'bg-forest-100 text-forest-900'}`}
          >
            All Referrals ({MOCK_REFERRALS.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filter === 'in_progress' ? 'bg-forest-900 text-white' : 'bg-forest-100 text-forest-900'}`}
          >
            Active (1)
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filter === 'pending' ? 'bg-forest-900 text-white' : 'bg-forest-100 text-forest-900'}`}
          >
            Pending Transport (1)
          </button>
        </div>
      </div>

      {/* Referral Cards */}
      <div className="space-y-4">
        {filteredReferrals.map((referral) => (
          <Card key={referral.id} variant="default" padding="lg" className="border-forest-100 hover:border-forest-300 transition-colors">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded">
                    {referral.id}
                  </span>
                  <StatusBadge status={referral.status} />
                  <span className="text-xs font-mono font-bold text-ink-muted">
                    Citizen ID: {referral.patientId}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-ink">
                    {referral.patientName} ({referral.age}M) — <span className="text-forest-800">{referral.habitation}</span>
                  </h3>
                  <p className="text-xs text-ink font-medium mt-0.5">
                    {language === 'te' ? referral.reasonTe : referral.reason}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-muted pt-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-forest-800" />
                    <span>Facility: <strong>{referral.referredTo}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-forest-800" />
                    <span>Appointment Date: <strong className="text-ink">{referral.appointmentDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Ambulance className="w-3.5 h-3.5 text-forest-800" />
                    <span>
                      Transport Status: {referral.transportArranged ? (
                        <strong className="text-emerald-700">Arranged via 108 Tribal Desk</strong>
                      ) : (
                        <strong className="text-amber-700">Awaiting Booking Confirmation</strong>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-forest-800" />
                    <span>Navigator: {referral.navigatorContact}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex items-center gap-2">
                <Link to="/patient/journey">
                  <Button variant="outline" size="sm" icon={ArrowRight}>
                    View Journey
                  </Button>
                </Link>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
