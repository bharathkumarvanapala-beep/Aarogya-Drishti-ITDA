import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Building2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useTranslation } from '../../i18n';
import { CareVideo } from './CareVideo';

export const DoctorTelemedicinePage: React.FC = () => {
  const { language } = useTranslation();
  const [activeCaseId] = useState('case-asr-2026-0042');
  const [urgentReferralDispatched, setUrgentReferralDispatched] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/doctor" className="hover:underline">
              {language === 'te' ? 'క్లినికల్ వర్క్‌స్టేషన్' : 'Clinical Workstation'}
            </Link>
            <span>/</span>
            <Link to="/doctor/cases" className="hover:underline">
              {language === 'te' ? 'కేసు సమీక్ష వరుస' : 'Case Review Queue'}
            </Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">
              {language === 'te' ? 'టెలిమెడిసిన్ కేంద్రం' : 'Telemedicine Hub'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            {language === 'te' ? 'ప్రత్యక్ష టెలిమెడిసిన్ కన్సల్టేషన్ సూట్' : 'Telemedicine Consultation Suite'}
            <Badge label="AUTHENTICATED WEBRTC" variant="success" size="sm" />
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            {language === 'te'
              ? 'గ్రామీణ ఆరోగ్య కార్యకర్తలు మరియు రోగులతో అనుసంధానించబడిన సురక్షిత క్లినికల్ వీడియో సంప్రదింపు.'
              : 'Direct peer-to-peer clinical consultation connecting PHC Medical Officers with remote frontline health workers and patients in ASR District.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/doctor/cases">
            <Button variant="outline" size="sm">
              {language === 'te' ? 'కేసుల జాబితా' : 'View Review Queue'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Real WebRTC Stream & Clinical Patient Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Genuine WebRTC Video Engine */}
        <div className="lg:col-span-8 space-y-4">
          <CareVideo caseId={activeCaseId} />

          {/* Clinical Escalation Bar */}
          <div className="p-4 bg-white border border-forest-200 rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-sm">
            <div>
              <span className="text-xs font-bold text-forest-950 block">
                {language === 'te' ? 'టెలికన్సల్టేషన్ తదుపరి చర్య' : 'Post-Consultation Clinical Action'}
              </span>
              <span className="text-[11px] text-forest-700">
                {language === 'te'
                  ? 'సంప్రదింపు ముగిసిన తర్వాత తృతీయ ఆసుపత్రికి తక్షణ రిఫరల్ జారీ చేయండి.'
                  : 'Dispatch referral to District Hospital Paderu for specialist biopsy and histopathology.'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={urgentReferralDispatched ? 'secondary' : 'primary'}
                size="sm"
                icon={Building2}
                disabled={urgentReferralDispatched}
                onClick={() => setUrgentReferralDispatched(true)}
              >
                {urgentReferralDispatched
                  ? language === 'te'
                    ? 'రిఫరల్ జారీ చేయబడింది'
                    : 'Referral Dispatched to DH Paderu'
                  : language === 'te'
                  ? 'ఆసుపత్రి రిఫరల్ పంపండి'
                  : 'Issue Hospital Referral'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Patient Record Context */}
        <div className="lg:col-span-4 space-y-4">
          <Card
            title={language === 'te' ? 'కేంద్రీకృత పేషెంట్ రికార్డు' : 'Centralized Patient Record'}
            subtitle={language === 'te' ? 'ధృవీకరించబడిన క్లినికల్ సమాచారం' : 'Verified Clinical Background'}
            variant="nature"
            padding="md"
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-forest-100 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-forest-950">Kondala Rao (కొండల రావు)</span>
                  <span className="font-mono text-[11px] font-bold bg-forest-100 text-forest-900 px-2 py-0.5 rounded">
                    ASR-PAT-2026-0842
                  </span>
                </div>
                <div className="text-forest-700">
                  <span>Age: 46 • Male</span>
                  <span className="mx-1.5">•</span>
                  <span>Habitation: <strong>Kothapalli, G. Madugula</strong></span>
                </div>
                <div className="text-[11px] text-forest-600">
                  Frontline ASHA Worker: <strong>Lakshmi Devi (+91-94401-23456)</strong>
                </div>
              </div>

              {/* History & Symptoms */}
              <div className="space-y-2">
                <div className="font-bold text-forest-900 uppercase tracking-wider text-[10px]">
                  {language === 'te' ? 'అలవాట్లు మరియు లక్షణాలు' : 'Habits & Exposure History'}
                </div>
                <div className="p-2.5 rounded-lg bg-forest-50/80 border border-forest-100 text-forest-900 leading-relaxed text-[11px]">
                  Gutkha and raw tobacco chewer for 18 years. Non-healing painless whitish plaque over right buccal mucosa noted for past 6 months. Burning sensation with hot/spicy foods.
                </div>
              </div>

              {/* AI Research Advisory Guardrail */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <ShieldAlert size={14} className="text-amber-700 shrink-0" />
                  <span>AI Advisory Research Flag: YELLOW</span>
                </div>
                <p className="text-[10px] text-amber-900 leading-normal">
                  Mucosal texture irregularity and localized hyperkeratotic plaque detected. Advisory non-clinical assistance only; does not diagnose or rule out cancer. Final clinical judgment rests with the examining Medical Officer.
                </p>
              </div>

              {/* Patient Oral Image Preview */}
              <div className="space-y-1.5">
                <div className="font-bold text-forest-900 uppercase tracking-wider text-[10px]">
                  {language === 'te' ? 'ఫోటో స్క్రీనింగ్ దృశ్యం' : 'Screening Photo (View 1 of 5)'}
                </div>
                <div className="rounded-xl overflow-hidden border border-forest-200 aspect-video bg-forest-950 relative">
                  <img
                    src="/images/sample_oral_patch.jpg"
                    alt="Buccal mucosa screening"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white">
                    Right Buccal Mucosa (Sharpness: 92%)
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
