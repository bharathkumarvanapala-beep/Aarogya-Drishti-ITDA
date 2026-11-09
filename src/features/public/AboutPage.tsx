import React from 'react';
import { Users, Stethoscope, Building, Award } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from '../../i18n';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      
      {/* Top Go to Previous Navigation */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/" label="Go to Previous" labelTe="మునుపటి పేజీకి" variant="outline" size="sm" />
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#064B40] bg-[#E7F2EF] border border-[#B6CFC4]/60 px-3.5 py-1.5 rounded-full font-mono">
          Mission & Context • లక్ష్యం & నేపథ్యం
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#064B40] tracking-tight">
          {t('aboutTitle')}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold font-telugu text-[#075E4E]">
          {t('aboutSubtitle')}
        </h2>
        <p className="text-xs sm:text-base text-[#5F736C] leading-relaxed max-w-2xl mx-auto">
          Designed for the tribal habitations and rural valleys of Alluri Sitharama Raju district, Andhra Pradesh, under the leadership of the Integrated Tribal Development Agency (ITDA), Paderu.
        </p>
      </div>

      {/* Main Mission Story Card */}
      <div className="rounded-3xl bg-white border border-[#B6CFC4]/50 p-6 sm:p-10 shadow-[0_4px_24px_-4px_rgba(7,94,78,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#064B40]">
              The Reality of Rural & Tribal Healthcare
            </h3>
            <p className="text-sm font-telugu text-[#075E4E] font-semibold">
              గిరిజన ప్రాంతాల్లో నోటి ఆరోగ్య సంరక్షణ ఆవశ్యకత
            </p>
            <p className="text-sm text-[#5F736C] leading-relaxed">
              In the Agency tracts of Paderu, Araku, Chintapalli, and G. Madugula, thousands of residents live in remote tribal habitations. Chewing tobacco, gutkha, and the regional practice of reverse smoking (chutta) are prevalent habits that significantly elevate the risk of oral potentially malignant disorders and oral cancer.
            </p>
            <p className="text-sm text-[#5F736C] leading-relaxed">
              Yet, specialist dental surgeons and oncologists are situated 80 to 120 km away in Visakhapatnam. Mountainous ghat roads, loss of daily wages, lack of digital connectivity, and digital illiteracy prevent early detection. Most patients only seek care when a lesion causes severe pain or restricted mouth opening—often at late stages.
            </p>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#075E4E] text-white text-sm font-semibold shadow-md">
              "Technology should reach the patient. The patient should never be forced to reach technology."
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-[#B6CFC4]/40">
              <img
                src="/images/rural_health_hero.jpg"
                alt="Health worker with villagers in Paderu"
                loading="lazy"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Community Partnership */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h3 className="text-xl sm:text-3xl font-bold text-[#064B40]">
            A Continuous Tri-Tier Care Model
          </h3>
          <p className="text-xs sm:text-sm text-[#5F736C] font-telugu font-semibold">
            ఆరోగ్య కార్యకర్తలు, వైద్యాధికారులు మరియు ఆసుపత్రుల సమన్వయం
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm space-y-3 hover:border-[#075E4E]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#064B40]">1. Village ASHA Workers</h4>
            <p className="text-xs font-telugu text-[#075E4E] font-semibold -mt-2">గ్రామ ఆశా కార్యకర్తలు</p>
            <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
              Frontline health workers conduct door-to-door oral health education, record verbal informed consent, and capture guided 5-view oral photographs using mobile phones. They operate fully offline and synchronize whenever connectivity is available.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm space-y-3 hover:border-[#075E4E]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#064B40]">2. PHC Medical Officers</h4>
            <p className="text-xs font-telugu text-[#075E4E] font-semibold -mt-2">ప్రాథమిక ఆరోగ్య కేంద్ర వైద్యాధికారులు</p>
            <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
              Doctors at local Primary Health Centres review submitted clinical histories and zoomable high-resolution photographs. They formulate independent clinical assessments and generate authorized specialist referrals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#B6CFC4]/50 shadow-sm space-y-3 hover:border-[#075E4E]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#E7F2EF] text-[#075E4E] flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#064B40]">3. District & Tertiary Hospitals</h4>
            <p className="text-xs font-telugu text-[#075E4E] font-semibold -mt-2">జిల్లా మరియు బోధనా ఆసుపత్రులు</p>
            <p className="text-xs sm:text-sm text-[#5F736C] leading-relaxed">
              Specialists at District Hospital Paderu and King George Hospital (KGH) receive confirmed patient referrals, book physical clinic visits, perform biopsies when clinically indicated, and initiate definitive care without administrative delays.
            </p>
          </div>
        </div>
      </div>

      {/* ITDA Paderu Collaboration Box */}
      <div className="rounded-3xl bg-[#064B40] text-white p-6 sm:p-10 shadow-xl border border-emerald-900/50">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-white/10 text-emerald-300 shrink-0 border border-white/20">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Supported by ITDA Paderu & Government of Andhra Pradesh
            </h4>
            <p className="text-xs sm:text-sm font-telugu text-emerald-200 font-semibold">
              సమగ్ర గిరిజనాభివృద్ధి సంస్థ (ITDA) పాడేరు పర్యవేక్షణలో
            </p>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
              This initiative brings together public health infrastructure, trained tribal community mobilizers, digital technology, and tertiary oncology linkage to ensure that no resident of Alluri Sitharama Raju district is left behind.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
