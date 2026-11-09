import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from '../../i18n';

interface FaqItem {
  id: string;
  category: 'general' | 'clinical' | 'privacy';
  question: string;
  questionTe: string;
  answer: string;
  answerTe: string;
}

export const FaqPage: React.FC = () => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'general',
      question: 'Do I need a smartphone, mobile phone number, or internet to be screened?',
      questionTe: 'స్క్రీనింగ్ కోసం నాకు స్మార్ట్‌ఫోన్, మొబైల్ నంబర్ లేదా ఇంటర్నెట్ అవసరమా?',
      answer: 'No. You do not need any digital device, phone number, email, or OTP. The authorized Community Health Worker (ASHA / ANM) visits your village, registers you through assisted access, and provides you with a physical AAROGYA DRISHTI Health Card.',
      answerTe: 'అవసరం లేదు. మీకు స్మార్ట్‌ఫోన్, ఫోన్ నంబర్ లేదా ఇంటర్నెట్ లేకపోయినా మీ గ్రామ ఆశా కార్యకర్త మీ వివరాలను స్వయంగా నమోదు చేసి మీకు ఉచిత హెల్త్ కార్డును అందిస్తారు.',
    },
    {
      id: 'faq-2',
      category: 'general',
      question: 'Is the oral screening and hospital referral completely free?',
      questionTe: 'ఈ నోటి పరీక్ష మరియు ఆసుపత్రి రిఫరల్ పూర్తిగా ఉచితమా?',
      answer: 'Yes. All community screenings, frontline photography, medical officer reviews, and public hospital consultations under the ITDA Paderu healthcare program are 100% free of charge for community members.',
      answerTe: 'అవును. ఐటీడీఏ పాడేరు ఆధ్వర్యంలో జరిగే స్క్రీనింగ్, డాక్టర్ల పరిశీలన మరియు ప్రభుత్వ ఆసుపత్రి సేవలు ప్రజలందరికీ పూర్తిగా ఉచితం.',
    },
    {
      id: 'faq-3',
      category: 'clinical',
      question: 'Does an acceptable image quality result mean my mouth is healthy?',
      questionTe: 'ఫోటో నాణ్యత బాగుంది (Acceptable) అంటే నోరు ఆరోగ్యంగా ఉందని అర్థమా?',
      answer: 'No. An "Acceptable" image status means only that the photograph is clear, in focus, well-lit, and suitable for the doctor to examine. It does NOT mean that the mouth is healthy. Only the Medical Officer after reviewing the case can determine if there are abnormalities.',
      answerTe: 'కాదు. ఫోటో స్పష్టంగా ఉంది అంటే డాక్టర్ పరిశీలనకు అనుకూలంగా ఉందని మాత్రమే అర్థం. మీ నోరు ఆరోగ్యంగా ఉందో లేదో వైద్యుని పరీక్ష తర్వాతే తెలుస్తుంది.',
    },
    {
      id: 'faq-4',
      category: 'clinical',
      question: 'Does the AI computer system diagnose oral cancer?',
      questionTe: 'కంప్యూటర్ లేదా ఏఐ (AI) నేరుగా క్యాన్సర్‌ను నిర్ధారిస్తుందా?',
      answer: 'Never. The AI pipeline is strictly an experimental research demonstration tool. It CANNOT diagnose cancer, CANNOT rule out disease, and CANNOT give reassurance. Only a qualified human doctor reviews the images and signs the clinical assessment.',
      answerTe: 'ఎట్టి పరిస్థితుల్లోనూ లేదు. ఏఐ కేవలం ఒక పరిశోధన సహాయక సాధనం మాత్రమే. ఇది క్యాన్సర్‌ను నిర్ధారించలేదు. కేవలం నిపుణులైన ప్రభుత్వ వైద్యులు మాత్రమే ప్రత్యక్షంగా పరిశీలించి నిర్ణయం తీసుకుంటారు.',
    },
    {
      id: 'faq-5',
      category: 'clinical',
      question: 'Are mouth ulcers always cancerous?',
      questionTe: 'నోటి పుండ్లు అన్నీ క్యాన్సరేనా?',
      answer: 'No. Most mouth ulcers are benign (canker sores, nutritional deficiencies, or trauma from sharp teeth) and heal within 10 to 14 days. However, any ulcer that persists beyond 2 to 3 weeks without healing must be clinically examined to rule out precancerous changes.',
      answerTe: 'కాదు. చాలా నోటి పుండ్లు సాధారణమైనవి మరియు 10-14 రోజుల్లో వాటంతట అవే తగ్గుతాయి. కానీ 2-3 వారాలకు మించి మానని పుండ్లను మాత్రమే డాక్టర్ వద్ద పరీక్షించుకోవాలి.',
    },
    {
      id: 'faq-6',
      category: 'privacy',
      question: 'Who can view my photographs and medical history?',
      questionTe: 'నా నోటి ఫోటోలు మరియు ఆరోగ్య వివరాలను ఎవరెవరు చూడగలరు?',
      answer: 'Your records and photographs are confidential. Only authorized healthcare personnel (your assigned village health worker, the reviewing PHC Medical Officer, and the referred hospital specialist) can access your records through authenticated role-based security.',
      answerTe: 'మీ వివరాలు మరియు ఫోటోలు అత్యంత గోప్యంగా ఉంటాయి. కేవలం మీ ఆశా కార్యకర్త, కేటాయించిన ప్రభుత్వ డాక్టర్ మరియు ఆసుపత్రి నిపుణులు మాత్రమే లాగిన్ ద్వారా చూడగలరు.',
    },
    {
      id: 'faq-7',
      category: 'privacy',
      question: 'What happens if someone scans the QR code on my Physical Health Card?',
      questionTe: 'నా హెల్త్ కార్డుపై ఉన్న క్యూఆర్ (QR) కోడ్‌ను ఎవరైనా స్కాన్ చేస్తే వివరాలు కనిపిస్తాయా?',
      answer: 'No medical information will be visible. The QR code contains only an opaque reference token (e.g. ASR-2026-0842). Scanning with a regular smartphone camera reveals no health records. Only hospital staff logged into AAROGYA DRISHTI can retrieve the case.',
      answerTe: 'ఏ వివరాలూ కనిపించవు. క్యూఆర్ కోడ్‌లో ఎటువంటి ఆరోగ్య సమాచారం ఉండదు. సాధారణ ఫోన్లతో స్కాన్ చేస్తే ఏమీ కనిపించదు; కేవలం సిబ్బంది లాగిన్ అయినప్పుడు మాత్రమే వివరాలు లభిస్తాయి.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) => filterCategory === 'all' || item.category === filterCategory
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Go to Previous Navigation */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/" label="Go to Previous" labelTe="మునుపటి పేజీకి" variant="outline" size="sm" />
      </div>

      {/* Title & Introduction */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          {t('faqTitle')}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold font-telugu text-forest-900">
          {t('faqSubtitle')}
        </h2>
        <p className="text-xs sm:text-base text-ink-muted leading-relaxed max-w-2xl mx-auto">
          Clear, honest, and plain-language answers regarding your rights, health checks, data privacy, and hospital care.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            filterCategory === 'all'
              ? 'bg-forest-900 text-white shadow-sm'
              : 'bg-white border border-forest-200 text-ink hover:bg-forest-100/60'
          }`}
        >
          All Questions (అన్నీ)
        </button>
        <button
          onClick={() => setFilterCategory('general')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            filterCategory === 'general'
              ? 'bg-forest-900 text-white shadow-sm'
              : 'bg-white border border-forest-200 text-ink hover:bg-forest-100/60'
          }`}
        >
          Community Access (సాధారణ సందేహాలు)
        </button>
        <button
          onClick={() => setFilterCategory('clinical')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            filterCategory === 'clinical'
              ? 'bg-forest-900 text-white shadow-sm'
              : 'bg-white border border-forest-200 text-ink hover:bg-forest-100/60'
          }`}
        >
          Clinical & AI Safety (వైద్య & ఏఐ భద్రత)
        </button>
        <button
          onClick={() => setFilterCategory('privacy')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            filterCategory === 'privacy'
              ? 'bg-forest-900 text-white shadow-sm'
              : 'bg-white border border-forest-200 text-ink hover:bg-forest-100/60'
          }`}
        >
          Privacy & Health Card (గోప్యత)
        </button>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden ${
                isOpen ? 'border-forest-700/60 shadow-nature' : 'border-forest-100 hover:border-forest-200'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-ink">
                    {faq.question}
                  </h3>
                  <p className="text-sm font-telugu text-forest-800 font-semibold">
                    {faq.questionTe}
                  </p>
                </div>

                <div className={`p-2 rounded-xl bg-forest-50 text-forest-900 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-forest-100' : ''}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-forest-100/60 space-y-2 text-ink-muted text-sm leading-relaxed">
                  <p className="text-ink">
                    {faq.answer}
                  </p>
                  <p className="font-telugu text-forest-900 font-medium pt-2 border-t border-forest-50">
                    {faq.answerTe}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
