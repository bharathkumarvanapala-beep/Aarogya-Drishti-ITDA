import React from 'react';
import { 
  Users, 
  Camera, 
  Stethoscope, 
  Building2, 
  RotateCw, 
  ShieldAlert
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from '../../i18n';

export const HowItWorksPage: React.FC = () => {
  const { language, t } = useTranslation();

  const steps = [
    {
      num: 1,
      title: 'Doorstep Village Screening',
      titleTe: 'గ్రామ ప్రాథమిక పరిశీలన',
      actor: 'Community Health Worker (ASHA / ANM)',
      actorTe: 'ఆశా / ఏఎన్ఎం కార్యకర్త',
      desc: 'The health worker visits tribal habitations with a tablet or mobile phone. Patients are registered using basic demographic details—no smartphone, email, or Aadhaar is required.',
      descTe: 'ఆరోగ్య కార్యకర్తలు ఇంటింటికీ వెళ్లి ప్రాథమిక వివరాలను నమోదు చేస్తారు. స్మార్ట్‌ఫోన్ లేదా ఆధార్ తప్పనిసరి కాదు.',
      icon: Users,
    },
    {
      num: 2,
      title: 'Informed Consent & Guided Photography',
      titleTe: 'సమ్మతి & 5 ప్రామాణిక నోటి ఫోటోలు',
      actor: 'Health Worker + Guided Quality Validator',
      actorTe: 'ఆరోగ్య కార్యకర్త మరియు నాణ్యత పరీక్ష',
      desc: 'Verbal consent is explained in Telugu and documented. The worker captures 5 standardized views of the mouth with real-time blur and lighting checks. Records are saved locally in offline mode.',
      descTe: 'రోగి సమ్మతితో నోటిలోని 5 భాగాల స్పష్టమైన ఫోటోలను తీస్తారు. ఇంటర్నెట్ లేకపోయినా డేటా భద్రంగా ఉంటుంది.',
      icon: Camera,
    },
    {
      num: 3,
      title: 'Clinical Review & AI Research Advisory',
      titleTe: 'వైద్యాధికారి స్వతంత్ర పరిశీలన',
      actor: 'PHC Medical Officer (Doctor)',
      actorTe: 'ప్రాథమిక ఆరోగ్య కేంద్ర డాక్టర్',
      desc: 'When synchronized, the case reaches the doctor’s secure triage queue. The doctor reviews patient history and zooms into the photos. An isolated research AI model provides an advisory finding, but the doctor independently signs the clinical decision.',
      descTe: 'వైద్యాధికారి ఫోటోలను క్షుణ్ణంగా పరిశీలించి, స్వతంత్రంగా వైద్య నిర్ణయాన్ని నమోదు చేస్తారు. ఏఐ కేవలం సూచన మాత్రమే.',
      icon: Stethoscope,
    },
    {
      num: 4,
      title: 'Hospital Referral & Biopsy Tracking',
      titleTe: 'ఆసుపత్రి రిఫరల్ & బయాప్సీ సమన్వయం',
      actor: 'District Hospital / Specialist Oncology Centre',
      actorTe: 'జిల్లా ఆసుపత్రి మరియు స్పెషలిస్టులు',
      desc: 'If a lesion requires investigation, an authorized referral is dispatched to District Hospital Paderu or KGH Visakhapatnam. Appointment dates are scheduled, and biopsy/histopathology tracking begins.',
      descTe: 'అనుమానాస్పద మార్పులు ఉంటే పాడేరు లేదా కేజీహెచ్ ఆసుపత్రికి రిఫర్ చేసి బయాప్సీ పరీక్ష నిర్వహిస్తారు.',
      icon: Building2,
    },
    {
      num: 5,
      title: 'Longitudinal Navigation & Follow-Up',
      titleTe: 'తదుపరి పర్యవేక్షణ & సంరక్షణ',
      actor: 'Patient Navigator & Frontline Worker',
      actorTe: 'పేషెంట్ నావిగేటర్ మరియు ఆరోగ్య కార్యకర్త',
      desc: 'Patient navigators assist families with travel logistics and reminders. Follow-up examinations ensure no patient is lost in the care journey.',
      descTe: 'రోగి చికిత్స పూర్తయ్యే వరకు ఆరోగ్య కార్యకర్తలు నిరంతరం అండగా ఉంటారు. ఎవరూ వైద్యానికి దూరం కారాదు.',
      icon: RotateCw,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Go to Previous Navigation */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/" label="Go to Previous" labelTe="మునుపటి పేజీకి" variant="outline" size="sm" />
      </div>

      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
          The Care Pathway
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          {t('howItWorksTitle')}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold font-telugu text-forest-900">
          {t('howItWorksSubtitle')}
        </h2>
        <p className="text-xs sm:text-base text-ink-muted leading-relaxed">
          A continuous, humane workflow built specifically for rural and tribal realities where internet may be absent and distances are vast.
        </p>
      </div>

      {/* 5-Step Vertical Timeline */}
      <div className="space-y-8 relative">
        {/* Timeline connector line for desktop */}
        <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-forest-200 transform -translate-x-1/2 z-0" />

        {steps.map((step, idx) => {
          const isEven = idx % 2 === 1;
          const Icon = step.icon;

          return (
            <div key={step.num} className="relative z-10">
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Content Box */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:col-start-8' : ''}`}>
                  <Card variant="nature" padding="md" className="space-y-3 border-forest-200">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-forest-900 text-white font-mono text-xs font-bold">
                        Step 0{step.num}
                      </span>
                      <span className="text-xs font-semibold text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                        {step.actor}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="text-sm font-telugu text-forest-900 font-semibold -mt-1">
                      {step.titleTe}
                    </p>

                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {language === 'te' ? step.descTe : step.desc}
                    </p>
                  </Card>
                </div>

                {/* Center Badge Icon on Desktop */}
                <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-forest-900 text-white flex items-center justify-center shadow-nature-lg border-4 border-white">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Empty spacer for alignment */}
                <div className={`hidden lg:block lg:col-span-5 ${isEven ? 'lg:col-start-1' : ''}`} />

              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Boundary Highlights */}
      <Card variant="default" padding="lg" className="border-forest-200">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-ink flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-forest-800" />
            <span>Strict Architectural & Safety Guardrails</span>
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            1. **Never Autonomous AI Diagnosis:** The AI pipeline provides structured non-clinical demonstration output only. It cannot diagnose or rule out oral cancer.<br />
            2. **Offline-Safe:** If internet drops in remote habitations, records stay secure in device memory and sync when connected.<br />
            3. **Doctor-Signed Care:** Only qualified medical officers sign clinical referrals and guide patient navigation.
          </p>
        </div>
      </Card>

    </div>
  );
};
