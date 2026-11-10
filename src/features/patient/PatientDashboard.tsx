import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  PhoneCall,
  Video
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';
import { careApi, type CareRecord } from '../../services/careApi';

export const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useTranslation();
  const [activeCase, setActiveCase] = useState<CareRecord | null>(null);

  useEffect(() => {
    let mounted = true;
    careApi<CareRecord[]>('/cases')
      .then((cases) => {
        if (!mounted) return;
        if (Array.isArray(cases) && cases.length > 0) {
          setActiveCase(cases[0]);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const patientId = activeCase?.patientId || 'ASR-PAT-2026-0842';
  const patientName = activeCase?.name || (currentUser ? (language === 'te' ? currentUser.nameTe : currentUser.name) : 'Kondala Rao (కొండల రావు)');
  const habitation = `${activeCase?.village || 'Kothapalli'}, ${activeCase?.mandal || 'G. Madugula'}`;
  const caseStatus = activeCase?.status || 'REFERRED';

  return (
    <div className="space-y-8 pb-12">
      {/* Patient Assisted Access Notification */}
      <Alert type="info" title="Assisted Care & Free Access Guarantee" titleTe="ఉచిత సంరక్షణ మరియు సహాయక సేవల హామీ">
        <p>
          {language === 'te'
            ? 'మా గిరిజన ఆరోగ్య వ్యవస్థలో, వైద్య సేవలు పొందడానికి మీకు స్మార్ట్‌ఫోన్, ఇంటర్నెట్ లేదా పాస్‌వర్డ్ అవసరం లేదు. మీ భౌతిక హెల్త్ కార్డు మరియు ఆశా కార్యకర్త (లక్ష్మి దేవి) సహాయంతో ఉచిత చికిత్స లభిస్తుంది.'
            : 'In our tribal health system, you do not need a smartphone, internet connection, or password to receive treatment. Your physical health card and ASHA health worker (Lakshmi Devi) are all you need at any government hospital or PHC.'}
        </p>
      </Alert>

      {/* Patient Profile Card */}
      <Card variant="nature" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-900 text-white flex items-center justify-center text-xl font-bold font-mono shadow-md">
              {patientName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded-full">
                  {patientId}
                </span>
                <StatusBadge status="PENDING" label={caseStatus} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
                {patientName}
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted">
                Age: {activeCase?.age || 46} • {activeCase?.sex || 'Male'} • Habitation: <strong className="text-forest-900">{habitation}</strong> • ITDA Paderu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/patient/consultation">
              <Button variant="primary" size="md" icon={Video}>
                {language === 'te' ? 'వీడియో డాక్టర్ సంప్రదింపు' : 'Join Video Consultation'}
              </Button>
            </Link>
            <Link to="/patient/card-preview">
              <Button variant="outline" size="md" icon={CreditCard}>
                {language === 'te' ? 'డిజిటల్ కార్డు ప్రింట్' : 'View Physical Health Card'}
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
                    {language === 'te'
                      ? 'స్పెషలిస్ట్ పరిశీలన మరియు బయాప్సీ సిఫార్సు చేయబడింది'
                      : 'Specialist OPD Consultation & Biopsy Recommended'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                  Ref #REF-2026-0189
                </span>
              </div>

              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                Referred by <strong className="font-semibold">Dr. K. Suresh (G. Madugula PHC)</strong> to <strong className="font-semibold">District Hospital Paderu (Specialist Oral Oncology OPD)</strong> for independent clinical evaluation and diagnostic histopathology.
              </p>

              <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between text-xs text-amber-950 gap-2">
                <span>Assigned Navigator: <strong>Rajesh Varma (08935-250000)</strong></span>
                <span>Facility: <strong>District Hospital Paderu</strong></span>
              </div>
            </div>

            {/* Visual Step-by-Step Care Steps */}
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted font-mono">
                {language === 'te' ? 'వైద్య సేవల దశలు' : 'Care Continuum Progression'}
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ink">
                      {language === 'te' ? 'గ్రామంలో ఆశా కార్యకర్త స్క్రీనింగ్' : 'Doorstep Screening by ASHA Worker'}
                    </span>
                    <p className="text-xs text-ink-muted">
                      Conducted at Kothapalli by Lakshmi Devi (HW-001) with 5-view quality checked photography.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ink">
                      {language === 'te' ? 'వైద్యాధికారి క్లినికల్ సమీక్ష & AI సహాయం' : 'Medical Officer Independent Review & Advisory AI Verification'}
                    </span>
                    <p className="text-xs text-ink-muted">
                      Evaluated by Dr. K. Suresh at G. Madugula PHC. Non-clinical AI advisory confirmed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    3
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ink">
                      {language === 'te' ? 'ప్రత్యక్ష టెలిమెడిసిన్ & జిల్లా ఆసుపత్రి రిఫరల్' : 'Live Telemedicine Video Consultation & Hospital Referral'}
                    </span>
                    <p className="text-xs text-ink-muted">
                      Active video session available. Awaiting specialist examination at District Hospital Paderu. Transport support provided via ITDA.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    4
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ink">
                      {language === 'te' ? 'బయాప్సీ ఫలితాలు & చికిత్స ప్రారంభం' : 'Diagnostic Biopsy, Histopathology & Treatment Linkage'}
                    </span>
                    <p className="text-xs text-ink-muted">
                      Histopathological confirmation and treatment initiation through tertiary referral.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    5
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ink">
                      {language === 'te' ? 'గ్రామ స్థాయిలో ఆశా ఫాలో-అప్' : 'Community Village Follow-up by Frontline Worker'}
                    </span>
                    <p className="text-xs text-ink-muted">
                      Regular follow-up visits and habit cessation reinforcement by ASHA worker.
                    </p>
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
                <span className="font-bold text-ink block text-sm">Dr. K. Suresh Kumar, MBBS</span>
                <span className="text-forest-800 font-semibold block">Medical Officer (PHC)</span>
                <p className="text-ink-muted">G. Madugula Primary Health Centre</p>
              </div>

              <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 space-y-1">
                <span className="font-bold text-ink block text-sm">Rajesh Varma</span>
                <span className="text-forest-800 font-semibold block">Hospital Referral Coordinator</span>
                <p className="text-ink-muted">District Hospital Paderu • Phone: 08935-241250</p>
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
