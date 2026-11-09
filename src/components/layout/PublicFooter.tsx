import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const PublicFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#064B40] text-white mt-20 border-t border-[#075E4E]">
      
      {/* Top Nature Accent Wave Strip */}
      <div className="h-1.5 bg-gradient-to-r from-[#075E4E] via-emerald-400 to-[#064B40]" />

      {/* Mandatory Medical Disclaimer Banner */}
      <div className="bg-[#064B40]/95 border-b border-[#075E4E] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-4 p-5 rounded-2xl bg-[#075E4E]/50 border border-[#B6CFC4]/30">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2 font-mono">
              <span>{t('medicalDisclaimerTitle')}</span>
              <span className="text-xs font-telugu opacity-90">(వైద్య సమాచార ప్రకటన)</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#E7F2EF]/90 leading-relaxed">
              {t('medicalDisclaimerText')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Help Strip: FAQ & Contact */}
      <div className="bg-[#064B40] border-b border-[#075E4E]/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-white">Have Questions or Need Healthcare Assistance?</span>
            <span className="hidden sm:inline text-xs font-telugu text-emerald-200">సహాయం & సమాచారం కోసం:</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 shadow-sm no-underline"
            >
              <span>Community FAQs</span>
              <span className="text-[11px] font-telugu text-emerald-300">(ప్రశ్నలు)</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075E4E] hover:bg-[#064B40] text-white text-xs font-semibold transition-all border border-emerald-400/40 shadow-sm no-underline"
            >
              <span>Helplines & Contact</span>
              <span className="text-[11px] font-telugu text-emerald-300">(సంప్రదించండి)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Branding, Vision & Pilot */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center shrink-0 w-11 h-11 rounded-2xl bg-white p-1.5 shadow-md">
                <img
                  src="/images/aarogya-drishti-logo.png"
                  alt="Aarogya Drishti Oral Health Platform"
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/aarogya-drishti-logo.svg';
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">AAROGYA DRISHTI</span>
                <span className="text-xs font-telugu text-emerald-200 block font-semibold">ఆరోగ్య దృష్టి · నోటి ఆరోగ్య వేదిక</span>
              </div>
            </div>

            <p className="text-sm text-[#E7F2EF] leading-relaxed font-medium">
              "{t('tagline')}" — <span className="font-telugu">{t('taglineTe')}</span>
            </p>

            <p className="text-xs text-[#E7F2EF]/80 leading-relaxed">
              {t('subtagline')}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#E7F2EF]/90 font-mono">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ITDA Paderu, Alluri Sitharama Raju District, Andhra Pradesh</span>
            </div>
          </div>

          {/* Col 3: Public Awareness & Education */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
              Community Health
            </h5>
            <ul className="space-y-2 text-sm text-[#E7F2EF]">
              <li>
                <Link to="/oral-health" className="hover:text-white transition-colors flex items-center justify-between no-underline">
                  <span>Oral Anatomy Guide</span>
                  <span className="text-[11px] font-telugu text-emerald-200/70">నోటి భాగాలు</span>
                </Link>
              </li>
              <li>
                <Link to="/cancer-awareness" className="hover:text-white transition-colors flex items-center justify-between no-underline">
                  <span>Warning Signs</span>
                  <span className="text-[11px] font-telugu text-emerald-200/70">హెచ్చరిక గుర్తులు</span>
                </Link>
              </li>
              <li>
                <Link to="/healthy-habits" className="hover:text-white transition-colors flex items-center justify-between no-underline">
                  <span>Healthy Habits</span>
                  <span className="text-[11px] font-telugu text-emerald-200/70">మంచి అలవాట్లు</span>
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors flex items-center justify-between no-underline">
                  <span>How It Works</span>
                  <span className="text-[11px] font-telugu text-emerald-200/70">విధానం</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Healthcare Support, FAQs & Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
              Support & FAQs
            </h5>
            <ul className="space-y-2 text-sm text-[#E7F2EF]">
              <li>
                <Link to="/facilities" className="hover:text-white transition-colors flex items-center justify-between no-underline">
                  <span>Participating Facilities</span>
                  <span className="text-[11px] font-telugu text-emerald-200/70">వైద్య కేంద్రాలు</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors flex items-center justify-between no-underline">
                  <span>Community FAQs</span>
                  <span className="text-[11px] font-telugu text-emerald-200/70">ప్రశ్నలు</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center justify-between no-underline">
                  <span>Helplines & Contacts</span>
                  <span className="text-[11px] font-telugu text-emerald-200/70">సంప్రదించండి</span>
                </Link>
              </li>
              <li>
                <Link to="/unit-tests" className="hover:text-white transition-colors flex items-center gap-1 text-xs text-emerald-300 font-medium no-underline">
                  <span>In-Website Unit Tests</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-white transition-colors flex items-center gap-1 text-xs text-emerald-300 font-medium no-underline">
                  <span>Living Design System</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Emergency Helplines */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
              Government Helplines
            </h5>
            <div className="space-y-2 text-xs text-[#E7F2EF]">
              <div className="p-3 rounded-xl bg-[#075E4E]/60 border border-[#B6CFC4]/20">
                <span className="font-semibold block text-white">104 — Medical Information</span>
                <span className="text-[11px] text-emerald-200 font-telugu">ఆరోగ్య సమాచార సహాయం</span>
              </div>
              <div className="p-3 rounded-xl bg-[#075E4E]/60 border border-[#B6CFC4]/20">
                <span className="font-semibold block text-white">108 — Emergency Ambulance</span>
                <span className="text-[11px] text-emerald-200 font-telugu">అత్యవసర అంబులెన్స్</span>
              </div>
              <div className="p-3 rounded-xl bg-[#075E4E]/60 border border-[#B6CFC4]/20">
                <span className="font-semibold block text-white">ITDA Paderu: 08935-250000</span>
                <span className="text-[11px] text-emerald-200 font-telugu">గిరిజన ఆరోగ్య సేవా విభాగం</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-8 border-t border-[#075E4E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E7F2EF]/70">
          <p>© 2026 AAROGYA DRISHTI. {t('rightsReserved')}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              {t('privacyPolicy')}
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              {t('termsOfService')}
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              {t('accessibility')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
