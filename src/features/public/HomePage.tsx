import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Stethoscope,
  Building2,
  Ban,
  Apple,
  Award,
  Sparkles,
  PhoneCall,
  CalendarCheck
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { FAQAccordion, type FAQItem } from '../../components/common/FAQAccordion';
import { useTranslation } from '../../i18n';

export const HomePage: React.FC = () => {
  const { language, t } = useTranslation();

  // Existing approved community FAQs
  const homeFaqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'Do I need a smartphone, mobile phone number, or internet to be screened?',
      questionTe: 'స్క్రీనింగ్ కోసం నాకు స్మార్ట్‌ఫోన్, మొబైల్ నంబర్ లేదా ఇంటర్నెట్ అవసరమా?',
      answer: 'No. You do not need any digital device, phone number, email, or OTP. The authorized Community Health Worker (ASHA / ANM) visits your village, registers you through assisted access, and provides you with a physical AAROGYA DRISHTI Health Card.',
      answerTe: 'అవసరం లేదు. మీకు స్మార్ట్‌ఫోన్, ఫోన్ నంబర్ లేదా ఇంటర్నెట్ లేకపోయినా మీ గ్రామ ఆశా కార్యకర్త మీ వివరాలను స్వయంగా నమోదు చేసి మీకు ఉచిత హెల్త్ కార్డును అందిస్తారు.',
    },
    {
      id: 'faq-2',
      question: 'Is the oral screening and hospital referral completely free?',
      questionTe: 'ఈ నోటి పరీక్ష మరియు ఆసుపత్రి రిఫరల్ పూర్తిగా ఉచితమా?',
      answer: 'Yes. All community screenings, frontline photography, medical officer reviews, and public hospital consultations under the ITDA Paderu healthcare program are 100% free of charge for community members.',
      answerTe: 'అవును. ఐటీడీఏ పాడేరు ఆధ్వర్యంలో జరిగే స్క్రీనింగ్, డాక్టర్ల పరిశీలన మరియు ప్రభుత్వ ఆసుపత్రి సేవలు ప్రజలందరికీ పూర్తిగా ఉచితం.',
    },
    {
      id: 'faq-3',
      question: 'Does an acceptable image quality result mean my mouth is healthy?',
      questionTe: 'ఫోటో నాణ్యత బాగుంది (Acceptable) అంటే నోరు ఆరోగ్యంగా ఉందని అర్థమా?',
      answer: 'No. An "Acceptable" image status means only that the photograph is clear, in focus, well-lit, and suitable for the doctor to examine. It does NOT mean that the mouth is healthy. Only the Medical Officer after reviewing the case can determine if there are abnormalities.',
      answerTe: 'కాదు. ఫోటో స్పష్టంగా ఉంది అంటే డాక్టర్ పరిశీలనకు అనుకూలంగా ఉందని మాత్రమే అర్థం. మీ నోరు ఆరోగ్యంగా ఉందో లేదో వైద్యుని పరీక్ష తర్వాతే తెలుస్తుంది.',
    },
    {
      id: 'faq-4',
      question: 'Does the AI computer system diagnose oral cancer?',
      questionTe: 'కంప్యూటర్ లేదా ఏఐ (AI) నేరుగా క్యాన్సర్‌ను నిర్ధారిస్తుందా?',
      answer: 'Never. The AI pipeline is strictly an experimental research demonstration tool. It CANNOT diagnose cancer, CANNOT rule out disease, and CANNOT give reassurance. Only a qualified human doctor reviews the images and signs the clinical assessment.',
      answerTe: 'ఎట్టి పరిస్థితుల్లోనూ లేదు. ఏఐ కేవలం ఒక పరిశోధన సహాయక సాధనం మాత్రమే. ఇది క్యాన్సర్‌ను నిర్ధారించలేదు. కేవలం నిపుణులైన ప్రభుత్వ వైద్యులు మాత్రమే ప్రత్యక్షంగా పరిశీలించి నిర్ణయం తీసుకుంటారు.',
    },
    {
      id: 'faq-5',
      question: 'Are mouth ulcers always cancerous?',
      questionTe: 'నోటి పుండ్లు అన్నీ క్యాన్సరేనా?',
      answer: 'No. Most mouth ulcers are benign (canker sores, nutritional deficiencies, or trauma from sharp teeth) and heal within 10 to 14 days. However, any ulcer that persists beyond 2 to 3 weeks without healing must be clinically examined to rule out precancerous changes.',
      answerTe: 'కాదు. చాలా నోటి పుండ్లు సాధారణమైనవి మరియు 10-14 రోజుల్లో వాటంతట అవే తగ్గుతాయి. కానీ 2-3 వారాలకు మించి మానని పుండ్లను మాత్రమే డాక్టర్ వద్ద పరీక్షించుకోవాలి.',
    },
    {
      id: 'faq-6',
      question: 'What happens if someone scans the QR code on my Physical Health Card?',
      questionTe: 'నా హెల్త్ కార్డుపై ఉన్న క్యూఆర్ (QR) కోడ్‌ను ఎవరైనా స్కాన్ చేస్తే వివరాలు కనిపిస్తాయా?',
      answer: 'No medical information will be visible. The QR code contains only an opaque reference token (e.g. ASR-2026-0842). Scanning with a regular smartphone camera reveals no health records. Only hospital staff logged into AAROGYA DRISHTI can retrieve the case.',
      answerTe: 'ఏ వివరాలూ కనిపించవు. క్యూఆర్ కోడ్‌లో ఎటువంటి ఆరోగ్య సమాచారం ఉండదు. సాధారణ ఫోన్లతో స్కాన్ చేస్తే ఏమీ కనిపించదు; కేవలం సిబ్బంది లాగిన్ అయినప్పుడు మాత్రమే వివరాలు లభిస్తాయి.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* ============================================================ */}
      {/* SECTION B: CLINICAL HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-white via-[#F7F8F5] to-[#E7F2EF]/30 border-b border-[#B6CFC4]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Headlines, Context, Actions */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F2EF] border border-[#B6CFC4]/60 text-[#064B40] text-xs font-bold uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {language === 'te' 
                    ? 'సమాజ నోటి ఆరోగ్యం • అల్లూరి జిల్లా పైలట్' 
                    : 'Frontline Community Healthcare • ASR District Pilot'}
                </span>
              </div>

              {/* Title & Telugu Bilingual Tagline */}
              <div className="space-y-2.5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#064B40] tracking-tight leading-[1.12]">
                  {language === 'te' 
                    ? 'ప్రతి చిరునవ్వుకు ఆరోగ్య సంరక్షణ అవసరం' 
                    : t('tagline')}
                </h1>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold font-telugu text-[#075E4E] tracking-tight leading-tight">
                  {language === 'te' 
                    ? 'Every Smile Deserves Timely Care • ITDA Paderu' 
                    : t('taglineTe')}
                </h2>
              </div>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-[#5F736C] leading-relaxed max-w-2xl font-normal">
                {t('heroSupporting')}
              </p>

              {/* Real Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/oral-health" className="no-underline">
                  <Button variant="primary" size="lg" icon={Heart}>
                    {t('heroCtaLearn')}
                  </Button>
                </Link>

                <Link to="/facilities" className="no-underline">
                  <Button variant="secondary" size="lg" icon={MapPin}>
                    {t('heroCtaFind')}
                  </Button>
                </Link>

                <Link to="/login" className="no-underline">
                  <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
                    {t('heroCtaLogin')}
                  </Button>
                </Link>
              </div>

              {/* Frontline Assisted Care Guarantees */}
              <div className="pt-6 border-t border-[#B6CFC4]/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#B6CFC4]/40 shadow-sm">
                  <div className="p-2 rounded-xl bg-[#E7F2EF] text-[#075E4E] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#064B40] block">
                      {language === 'te' ? 'స్మార్ట్‌ఫోన్ అవసరం లేదు' : 'No Smartphone Required'}
                    </span>
                    <span className="text-xs text-[#5F736C]">
                      {language === 'te' 
                        ? 'మీ గ్రామ ఆశా కార్యకర్త ద్వారా ఉచిత సేవలు అందుతాయి.' 
                        : 'Care reaches you through your village ASHA worker.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#B6CFC4]/40 shadow-sm">
                  <div className="p-2 rounded-xl bg-[#E7F2EF] text-[#075E4E] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#064B40] block">
                      {language === 'te' ? 'వైద్యుల ప్రత్యక్ష పరిశీలన' : 'Doctor-Signed Reviews'}
                    </span>
                    <span className="text-xs text-[#5F736C]">
                      {language === 'te' 
                        ? 'ప్రతి కేసుకు నిపుణులైన డాక్టర్ల స్వతంత్ర పరీక్ష.' 
                        : 'Independent clinical evaluation for every patient.'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Frontline Community Health Showcase Container */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative Subtle Shadow Backing */}
                <div className="absolute -inset-3 bg-[#075E4E]/10 rounded-3xl blur-xl transform -rotate-1 pointer-events-none" />

                {/* Main Hero Showcase Card */}
                <div 
                  className="relative rounded-3xl overflow-hidden shadow-[0_10px_35px_-4px_rgba(7,94,78,0.14)] border-2 border-white bg-white group transition-transform duration-300 hover:scale-[1.01]"
                >
                  <img
                    src="/images/rural_health_hero.jpg"
                    alt="Community Health Worker conducting doorstep oral screening in ASR district"
                    className="w-full h-[360px] sm:h-[440px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Subtle Vignette & Frontline Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#064B40]/90 via-[#064B40]/30 to-black/20 flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <span
                        className="px-3.5 py-1.5 rounded-full bg-white/25 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider font-mono border border-white/40 shadow-sm"
                      >
                        {language === 'te' ? 'క్షేత్రస్థాయి ఆరోగ్య సేవలు' : 'Frontline Community Health'}
                      </span>
                    </div>

                    {/* Caption Note */}
                    <div className="text-white space-y-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300 font-mono block">
                        {language === 'te' ? 'అల్లూరి సీతారామరాజు జిల్లా' : 'ASR Tribal Agency District'}
                      </span>
                      <p className="text-sm font-semibold leading-snug">
                        {language === 'te'
                          ? 'జి. మాడుగులలో ఇంటింటికీ నోటి పరీక్ష, 5-కోణాల ఫోటోగ్రఫీ మరియు వైద్యాధికారి పరిశీలన.'
                          : 'Doorstep oral screening, 5-view photography & PHC doctor review in G. Madugula.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Micro-Card: Physical Health Card Guarantee */}
                <div className="absolute -bottom-6 -left-3 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-[0_8px_30px_-4px_rgba(7,94,78,0.12)] border border-[#B6CFC4]/60 max-w-[260px]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#064B40] text-white shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#064B40] block">
                        {language === 'te' ? 'భౌతిక హెల్త్ కార్డు' : 'Physical Health Card'}
                      </span>
                      <span className="text-[11px] text-[#5F736C] block font-telugu">
                        {language === 'te' ? 'కార్డు ద్వారా ఉచిత వైద్య సహాయం' : 'Free care through physical card'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* SECTION C: MAIN HEALTHCARE SERVICES (4 CLEAN SUSPIRE CARDS) */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] border border-[#B6CFC4]/50 px-3.5 py-1.5 rounded-full font-mono">
            {language === 'te' ? 'ప్రభుత్వ ఆరోగ్య స్తంభాలు • ఐటీడీఏ పాడేరు' : 'Core Healthcare Pillars • ITDA Paderu'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#064B40] tracking-tight">
            {language === 'te' ? 'సాంకేతికత రోగి వద్దకు చేరాలి' : 'Technology Should Reach the Patient'}
          </h2>
          <p className="text-sm sm:text-base font-telugu text-[#075E4E] font-semibold">
            {language === 'te' 
              ? 'రోగి సాంకేతికత కోసం వెతకాల్సిన అవసరం ఉండకూడదు. మానవీయ సంరక్షణే మా లక్ష్యం.' 
              : 'సాంకేతికత రోగి వద్దకు చేరాలి; రోగి సాంకేతికత కోసం వెతకాల్సిన అవసరం ఉండకూడదు.'}
          </p>
          <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed max-w-2xl mx-auto">
            {language === 'te'
              ? 'ఏజెన్సీ ప్రాంతాల్లో ఆరోగ్య సంరక్షణ ఆశా కార్యకర్తలు, భౌతిక హెల్త్ కార్డులు మరియు దయగల ప్రభుత్వ వైద్యుల సహకారంతో రూపొందించబడింది.'
              : 'Healthcare in tribal valleys is designed around human frontline workers, durable physical cards, and compassionate medical officers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Service 1: Doorstep Assisted Access */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] hover:shadow-[0_12px_32px_rgba(7,94,78,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] px-2.5 py-1 rounded-full font-mono">
                  {language === 'te' ? 'ఇంటి వద్దకే' : 'Doorstep Care'}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#064B40]">
                  {language === 'te' ? 'గ్రామీణ నోటి స్క్రీనింగ్' : 'Assisted Doorstep Screening'}
                </h3>
                <p className="text-xs font-telugu text-[#075E4E] font-medium">
                  {language === 'te' ? 'ఆశా కార్యకర్తల ద్వారా సేవలు' : 'Field screening by ASHA workers'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'స్మార్ట్‌ఫోన్, ఫోన్ నంబర్ లేదా ఇంటర్నెట్ లేకపోయినా ఆశా కార్యకర్త ఇంటికే వచ్చి పరీక్షించి వివరాలను నమోదు చేస్తారు.'
                  : 'No patient is excluded due to lack of a smartphone, phone number, OTP, or English literacy. Registration is assisted in person by frontline staff.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#B6CFC4]/30">
              <Link to="/oral-health" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075E4E] hover:text-[#064B40] no-underline group-hover:gap-2 transition-all">
                <span>{language === 'te' ? 'స్క్రీనింగ్ మార్గదర్శకాలు' : 'Screening Guidelines'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Service 2: Physical Health Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] hover:shadow-[0_12px_32px_rgba(7,94,78,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] px-2.5 py-1 rounded-full font-mono">
                  {language === 'te' ? 'గోప్యమైనది' : 'Privacy-First'}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#064B40]">
                  {language === 'te' ? 'భద్రమైన భౌతిక కార్డు' : 'Physical Health Card'}
                </h3>
                <p className="text-xs font-telugu text-[#075E4E] font-medium">
                  {language === 'te' ? 'సురక్షితమైన టోకెన్ కార్డ్' : 'Durable token-based health card'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'కార్డుపై ఉన్న క్యూఆర్ కోడ్‌లో ఎటువంటి సున్నితమైన ఆరోగ్య వివరాలూ ఉండవు. సాధారణ ఫోన్లతో స్కాన్ చేస్తే ఏమీ కనిపించదు.'
                  : 'Durable patient card with an opaque reference QR code. Scanning reveals zero medical data unless authorized hospital staff logs in.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#B6CFC4]/30">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075E4E] hover:text-[#064B40] no-underline group-hover:gap-2 transition-all">
                <span>{language === 'te' ? 'సిటిజన్ & ఫ్యామిలీ పోర్టల్' : 'Citizen & Family Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Service 3: Doctor Independent Review */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] hover:shadow-[0_12px_32px_rgba(7,94,78,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] px-2.5 py-1 rounded-full font-mono">
                  {language === 'te' ? 'వైద్యుల సంతకం' : 'Doctor-Signed'}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#064B40]">
                  {language === 'te' ? 'వైద్యుల స్వతంత్ర పరీక్ష' : 'Doctor Independent Review'}
                </h3>
                <p className="text-xs font-telugu text-[#075E4E] font-medium">
                  {language === 'te' ? 'పీహెచ్‌సీ వైద్యాధికారుల పరిశీలన' : 'Clinical evaluation by PHC doctors'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'ఏఐ కేవలం ఒక పరిశోధన సాధనం మాత్రమే. అర్హత కలిగిన ప్రభుత్వ వైద్యులు మాత్రమే ఫోటోలను పరిశీలించి తుది నిర్ణయం తీసుకుంటారు.'
                  : 'AI models are strictly non-clinical assistive demonstrations. Only qualified Medical Officers review high-definition photos and sign clinical assessments.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#B6CFC4]/30">
              <Link to="/facilities" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075E4E] hover:text-[#064B40] no-underline group-hover:gap-2 transition-all">
                <span>{language === 'te' ? 'ప్రాథమిక ఆరోగ్య కేంద్రాలు' : 'Participating Clinics'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Service 4: Hospital Linkage */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] hover:shadow-[0_12px_32px_rgba(7,94,78,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] px-2.5 py-1 rounded-full font-mono">
                  {language === 'te' ? 'ఆసుపత్రి నెట్‌వర్క్' : 'District Care'}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#064B40]">
                  {language === 'te' ? 'ఆసుపత్రి రిఫరల్ మరియు పర్యవేక్షణ' : 'Hospital Referral Linkage'}
                </h3>
                <p className="text-xs font-telugu text-[#075E4E] font-medium">
                  {language === 'te' ? 'పాడేరు జిల్లా ఆసుపత్రి & కేజీహెచ్' : 'Specialist tele-triage linkage'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'ప్రాథమిక ఆరోగ్య కేంద్రాల నుండి పాడేరు జిల్లా ఆసుపత్రి మరియు కేజీహెచ్ విశాఖపట్నంకు ప్రత్యక్ష రిఫరల్ మరియు బయాప్సీ ట్రాకింగ్.'
                  : 'Direct referral connection from Primary Health Centres to District Hospital Paderu and King George Hospital (KGH) Visakhapatnam with biopsy tracking.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#B6CFC4]/30">
              <Link to="/facilities" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075E4E] hover:text-[#064B40] no-underline group-hover:gap-2 transition-all">
                <span>{language === 'te' ? 'ప్రభుత్వ ఆసుపత్రుల వివరాలు' : 'Hospital Directory'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* SECTION D: HOW IT WORKS (5-STEP VISUAL CARE CONTINUUM) */}
      {/* ============================================================ */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#064B40] text-white p-8 sm:p-14 shadow-2xl border border-emerald-900/40 relative overflow-hidden">
          
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#075E4E]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-14 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15">
              {language === 'te' ? 'సంరక్షణ మార్గం • నిరంతర సేవలు' : 'Care Continuum • 5-Step Assisted Pathway'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {language === 'te' ? 'ఆరోగ్య దృష్టి ఎలా పనిచేస్తుంది?' : 'How AAROGYA DRISHTI Works'}
            </h2>
            <p className="text-sm sm:text-base font-telugu text-emerald-100 font-medium">
              {language === 'te' 
                ? 'గ్రామం నుండి ఆసుపత్రి వరకు 5 దశల నిరంతర ప్రభుత్వ ఆరోగ్య సేవలు' 
                : 'From Remote Village Examination to Specialist Hospital Recovery'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            
            {/* Step 1 */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#064B40] font-black flex items-center justify-center text-lg shadow-md">
                1
              </div>
              <h4 className="font-bold text-base text-white">
                {language === 'te' ? 'గ్రామ సందర్శన' : 'Village Visit'}
              </h4>
              <p className="text-xs text-emerald-300 font-telugu font-semibold">
                {language === 'te' ? 'ఇంటింటికీ నమోదు' : 'Assisted Registration'}
              </p>
              <p className="text-xs text-white/80 leading-relaxed">
                {language === 'te'
                  ? 'ఆశా కార్యకర్త గిరిజన ప్రాంతాల్లో ఇంటికే వస్తారు. స్మార్ట్‌ఫోన్ లేదా ఫోన్ నంబర్ అవసరం లేకుండా రోగి వివరాలు నమోదవుతాయి.'
                  : 'Health worker visits homes in tribal habitations. Patient is registered without needing a smartphone or phone number.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#064B40] font-black flex items-center justify-center text-lg shadow-md">
                2
              </div>
              <h4 className="font-bold text-base text-white">
                {language === 'te' ? 'నోటి ఫోటోల సేకరణ' : 'Guided Oral Photos'}
              </h4>
              <p className="text-xs text-emerald-300 font-telugu font-semibold">
                {language === 'te' ? '5 ప్రామాణిక కోణాలు' : '5 Standardized Views'}
              </p>
              <p className="text-xs text-white/80 leading-relaxed">
                {language === 'te'
                  ? 'రోగి సమ్మతి తీసుకుని, నాణ్యతా పరీక్షలతో 5 ప్రామాణిక నోటి కోణాల ఫోటోలను సురక్షితంగా రికార్డ్ చేస్తారు.'
                  : 'Consent is recorded. 5 standardized oral views are captured with on-device blur and lighting clarity checks.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#064B40] font-black flex items-center justify-center text-lg shadow-md">
                3
              </div>
              <h4 className="font-bold text-base text-white">
                {language === 'te' ? 'వైద్యుల పరిశీలన' : 'Doctor Review'}
              </h4>
              <p className="text-xs text-emerald-300 font-telugu font-semibold">
                {language === 'te' ? 'స్వతంత్ర నిర్ధారణ' : 'Independent Clinical Triage'}
              </p>
              <p className="text-xs text-white/80 leading-relaxed">
                {language === 'te'
                  ? 'పీహెచ్‌సీ వైద్యాధికారి ఫోటోలను, రోగి లక్షణాలను స్వయంగా పరిశీలించి క్లినికల్ సిఫార్సును సంతకం చేస్తారు.'
                  : 'Medical Officer independently evaluates photos, clinical history, and signs the clinical recommendation.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#064B40] font-black flex items-center justify-center text-lg shadow-md">
                4
              </div>
              <h4 className="font-bold text-base text-white">
                {language === 'te' ? 'ఆసుపత్రి కేర్' : 'Hospital Care'}
              </h4>
              <p className="text-xs text-emerald-300 font-telugu font-semibold">
                {language === 'te' ? 'స్పెషలిస్ట్ రిఫరల్' : 'Referral & Biopsy'}
              </p>
              <p className="text-xs text-white/80 leading-relaxed">
                {language === 'te'
                  ? 'అవసరమైన రోగులకు పాడేరు జిల్లా ఆసుపత్రి లేదా కేజీహెచ్‌లో నిపుణుల అపాయింట్‌మెంట్ మరియు బయాప్సీ కేటాయిస్తారు.'
                  : 'Specialist appointment is booked at District Hospital Paderu or KGH Visakhapatnam with biopsy tracking.'}
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#064B40] font-black flex items-center justify-center text-lg shadow-md">
                5
              </div>
              <h4 className="font-bold text-base text-white">
                {language === 'te' ? 'తదుపరి పర్యవేక్షణ' : 'Patient Navigation'}
              </h4>
              <p className="text-xs text-emerald-300 font-telugu font-semibold">
                {language === 'te' ? 'నిరంతర సంరక్షణ' : 'Follow-Up & Healing'}
              </p>
              <p className="text-xs text-white/80 leading-relaxed">
                {language === 'te'
                  ? 'పేషెంట్ నావిగేటర్లు మరియు ఆశా కార్యకర్తలు రోగి కోలుకునే వరకు స్వయంగా పర్యవేక్షిస్తారు.'
                  : 'Patient navigators and ASHA workers follow up in person so no patient is lost in the care journey.'}
              </p>
            </div>

          </div>

          <div className="mt-12 text-center relative z-10">
            <Link to="/how-it-works" className="no-underline">
              <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
                {language === 'te' ? 'పూర్తి 5 దశల మార్గాన్ని చూడండి' : 'View Detailed Step-by-Step Pathway'}
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* SECTION E: ORAL HEALTH AWARENESS & EARLY WARNING SIGNS */}
      {/* ============================================================ */}
      <section id="oral-health" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Anatomy & Self-Checkup Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Diagram */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white p-5 sm:p-6 border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] group">
              <img
                src="/images/oral_anatomy_guide.jpg"
                alt="Diagram showing anatomy of the human mouth and oral cavity"
                loading="lazy"
                className="w-full h-auto rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="mt-4 pt-3 border-t border-[#B6CFC4]/30 flex items-center justify-between text-xs text-[#5F736C]">
                <span className="font-semibold text-[#064B40]">
                  {language === 'te' ? '7-ప్రాంతాల నోటి మ్యాప్' : 'Standardized 7-Zone Oral Map'}
                </span>
                <Link to="/oral-health" className="text-[#075E4E] font-bold hover:underline no-underline inline-flex items-center gap-1">
                  <span>{language === 'te' ? 'మొత్తం గైడ్ చూడండి' : 'Full Guide & Anatomy'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Explanation */}
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] border border-[#B6CFC4]/50 px-3.5 py-1.5 rounded-full font-mono">
              {language === 'te' ? 'నోటి ఆరోగ్య విద్య • అవగాహన' : 'Oral Health Education • Awareness'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#064B40] tracking-tight">
              {language === 'te' ? 'మీ నోటిని స్వయంగా పరీక్షించుకోండి' : 'Check Your Mouth: The 7 Vital Zones'}
            </h2>
            <p className="text-sm font-telugu text-[#075E4E] font-semibold">
              {language === 'te' 
                ? 'ముఖ్యమైన 7 భాగాల్లో మార్పులను సకాలంలో గుర్తించండి' 
                : 'Early mucosal changes are often painless; regular self-checks help spot issues early.'}
            </p>
            <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
              {language === 'te'
                ? 'బుగ్గ లోపలి పొర, నాలుక అడుగు భాగం లేదా అంగిలిపై వచ్చే మార్పులను ప్రాథమిక దశలోనే గుర్తిస్తే 85% నోటి సమస్యలను మరియు క్యాన్సర్‌ను నివారించవచ్చు.'
                : 'Early mucosal changes often occur in hard-to-see areas like the inner cheek lining, under the tongue, or on the palate. Knowing what is normal helps recognize persistent ulcers, red or white patches early.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm hover:border-[#075E4E]/40 transition-colors">
                <span className="font-bold text-xs text-[#064B40] block">1. Inner Cheeks</span>
                <span className="text-[11px] font-telugu text-[#5F736C]">బుగ్గ లోపలి భాగం (Buccal)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm hover:border-[#075E4E]/40 transition-colors">
                <span className="font-bold text-xs text-[#064B40] block">2. Tongue & Borders</span>
                <span className="text-[11px] font-telugu text-[#5F736C]">నాలుక మరియు అంచులు</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm hover:border-[#075E4E]/40 transition-colors">
                <span className="font-bold text-xs text-[#064B40] block">3. Floor of Mouth</span>
                <span className="text-[11px] font-telugu text-[#5F736C]">నోటి అడుగు భాగం</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm hover:border-[#075E4E]/40 transition-colors">
                <span className="font-bold text-xs text-[#064B40] block">4. Gums & Teeth</span>
                <span className="text-[11px] font-telugu text-[#5F736C]">చిగుళ్ళు మరియు పళ్ళు</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm hover:border-[#075E4E]/40 transition-colors">
                <span className="font-bold text-xs text-[#064B40] block">5. Roof / Palate</span>
                <span className="text-[11px] font-telugu text-[#5F736C]">అంగిలి (పైకప్పు)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm hover:border-[#075E4E]/40 transition-colors">
                <span className="font-bold text-xs text-[#064B40] block">6. Lips & Labial</span>
                <span className="text-[11px] font-telugu text-[#5F736C]">పెదవులు మరియు లోపలి భాగం</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/oral-health" className="no-underline">
                <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                  {language === 'te' ? 'పూర్తి నోటి అనాటమీ గైడ్ చూడండి' : 'View Full Oral Anatomy Education Guide'}
                </Button>
              </Link>
            </div>
          </div>

        </div>

        {/* Warning Signs & Red Flags Cards (Suspire Clinical Alerts) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/50 border border-amber-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full font-mono">
                {language === 'te' ? 'ముందస్తు హెచ్చరిక సంకేతాలు' : 'Early Warning Signs (Red Flags)'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#064B40]">
                {language === 'te' ? 'ఈ లక్షణాలు కనిపిస్తే వెంటనే వైద్యుడిని సంప్రదించండి' : 'When to Seek Immediate Clinical Review'}
              </h3>
            </div>
            <Link to="/cancer-awareness" className="no-underline shrink-0">
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                {language === 'te' ? 'అవగాహన గైడ్' : 'Learn Precancer Signs'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                !
              </div>
              <h4 className="font-bold text-sm text-[#064B40]">
                {language === 'te' ? 'మానని నోటి పుండ్లు (>2-3 వారాలు)' : 'Persistent Mouth Ulcers (>2-3 Weeks)'}
              </h4>
              <p className="text-xs text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'చాలా పుండ్లు 10-14 రోజుల్లో తగ్గుతాయి. 2-3 వారాలు దాటినా మానని పుండ్లను తప్పనిసరిగా డాక్టర్ పరిశీలించాలి.'
                  : 'Most mouth ulcers heal within 10-14 days. Any non-healing ulcer persisting past 3 weeks requires prompt clinical examination.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                !
              </div>
              <h4 className="font-bold text-sm text-[#064B40]">
                {language === 'te' ? 'తెల్లటి లేదా ఎర్రటి మచ్చలు' : 'White or Red Mucosal Patches'}
              </h4>
              <p className="text-xs text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'తుడిచినా పోని తెల్లటి (ల్యూకోప్లాకియా) లేదా ఎర్రటి (ఎరిత్రోప్లాకియా) మచ్చలు ఉంటే వెంటనే పరీక్షించుకోవాలి.'
                  : 'Non-scrapable white (leukoplakia) or velvety red (erythroplakia) patches inside the cheeks or tongue must be evaluated.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                !
              </div>
              <h4 className="font-bold text-sm text-[#064B40]">
                {language === 'te' ? 'నోరు తెరవడంలో ఇబ్బంది & మంట' : 'Restricted Opening & Burning (OSMF)'}
              </h4>
              <p className="text-xs text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'నోటిలో 3 వేళ్ళు పట్టకపోవడం లేదా కారమైన ఆహారం తిన్నప్పుడు తీవ్రమైన మంట కలగడం ఫైబ్రోసిస్ లక్షణం కావచ్చు.'
                  : 'Inability to open 3 fingers vertically or burning sensation when eating normal spicy food indicates oral submucous fibrosis.'}
              </p>
            </div>

          </div>
        </div>

      </section>


      {/* ============================================================ */}
      {/* SECTION F: HEALTHY EVERYDAY HABITS & PREVENTION */}
      {/* ============================================================ */}
      <section id="healthy-habits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] border border-[#B6CFC4]/50 px-3.5 py-1.5 rounded-full font-mono">
            {language === 'te' ? 'నివారణ & రోజువారీ సంరక్షణ • మంచి అలవాట్లు' : 'Prevention & Daily Care • Healthy Habits'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#064B40] tracking-tight">
            {language === 'te' ? 'జీవితాంతం చిరునవ్వు కోసం ఆరోగ్యకరమైన అలవాట్లు' : 'Healthy Habits for a Lifelong Smile'}
          </h2>
          <p className="text-sm font-telugu text-[#075E4E] font-semibold">
            {language === 'te' 
              ? 'ఆరోగ్యకరమైన అలవాట్లతో నోటి క్యాన్సర్ ప్రమాదాన్ని 85% నివారించవచ్చు' 
              : 'Over 85% of oral precancerous lesions can be prevented with simple habit changes.'}
          </p>
          <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed max-w-2xl mx-auto">
            {language === 'te'
              ? 'పొగాకు, గుట్కా మరియు పోకచెక్కకు దూరంగా ఉండటం మరియు పోషకాహారం తీసుకోవడం ద్వారా మీ నోటి ఆరోగ్యాన్ని సంపూర్ణంగా కాపాడుకోవచ్చు.'
              : 'Over 85% of oral potentially malignant lesions and cancers can be prevented by adopting healthy everyday habits and breaking free from tobacco and areca nut.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Habit 1 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] hover:shadow-[0_12px_32px_rgba(7,94,78,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Ban className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#064B40]">
                  {language === 'te' ? 'గుట్కా, ఖైనీ మానుకోండి' : 'Quit Chewing Gutkha'}
                </h3>
                <p className="text-xs font-telugu text-[#075E4E] font-semibold">
                  {language === 'te' ? 'తంబాకు వల్ల తీవ్ర రసాయన గాయాలు' : 'Toxic chemical mucosal burns'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'బుగ్గ లోపల తంబాకు, సున్నం ఉంచడం వల్ల కణజాలం కాలిపోయి నేరుగా ల్యూకోప్లాకియా మరియు క్యాన్సర్‌కు దారితీస్తుంది.'
                  : 'Holding tobacco and lime against cheek tissues causes chemical burns leading directly to leukoplakia and oral cancer.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#B6CFC4]/30">
              <span className="text-xs font-bold text-amber-800">
                {language === 'te' ? 'ప్రమాదకర అలవాటు' : 'High Harm Habit'}
              </span>
            </div>
          </div>

          {/* Habit 2 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] hover:shadow-[0_12px_32px_rgba(7,94,78,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Ban className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#064B40]">
                  {language === 'te' ? 'రివర్స్ స్మోకింగ్ ఆపండి' : 'Stop Reverse Smoking'}
                </h3>
                <p className="text-xs font-telugu text-[#075E4E] font-semibold">
                  {language === 'te' ? 'చుట్ట వెలిగించిన కొన నోట్లో పెట్టకండి' : 'Extremely high palatal heat'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'చుట్ట వెలిగించిన కొనను నోటి లోపల ఉంచి పీల్చడం వల్ల 100°C మించిన వేడితో అంగిలి కాలి తీవ్ర నష్టం జరుగుతుంది.'
                  : 'Smoking chutta with the lighted end inside produces heat exceeding 100°C, causing palatal keratosis and severe damage.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#B6CFC4]/30">
              <span className="text-xs font-bold text-amber-800">
                {language === 'te' ? 'తీవ్ర హానికరమైనది' : 'Severe Palatal Burn'}
              </span>
            </div>
          </div>

          {/* Habit 3 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] hover:shadow-[0_12px_32px_rgba(7,94,78,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Ban className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#064B40]">
                  {language === 'te' ? 'పోకచెక్క, సుపారీ వద్దు' : 'Say No to Areca Nut'}
                </h3>
                <p className="text-xs font-telugu text-[#075E4E] font-semibold">
                  {language === 'te' ? 'నోరు బిగుసుకుపోయే ప్రమాదం (OSMF)' : 'Causes tissue stiffening & OSMF'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'పోకచెక్క ఆల్కలాయిడ్లు బుగ్గల కణజాలాన్ని గట్టిపరిచి, నోరు తెరవలేని పరిస్థితికి (ఫైబ్రోసిస్) కారణమవుతాయి.'
                  : 'Areca nut alkaloids scar cheek collagen, causing Oral Submucous Fibrosis (OSMF) and restricted mouth opening.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#B6CFC4]/30">
              <span className="text-xs font-bold text-amber-800">
                {language === 'te' ? 'ఫైబ్రోసిస్ నివారణ' : 'Fibrosis Prevention'}
              </span>
            </div>
          </div>

          {/* Habit 4 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#B6CFC4]/60 shadow-[0_4px_24px_rgba(7,94,78,0.06)] hover:shadow-[0_12px_32px_rgba(7,94,78,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center border border-[#B6CFC4]/50">
                <Apple className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#064B40]">
                  {language === 'te' ? 'తాజా ఆకుకూరలు & నీరు' : 'Nutritious Diet & Water'}
                </h3>
                <p className="text-xs font-telugu text-[#075E4E] font-semibold">
                  {language === 'te' ? 'సహజ యాంటీఆక్సిడెంట్లు' : 'Antioxidants & saliva flow'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'స్థానిక ఆకుకూరలు, ఉసిరి మరియు తగినంత మంచి నీరు తాగడం ద్వారా నోటి కణజాలం రక్షించబడుతుంది.'
                  : 'Local greens, amla, and drinking clean water protect oral mucosa with essential antioxidants and saliva flow.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#B6CFC4]/30">
              <span className="text-xs font-bold text-[#075E4E]">
                {language === 'te' ? 'రక్షణ అలవాటు' : 'Protective Habit'}
              </span>
            </div>
          </div>

        </div>

        <div className="mt-10 text-center">
          <Link to="/healthy-habits" className="no-underline">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
              {language === 'te' ? 'పూర్తి ఆరోగ్యకర అలవాట్ల గైడ్ చూడండి' : 'Explore Full Healthy Habits & Prevention Guide'}
            </Button>
          </Link>
        </div>
      </section>


      {/* ============================================================ */}
      {/* SECTION G: DOCTOR AND HEALTHCARE SUPPORT (REAL CLINICAL DATA) */}
      {/* ============================================================ */}
      <section id="healthcare-support" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-[#B6CFC4]/60 p-8 sm:p-12 shadow-[0_4px_24px_rgba(7,94,78,0.06)] space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#B6CFC4]/30 pb-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] border border-[#B6CFC4]/50 px-3.5 py-1.5 rounded-full font-mono">
                {language === 'te' ? 'వైద్యుల బృందం • అధికారిక సేవలు' : 'Clinical Leadership • Medical Network'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#064B40] tracking-tight">
                {language === 'te' ? 'అర్హత కలిగిన ప్రభుత్వ వైద్యుల నెట్‌వర్క్' : 'Verified Doctors & Specialist Network'}
              </h2>
              <p className="text-sm font-telugu text-[#075E4E] font-semibold">
                {language === 'te' 
                  ? 'ప్రభుత్వ ఆసుపత్రులు మరియు ప్రాథమిక ఆరోగ్య కేంద్రాల్లో అనుభవజ్ఞులైన వైద్యులు' 
                  : 'Qualified Medical Officers and Specialists serving Alluri Sitharama Raju District.'}
              </p>
              <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
                {language === 'te'
                  ? 'ప్రతి కేసుకు అర్హత కలిగిన వైద్యులు స్వయంగా ఫోటోలను పరిశీలించి, క్లినికల్ సిఫార్సులను సంతకం చేస్తారు.'
                  : 'Qualified medical officers and specialists evaluate frontline photographs, review cardinal symptoms, and coordinate referral triage across Alluri Sitharama Raju district.'}
              </p>
            </div>

            <Link to="/facilities" className="no-underline shrink-0">
              <Button variant="primary" size="md" icon={MapPin}>
                {language === 'te' ? 'అన్ని 22 మండలాల క్లినిక్‌ల వివరాలు' : 'All 22 Mandals Clinics Directory'}
              </Button>
            </Link>
          </div>

          {/* 3 Real Verified Doctor / Coordinator Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Doctor 1: Dr. Suresh */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F7F8F5] border border-[#B6CFC4]/60 space-y-4 hover:border-[#075E4E]/50 hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center font-bold text-xl border border-[#B6CFC4]/50 shadow-sm">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#064B40] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-300 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 
                  {language === 'te' ? 'ధృవీకరించబడిన డాక్టర్' : 'Verified Doctor'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#064B40]">Dr. K. Suresh, MBBS</h3>
                <p className="text-xs text-[#075E4E] font-medium font-telugu">
                  {language === 'te' ? 'వైద్యాధికారి (ప్రాథమిక ఆరోగ్య కేంద్రం)' : 'Medical Officer (Primary Health Centre)'}
                </p>
                <p className="text-xs text-[#5F736C] mt-1 font-mono">APMC Reg: APMC/2018/04912</p>
              </div>

              <div className="pt-3 border-t border-[#B6CFC4]/30 space-y-2 text-xs text-[#5F736C]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#075E4E] shrink-0" />
                  <span>G. Madugula Primary Health Centre (PHC)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{language === 'te' ? 'భాషలు: తెలుగు, ఇంగ్లీష్' : 'Languages: Telugu, English'}</span>
                </div>
              </div>
            </div>

            {/* Doctor 2: Dr. Anand */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F7F8F5] border border-[#B6CFC4]/60 space-y-4 hover:border-[#075E4E]/50 hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center font-bold text-xl border border-[#B6CFC4]/50 shadow-sm">
                  <Award className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#064B40] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-300 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 
                  {language === 'te' ? 'స్పెషలిస్ట్ వైద్యులు' : 'Specialist'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#064B40]">Dr. M. Anand, MDS</h3>
                <p className="text-xs text-[#075E4E] font-medium font-telugu">
                  {language === 'te' ? 'స్పెషలిస్ట్ ఓరల్ ఆంకాలజిస్ట్' : 'Specialist Oral Oncologist'}
                </p>
                <p className="text-xs text-[#5F736C] mt-1 font-mono">Tertiary Oral Surgery & Biopsy</p>
              </div>

              <div className="pt-3 border-t border-[#B6CFC4]/30 space-y-2 text-xs text-[#5F736C]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#075E4E] shrink-0" />
                  <span>District Hospital, Paderu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{language === 'te' ? 'భాషలు: తెలుగు, ఇంగ్లీష్, హిందీ' : 'Languages: Telugu, English, Hindi'}</span>
                </div>
              </div>
            </div>

            {/* Coordinator: Rajesh Varma */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F7F8F5] border border-[#B6CFC4]/60 space-y-4 hover:border-[#075E4E]/50 hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center font-bold text-xl border border-[#B6CFC4]/50 shadow-sm">
                  <Users className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-blue-300 font-mono">
                  <CalendarCheck className="w-3 h-3 text-blue-700" /> 
                  {language === 'te' ? 'పేషెంట్ నావిగేటర్' : 'Patient Navigator'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#064B40]">Rajesh Varma</h3>
                <p className="text-xs text-[#075E4E] font-medium font-telugu">
                  {language === 'te' ? 'ఆసుపత్రి రిఫరల్ సమన్వయకర్త' : 'Hospital Referral Coordinator'}
                </p>
                <p className="text-xs text-[#5F736C] mt-1 font-mono">Referral & Navigation Desk</p>
              </div>

              <div className="pt-3 border-t border-[#B6CFC4]/30 space-y-2 text-xs text-[#5F736C]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#075E4E] shrink-0" />
                  <span>District Hospital Paderu / KGH Linkage</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{language === 'te' ? 'ప్రత్యక్ష రోగి సహాయ కేంద్రం' : 'In-Person Referral Guidance'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* SECTION H: FREQUENTLY ASKED QUESTIONS (ACCESSIBLE ACCORDION) */}
      {/* ============================================================ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] border border-[#B6CFC4]/50 px-3.5 py-1.5 rounded-full font-mono">
            {language === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు • ప్రజల సమాచారం' : 'Community FAQs • Verified Answers'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#064B40] tracking-tight">
            {language === 'te' ? 'పౌరులు & కుటుంబాల కోసం స్పష్టమైన సమాధానాలు' : 'Clear Answers for Citizens & Families'}
          </h2>
          <p className="text-sm font-telugu text-[#075E4E] font-semibold">
            {language === 'te' 
              ? 'మీ హక్కులు, ఉచిత సేవలు మరియు వైద్య సమాచారానికి సంబంధించిన పూర్తి వివరాలు' 
              : 'Reliable government information on free screening, health cards, privacy, and clinical care.'}
          </p>
        </div>

        {/* Accessible Accordion Component */}
        <div className="bg-white rounded-3xl border border-[#B6CFC4]/60 p-4 sm:p-6 shadow-[0_4px_24px_rgba(7,94,78,0.06)]">
          <FAQAccordion items={homeFaqs} defaultOpenId="faq-1" />
        </div>

        <div className="mt-8 text-center">
          <Link to="/faq" className="no-underline">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
              {language === 'te' ? 'పూర్తి ప్రశ్నల విభాగాన్ని చూడండి' : 'Browse Complete Community FAQ Directory'}
            </Button>
          </Link>
        </div>
      </section>


      {/* ============================================================ */}
      {/* SECTION I: AUTHORIZED HEALTHCARE PORTAL LOGIN CALLOUT */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#064B40] via-[#075E4E] to-[#064B40] text-white p-8 sm:p-12 shadow-2xl border border-emerald-800 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center sm:text-left">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-200 border border-white/20 font-mono">
                {language === 'te' ? 'అధికారిక సిబ్బంది లాగిన్' : 'Authorized Personnel Access'}
              </span>
              <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                {language === 'te' 
                  ? 'మీరు ఆరోగ్య కార్యకర్త, వైద్యాధికారి లేదా కోఆర్డినేటరా?' 
                  : 'Are You a Health Worker, Doctor, or Coordinator?'}
              </h3>
              <p className="text-sm font-telugu text-emerald-100 font-medium">
                {language === 'te' 
                  ? 'ఆరోగ్య కార్యకర్తలు మరియు వైద్యాధికారుల పోర్టల్ లాగిన్ గేట్‌వే' 
                  : 'Access screening queues, telemedicine triage, referral navigation, and ITDA administration.'}
              </p>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
                {language === 'te'
                  ? 'మీ గ్రామ స్క్రీనింగ్ వరుసలు, క్లినికల్ సమీక్షలు, రిఫరల్ నావిగేషన్ రికార్డులు లేదా ఐటీడీఏ డాష్‌బోర్డ్‌ను యాక్సెస్ చేయండి.'
                  : 'Access your village screening queues, clinical review workstations, referral navigation records, or ITDA administrative dashboard.'}
              </p>
            </div>

            <div className="shrink-0">
              <Link to="/login" className="no-underline">
                <Button 
                  variant="primary" 
                  size="lg" 
                  icon={ArrowRight} 
                  iconPosition="right"
                  className="bg-white text-[#064B40] hover:bg-[#E7F2EF] font-bold shadow-lg"
                >
                  {language === 'te' ? 'పోర్టల్ లాగిన్ ప్రవేశించండి' : 'Access Portal Login'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
