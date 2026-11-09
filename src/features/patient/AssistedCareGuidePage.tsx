import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  CreditCard, 
  PhoneCall, 
  Users, 
  Ambulance, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';

export const AssistedCareGuidePage: React.FC = () => {
  const { language } = useTranslation();

  const pillars = [
    {
      title: 'Doorstep Frontline Reach',
      titleTe: 'ఇంటి వద్దకే ఆరోగ్య సేవలు',
      description: 'Your local ASHA health worker (e.g., Lakshmi Devi in Kothapalli) visits your doorstep. You do not need to own a smartphone, install an app, or remember passwords. Health workers carry the technology so that you receive professional care wherever you live.',
      descriptionTe: 'స్థానిక ఆశా కార్యకర్త మీ ఇంటికే వచ్చి ప్రాథమిక నోటి పరీక్షలు నిర్వహిస్తారు. మీకు స్మార్ట్‌ఫోన్ లేదా ఇంటర్నెట్ అవసరం లేదు.',
      icon: Users,
    },
    {
      title: 'Physical Health Card Continuity',
      titleTe: 'శాశ్వత హెల్త్ కార్డు రక్షణ',
      description: 'Every registered citizen receives a durable printed physical card with a unique ID and non-sensitive reference QR code. Presenting this card at any Primary Health Centre or District Hospital Paderu instantly recalls your care history without paper prescriptions.',
      descriptionTe: 'ప్రతి పౌరుడికి ముద్రిత హెల్త్ కార్డు అందించబడుతుంది. ఈ కార్డును చూపించి ప్రభుత్వ ఆసుపత్రులలో ఉచిత వైద్యం పొందవచ్చు.',
      icon: CreditCard,
    },
    {
      title: '100% Free Diagnostic & Clinical Care',
      titleTe: 'పూర్తి ఉచిత రోగ నిర్ధారణ & చికిత్స',
      description: 'Under ITDA Paderu, the National Health Mission, and Dr. YSR Aarogyasri, all oral cancer screenings, specialist examinations, histopathology biopsies, and surgical treatments are provided completely free of cost without any out-of-pocket expenses.',
      descriptionTe: 'ప్రభుత్వ సహకారంతో అన్ని నోటి స్క్రీనింగ్‌లు, బయాప్సీలు మరియు ఆసుపత్రి చికిత్సలు పూర్తిగా ఉచితం.',
      icon: ShieldCheck,
    },
    {
      title: 'Free Transport & Tribal Patient Navigators',
      titleTe: 'ఉచిత రవాణా మరియు పేషెంట్ నావిగేటర్లు',
      description: 'If referred to District Hospital Paderu, tribal patient navigators (e.g., Rajesh Varma) coordinate your appointment, assist with hospital guidance, and help arrange free transportation via 108 tribal emergency ambulances and ITDA transport desks.',
      descriptionTe: 'జిల్లా ఆసుపత్రికి వెళ్లేందుకు ఉచిత రవాణా సదుపాయం మరియు ఆసుపత్రిలో మార్గదర్శనం చేసేందుకు ప్రత్యేక సిబ్బంది ఉంటారు.',
      icon: Ambulance,
    },
  ];

  const comparisonRows = [
    {
      feature: 'Mobile Smartphone Required',
      featureTe: 'స్మార్ట్‌ఫోన్ అవసరమా?',
      standard: 'Mandatory (App install / Android 10+)',
      aarogya: 'Never. Frontline worker brings all tools.',
      aarogyaPositive: true,
    },
    {
      feature: 'Phone Number & OTP Authentication',
      featureTe: 'ఫోన్ నంబర్ & ఓటీపీ తప్పనిసరి?',
      standard: 'Strictly required for login and access',
      aarogya: 'Not required. Card token & village register used.',
      aarogyaPositive: true,
    },
    {
      feature: 'Internet Connectivity at Home',
      featureTe: 'ఇంట్లో ఇంటర్నెట్ కనెక్షన్ ఉండాలా?',
      standard: 'Required for real-time portals',
      aarogya: 'Not needed. Frontline works 100% offline.',
      aarogyaPositive: true,
    },
    {
      feature: 'Care Delivery Location',
      featureTe: 'వైద్య సేవల ప్రదేశం',
      standard: 'Urban clinics or distant hospitals',
      aarogya: 'Doorstep in tribal habitations & local PHCs.',
      aarogyaPositive: true,
    },
    {
      feature: 'Hospital Navigation Support',
      featureTe: 'ఆసుపత్రిలో సహాయక సిబ్బంది',
      standard: 'Self-guided queues & paper paperwork',
      aarogya: 'Dedicated Telugu-speaking Patient Navigators.',
      aarogyaPositive: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <Card variant="nature" padding="lg">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 text-white text-xs font-bold uppercase tracking-wider font-mono">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Assisted Frontline Care Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">
            Healthcare That Reaches You — Without Digital Barriers
          </h1>

          <p className="text-lg font-telugu text-forest-900 font-semibold">
            సాంకేతికత రోగి వద్దకు చేరుతుంది — రోగి వద్దకు సాంకేతికత కాదు
          </p>

          <p className="text-sm text-ink-muted leading-relaxed">
            In the remote and tribal habitations of Alluri Sitharama Raju District, healthcare must never depend on owning a high-end smartphone, reading English text, or having high-speed 4G coverage. AAROGYA DRISHTI is built from the ground up on the principle of <strong>Assisted Access</strong>.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link to="/patient/card-preview">
              <Button variant="primary" size="md" icon={CreditCard}>
                View Physical Health Card
              </Button>
            </Link>
            <Link to="/patient/journey">
              <Button variant="outline" size="md" icon={ArrowRight}>
                Care Journey Timeline
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Four Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <Card key={idx} variant="default" padding="lg" className="border-forest-100 hover:border-forest-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-forest-100 text-forest-900 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-ink">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-telugu text-forest-800 font-semibold">
                    {pillar.titleTe}
                  </p>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    {language === 'te' ? pillar.descriptionTe : pillar.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Comparison: Typical App vs. Aarogya Drishti */}
      <Card 
        title="Why Assisted Access Works for Tribal Communities" 
        titleTe="గిరిజన ప్రాంతాల్లో సహాయక సేవల విశిష్టత"
        subtitle="Comparing standard hospital apps with Aarogya Drishti's frontline-first approach"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-forest-100 text-xs text-ink-muted uppercase font-mono">
                <th className="pb-3 font-semibold">Healthcare Requirement</th>
                <th className="pb-3 font-semibold text-rose-700">Standard Healthcare Portals</th>
                <th className="pb-3 font-semibold text-forest-900">Aarogya Drishti Assisted Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100 text-xs sm:text-sm">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-forest-50/50">
                  <td className="py-3.5 font-bold text-ink">
                    <span>{row.feature}</span>
                    <span className="block text-[11px] font-telugu text-forest-800 font-normal">{row.featureTe}</span>
                  </td>
                  <td className="py-3.5 text-rose-800 bg-rose-50/30 px-3 rounded-lg font-medium">
                    {row.standard}
                  </td>
                  <td className="py-3.5 text-forest-950 bg-forest-50/60 px-3 rounded-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{row.aarogya}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Emergency Assistance Strip */}
      <Card variant="flat" padding="md" className="border-forest-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-ink flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-forest-800" />
              <span>Need Assistance in Alluri Sitharama Raju District?</span>
            </h4>
            <p className="text-xs text-ink-muted">
              Call toll-free healthcare helplines 24/7 or contact ITDA Paderu Tribal Health Coordination Desk.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-forest-100 text-forest-900 font-mono text-xs font-bold">
              Health Info: 104
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-900 font-mono text-xs font-bold">
              Ambulance: 108
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-900 font-mono text-xs font-bold">
              ITDA Desk: 08935-250000
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
