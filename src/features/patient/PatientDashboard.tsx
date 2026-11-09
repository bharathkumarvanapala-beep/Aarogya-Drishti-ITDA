import { 
  CreditCard, 
  PhoneCall
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';

export const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Patient Assisted Access Notification */}
      <Alert type="info" title="Assisted Care & Free Access Guarantee" titleTe="ఉచిత సంరక్షణ మరియు సహాయక సేవల హామీ">
        <p>
          In our tribal health system, you do not need a smartphone, internet connection, or password to receive treatment. Your physical health card and ASHA health worker (Lakshmi Devi) are all you need at any government hospital or PHC.
        </p>
      </Alert>

      {/* Patient Profile Card */}
      <Card variant="nature" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-900 text-white flex items-center justify-center text-xl font-bold font-mono shadow-md">
              KR
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded-full">
                  ASR-PAT-2026-0842
                </span>
                <StatusBadge status="PENDING" label="Referral Active" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
                {currentUser ? (language === 'te' ? currentUser.nameTe : currentUser.name) : 'Kondala Rao (కొండల రావు)'}
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted">
                Age: 46 • Male • Habitation: <strong className="text-forest-900">Kothapalli, G. Madugula</strong> • ITDA Paderu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/patient/card-preview">
              <Button variant="primary" size="md" icon={CreditCard}>
                View Physical Health Card
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Immediate Health Pathway Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card 
            title="Active Care Status & Referral Progress" 
            titleTe="ప్రస్తుత వైద్య పురోగతి మరియు రిఫరల్ వివరాలు"
            subtitle="Current stage in the continuous care continuum"
          >
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
                  <span className="font-bold text-sm text-amber-950">
                    Specialist OPD Consultation Recommended
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                  Ref #REF-2026-0189
                </span>
              </div>

              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                Referred by <strong className="font-semibold">Dr. K. Suresh (G. Madugula PHC)</strong> to <strong className="font-semibold">District Hospital Paderu (Specialist Oral OPD)</strong> for high-resolution visual examination and diagnostic opinion.
              </p>

              <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between text-xs text-amber-950 gap-2">
                <span>Assigned Navigator: <strong>Rajesh Varma (08935-250000)</strong></span>
                <span>Scheduled Window: <strong>Next 7 Days</strong></span>
              </div>
            </div>

            {/* Step-by-Step Care Steps */}
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted font-mono">
                Care Continuum Steps
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ink">Doorstep Screening by ASHA</span>
                    <p className="text-xs text-ink-muted">Conducted on 28 Oct 2026 at Kothapalli by Lakshmi Devi (HW-001).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ink">Medical Officer Clinical Review</span>
                    <p className="text-xs text-ink-muted">Evaluated on 29 Oct 2026 by Dr. K. Suresh at G. Madugula PHC.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    3
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ink">Specialist OPD & Investigation</span>
                    <p className="text-xs text-ink-muted">Awaiting visit to District Hospital Paderu. Transport assistance available via ITDA.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Support & Contacts Sidebar */}
        <div className="space-y-6">
          <Card title="Your Local Healthcare Team" titleTe="మీ స్థానిక వైద్య బృందం">
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 space-y-1">
                <span className="font-bold text-ink block text-sm">Lakshmi Devi</span>
                <span className="text-forest-800 font-semibold block">Community Health Worker (ASHA)</span>
                <p className="text-ink-muted">G. Madugula Sub-Centre • Kothapalli Habitation</p>
              </div>

              <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 space-y-1">
                <span className="font-bold text-ink block text-sm">Dr. K. Suresh, MBBS</span>
                <span className="text-forest-800 font-semibold block">Medical Officer (PHC)</span>
                <p className="text-ink-muted">G. Madugula Primary Health Centre</p>
              </div>
            </div>
          </Card>

          <Card title="Emergency & Free Helplines" titleTe="ఉచిత అత్యవసర నంబర్లు">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50 text-xs">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-forest-800" />
                  <span className="font-bold text-ink">Aarogya Help Line</span>
                </div>
                <span className="font-mono font-bold text-forest-900 text-sm">104</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50 text-xs">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-forest-800" />
                  <span className="font-bold text-ink">Emergency Ambulance</span>
                </div>
                <span className="font-mono font-bold text-forest-900 text-sm">108</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50 text-xs">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-forest-800" />
                  <span className="font-bold text-ink">ITDA Paderu Desk</span>
                </div>
                <span className="font-mono font-bold text-forest-900">08935-250000</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
