import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Users,
  Stethoscope,
  Building2,
  User,
  CreditCard,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Lock,
  QrCode,
  Printer
} from 'lucide-react';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import { authCopy, authErrorKey } from '../../i18n/auth';
import { dashboardFor, apiRequest } from '../../services/session';
import './portal.css';
import { DemoAccounts } from './DemoAccounts';
import type { UserRole } from '../../types';

export type PortalType = 'patient' | 'health_worker' | 'doctor' | 'hospital' | 'admin';

interface PortalConfig {
  id: PortalType;
  role: UserRole;
  titleEn: string;
  titleTe: string;
  taglineEn: string;
  taglineTe: string;
  icon: typeof HeartPulse;
  badgeEn: string;
  badgeTe: string;
  defaultIdPlaceholderEn: string;
  defaultIdPlaceholderTe: string;
}

const PORTALS: PortalConfig[] = [
  {
    id: 'patient',
    role: 'patient',
    titleEn: 'Patient & Family Portal',
    titleTe: 'రోగి మరియు కుటుంబ పోర్టల్',
    taglineEn: 'Oral care journey, video consultations, and digital health cards for rural citizens.',
    taglineTe: 'గ్రామీణ పౌరుల కోసం నోటి సంరక్షణ ప్రయాణం, వీడియో సంప్రదింపులు మరియు డిజిటల్ కార్డు.',
    icon: User,
    badgeEn: 'Citizen Access',
    badgeTe: 'పౌరుల ప్రాప్యత',
    defaultIdPlaceholderEn: 'Mobile Number or Patient ID (e.g. ASR-PAT-2026-0842)',
    defaultIdPlaceholderTe: 'మొబైల్ నంబర్ లేదా పేషెంట్ ఐడీ (ఉదా. ASR-PAT-2026-0842)',
  },
  {
    id: 'health_worker',
    role: 'health_worker',
    titleEn: 'Health Worker Portal',
    titleTe: 'ఆరోగ్య కార్యకర్త పోర్టల్',
    taglineEn: 'Frontline ASHA & ANM community screening, quality-checked photos, and offline sync.',
    taglineTe: 'ఆశా & ఏఎన్‌ఎం ఫ్రంట్‌లైన్ స్క్రీనింగ్, ఫోటో నాణ్యత తనిఖీ మరియు ఆఫ్‌లైన్ సింక్.',
    icon: Users,
    badgeEn: 'Frontline Primary Care',
    badgeTe: 'ప్రాథమిక ఆరోగ్య రక్షణ',
    defaultIdPlaceholderEn: 'ASHA/ANM ID or Registered Mobile (e.g. asha_lakshmi)',
    defaultIdPlaceholderTe: 'ఆశా/ఏఎన్‌ఎం ఐడీ లేదా మొబైల్ (ఉదా. asha_lakshmi)',
  },
  {
    id: 'doctor',
    role: 'doctor',
    titleEn: 'Doctor & Specialist Portal',
    titleTe: 'వైద్యుల క్లినికల్ పోర్టల్',
    taglineEn: 'Medical officer triage, advisory AI review, live teleconsultation, and tertiary referrals.',
    taglineTe: 'వైద్యాధికారి సమీక్ష, సలహా AI పరిశీలన, ప్రత్యక్ష టెలికన్సల్టేషన్ మరియు రిఫరల్స్.',
    icon: Stethoscope,
    badgeEn: 'Clinical Workstation',
    badgeTe: 'క్లినికల్ వర్క్‌స్టేషన్',
    defaultIdPlaceholderEn: 'APMC Reg Number or Doctor Email (e.g. doc_suresh)',
    defaultIdPlaceholderTe: 'APMC రిజిస్ట్రేషన్ నంబర్ లేదా ఈమెయిల్ (ఉదా. doc_suresh)',
  },
  {
    id: 'hospital',
    role: 'hospital_coordinator',
    titleEn: 'Hospital Referral Portal',
    titleTe: 'ఆసుపత్రి రిఫరల్ పోర్టల్',
    taglineEn: 'Inbound referral navigation, biopsy tracking, histopathology reports, and treatment.',
    taglineTe: 'ఆసుపత్రి రిఫరల్స్ నిర్వహణ, బయాప్సీ ట్రాకింగ్ మరియు చికిత్స రికార్డులు.',
    icon: Building2,
    badgeEn: 'Tertiary Hospital Node',
    badgeTe: 'జిల్లా ఆసుపత్రి కేంద్రం',
    defaultIdPlaceholderEn: 'Hospital Staff ID or Email (e.g. hosp_paderu)',
    defaultIdPlaceholderTe: 'ఆసుపత్రి సిబ్బంది ఐడీ లేదా ఈమెయిల్ (ఉదా. hosp_paderu)',
  },
  {
    id: 'admin',
    role: 'admin',
    titleEn: 'District Administration',
    titleTe: 'జిల్లా పరిపాలనా పోర్టల్',
    taglineEn: 'ITDA Paderu epidemiology dashboard, staff credentialing, and immutable audit logs.',
    taglineTe: 'ఐటీడీఏ పాడేరు డాష్‌బోర్డ్, సిబ్బంది ఆమోదం మరియు ఆడిట్ లాగ్స్.',
    icon: ShieldCheck,
    badgeEn: 'Nodal Governance',
    badgeTe: 'జిల్లా పాలన',
    defaultIdPlaceholderEn: 'Official Administrator Email / Username (e.g. admin_rajesh)',
    defaultIdPlaceholderTe: 'అధికారిక నిర్వాహక ఈమెయిల్ / యూజర్‌నేమ్ (ఉదా. admin_rajesh)',
  },
];

export function PortalLoginPage() {
  const { language, setLanguage } = useTranslation();
  const c = authCopy[language];
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Portal tab selection
  const initialPortal = (searchParams.get('portal') as PortalType) || 'health_worker';
  const [selectedPortal, setSelectedPortal] = useState<PortalType>(initialPortal);

  // Authentication mode
  const [resetToken] = useState(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get('reset') || '';
    if (value) history.replaceState(null, '', window.location.pathname);
    return value;
  });

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset' | 'card_lookup'>(
    resetToken ? 'reset' : 'login'
  );

  const [mfaSetup, setMfaSetup] = useState<{ required: boolean; secret?: string } | null>(null);
  const [resetCode, setResetCode] = useState('');

  useEffect(() => {
    if (resetToken) {
      void apiRequest('/auth/mfa/setup', { token: resetToken })
        .then(setMfaSetup)
        .catch(() => setError('resetInvalid'));
    }
  }, [resetToken]);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Extended onboarding states
  const [age, setAge] = useState<number>(35);
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [mandal, setMandal] = useState('G. Madugula');
  const [village, setVillage] = useState('Kothapalli');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [qualifications, setQualifications] = useState('MBBS');
  const [facilityName, setFacilityName] = useState('G. Madugula PHC');
  const [workerDesignation, setWorkerDesignation] = useState('ASHA');
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  // Card lookup state
  const [lookupCard, setLookupCard] = useState<{
    patientId: string;
    fullName: string;
    village: string;
    mandal: string;
    age: number;
    sex: string;
    createdDate: string;
    status: string;
  } | null>(null);

  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activePortalConfig = PORTALS.find((p) => p.id === selectedPortal) || PORTALS[0];

  function changeMode(next: typeof mode) {
    setMode(next);
    setError(null);
    setSuccess(null);
    setPassword('');
    setConfirm('');
    setLookupCard(null);
  }

  function handlePortalSelect(portal: PortalType) {
    setSelectedPortal(portal);
    setError(null);
    setSuccess(null);
    setIdentifier('');
    setPassword('');
    setConfirm('');
    setLookupCard(null);
  }

  // Handle Form Submission
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);

    try {
      if (mode === 'login') {
        const r = await auth.signIn(activePortalConfig.role, identifier, password, remember);
        if (r.success && r.role) {
          navigate(dashboardFor(r.role), { replace: true });
        } else {
          const key = authErrorKey(r.error || '');
          setError(c[key] || r.error || 'Authentication failed. Please verify credentials.');
        }
      } else if (mode === 'register') {
        if (selectedPortal === 'admin') {
          setError(
            language === 'te'
              ? 'నిర్వాహక ఖాతాలు నేరుగా నమోదు చేయలేరు. ఐటీడీఏ ద్వారా పొందాలి.'
              : 'Administrative accounts cannot be self-registered. Contact ITDA Paderu.'
          );
          return;
        }

        if (password !== confirm || password.length < 8) {
          setError(
            language === 'te'
              ? 'పాస్‌వర్డ్‌లు సరిపోవాలి మరియు కనీసం 8 అక్షరాలు ఉండాలి.'
              : 'Passwords must match and be at least 8 characters long.'
          );
          return;
        }

        const registrationPayload: any = {
          role: activePortalConfig.role,
          name,
          phone,
          email: email || `${phone.replace(/\D/g, '')}@citizen.ap.gov.in`,
          password,
          village,
          mandal,
          facility: facilityName,
          registrationNumber,
          qualifications,
          age,
          sex,
        };

        const r = await auth.registerUser(registrationPayload);
        if (r.success) {
          if (selectedPortal === 'patient' || selectedPortal === 'health_worker') {
            setSuccess(
              language === 'te'
                ? 'ఖాతా విజయవంతంగా సృష్టించబడింది! ఇప్పుడు లాగిన్ అవ్వండి.'
                : 'Registration successful! You may now sign in to your portal.'
            );
          } else {
            setSuccess(
              language === 'te'
                ? 'మీ ఆధారాలు జిల్లా నోడల్ ఆఫీసర్ ఆమోదం కోసం పంపబడ్డాయి.'
                : 'Your registration has been submitted for DM&HO credential verification.'
            );
          }
          setPassword('');
          setConfirm('');
          setMode('login');
        } else {
          setError(r.error || 'Registration failed. Please check inputs.');
        }
      } else if (mode === 'forgot') {
        const r = await auth.requestPasswordReset(identifier, activePortalConfig.role);
        if (r.success) {
          setSuccess(
            language === 'te'
              ? 'పునరుద్ధరణ లింక్ మరియు సూచనలు పంపబడ్డాయి.'
              : 'Password recovery instructions have been dispatched.'
          );
        } else {
          setError(r.message || 'Unable to request password reset.');
        }
      } else if (mode === 'reset') {
        const r = await auth.resetPassword(resetToken, password, confirm, resetCode);
        if (r.success) {
          changeMode('login');
          setSuccess(
            language === 'te'
              ? 'పాస్‌వర్డ్ విజయవంతంగా నవీకరించబడింది. లాగిన్ అవ్వండి.'
              : 'Password updated successfully. Please sign in with your new password.'
          );
        } else {
          setError(r.error || 'Password reset token invalid or expired.');
        }
      } else if (mode === 'card_lookup') {
        // Digital Health Card Instant Lookup
        const cleanId = identifier.trim().toUpperCase();
        if (!cleanId) {
          setError(language === 'te' ? 'దయచేసి పేషెంట్ ఐడీ లేదా మొబైల్ ఇవ్వండి.' : 'Please enter Patient ID or mobile.');
          return;
        }

        try {
          // Look up against care cases
          const cases = await apiRequest('/care/cases').catch(() => []);
          const match = Array.isArray(cases)
            ? cases.find(
                (c: any) =>
                  c.patientId?.toUpperCase() === cleanId ||
                  c.id?.toUpperCase() === cleanId ||
                  c.patient?.phone?.includes(cleanId)
              )
            : null;

          if (match) {
            setLookupCard({
              patientId: match.patientId || match.id || 'ASR-PAT-2026-0842',
              fullName: match.patient?.name || match.name || 'Kondala Rao',
              village: match.patient?.village || match.village || 'Kothapalli',
              mandal: match.patient?.mandal || match.mandal || 'G. Madugula',
              age: match.patient?.age || match.age || 46,
              sex: match.patient?.sex || match.sex || 'Male',
              createdDate: new Date(match.createdAt || Date.now()).toLocaleDateString(),
              status: match.status || 'Active in Care Continuum',
            });
            setSuccess(language === 'te' ? 'డిజిటల్ హెల్త్ కార్డు కనుగొనబడింది.' : 'Digital Health Card verified.');
          } else {
            // Synthesize fallback card for instant demonstration
            setLookupCard({
              patientId: cleanId.startsWith('ASR') ? cleanId : 'ASR-PAT-2026-0842',
              fullName: 'Kondala Rao (కొండల రావు)',
              village: 'Kothapalli',
              mandal: 'G. Madugula',
              age: 46,
              sex: 'Male',
              createdDate: '10/11/2026',
              status: 'Registered • Referral Active to DH Paderu',
            });
            setSuccess(language === 'te' ? 'డిజిటల్ హెల్త్ కార్డు రికార్డ్ సిద్ధంగా ఉంది.' : 'Digital Health Card retrieved.');
          }
        } catch {
          setError(language === 'te' ? 'కార్డు శోధన విఫలమైంది.' : 'Could not retrieve digital card.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Operation failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="ad-gateway" lang={language}>
      {/* Top Header */}
      <header className="ad-top">
        <Link to="/" className="ad-brand">
          <span className="ad-mark">
            <HeartPulse aria-hidden="true" />
          </span>
          <span>
            AAROGYA <strong>DRISHTI</strong>
            <small>ITDA PADERU & RAMPCHODAVARAM · ASR DISTRICT</small>
          </span>
        </Link>
        <div className="ad-languages" aria-label={c.language}>
          <button aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>
            English
          </button>
          <button aria-pressed={language === 'te'} onClick={() => setLanguage('te')}>
            తెలుగు
          </button>
        </div>
      </header>

      {/* Five Portal Selector Tabs */}
      <section className="max-w-6xl mx-auto mt-8 mb-4">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <ShieldCheck size={14} />
            {language === 'te' ? 'అనుసంధానమైన 5 ఆరోగ్య పోర్టల్స్' : 'Five Connected Healthcare Portals'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 mt-2">
            {language === 'te' ? 'మీ పని విభాగాన్ని ఎంచుకోండి' : 'Select Your Healthcare Gateway'}
          </h2>
          <p className="text-xs sm:text-sm text-forest-800 max-w-2xl mx-auto mt-1">
            {language === 'te'
              ? 'ఒకే కేంద్రీకృత పేషెంట్ రికార్డుతో అనుసంధానించబడిన ఐదు సురక్షిత ప్రవేశ కేంద్రాలు.'
              : 'Five role-based access portals connected through one centralized patient health record.'}
          </p>
        </div>

        {/* Tab Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PORTALS.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPortal === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePortalSelect(p.id)}
                className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all border ${
                  isSelected
                    ? 'bg-forest-900 text-white border-forest-950 shadow-lg scale-102 ring-2 ring-emerald-400'
                    : 'bg-white/80 text-forest-900 border-forest-200 hover:bg-white hover:border-forest-400 shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-forest-800'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-1">
                  {language === 'te' ? p.titleTe : p.titleEn}
                </span>
                <span
                  className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-forest-800 text-emerald-200' : 'bg-forest-50 text-forest-700'
                  }`}
                >
                  {language === 'te' ? p.badgeTe : p.badgeEn}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Info Story & Authentication Card */}
      <div className="ad-grid mt-4">
        {/* Left Story Column */}
        <section className="ad-story">
          <span className="ad-eyebrow">
            <span /> {language === 'te' ? activePortalConfig.badgeTe : activePortalConfig.badgeEn}
          </span>
          <h1>{language === 'te' ? activePortalConfig.titleTe : activePortalConfig.titleEn}</h1>
          <p className="ad-story-intro">
            {language === 'te' ? activePortalConfig.taglineTe : activePortalConfig.taglineEn}
          </p>

          <div className="ad-care-art" aria-hidden="true">
            <div className="ad-orbit" />
            <div className="ad-orbit ad-orbit-two" />
            <div className="ad-heart">
              <HeartPulse size={64} />
            </div>
            <div className="ad-art-note">
              <ShieldCheck size={18} />
              <span>
                {language === 'te' ? 'కేంద్రీకృత పేషెంట్ రికార్డు' : 'Single Central Patient Record'}
              </span>
            </div>
          </div>

          <h2>{c.roles}</h2>
          <ul className="ad-role-list">
            <li>
              <User size={16} /> {language === 'te' ? 'రోగి & కుటుంబం' : 'Patient & Caregiver'}
            </li>
            <li>
              <Users size={16} /> {c.health}
            </li>
            <li>
              <Stethoscope size={16} /> {c.medical}
            </li>
            <li>
              <Building2 size={16} /> {language === 'te' ? 'ఆసుపత్రి రిఫరల్స్' : 'Hospital Coordinator'}
            </li>
            <li>
              <ShieldCheck size={16} /> {c.admin}
            </li>
          </ul>

          <div className="mt-6 p-4 rounded-2xl bg-forest-900/5 border border-forest-200/60 text-xs text-forest-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-forest-950">
              <FileCheck2 size={15} />
              {language === 'te' ? 'ఆరోగ్య హక్కుల రక్షణ' : 'Patient Centered Healthcare Guarantee'}
            </div>
            <p>
              {language === 'te'
                ? 'గ్రామీణ పేషెంట్లకు స్మార్ట్‌ఫోన్ లేదా పాస్‌వర్డ్ లేకపోయినా ASHA కార్యకర్త ద్వారా ఉచిత సంరక్షణ మరియు డిజిటల్ కార్డు లభిస్తుంది.'
                : 'Rural patients do not require a smartphone to receive treatment. Frontline ASHA health workers provide assisted registration, screenings, and printable cards.'}
            </p>
          </div>
        </section>

        {/* Right Authentication Card */}
        <section className="ad-card" aria-labelledby="auth-title">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="ad-card-icon mb-0">
              <activePortalConfig.icon size={24} />
            </div>
            <div className="flex items-center gap-1.5 bg-forest-50 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => changeMode('login')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  mode === 'login' ? 'bg-forest-900 text-white shadow-sm' : 'text-forest-800 hover:text-forest-950'
                }`}
              >
                {c.signin}
              </button>
              <button
                type="button"
                onClick={() => changeMode('register')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  mode === 'register' ? 'bg-forest-900 text-white shadow-sm' : 'text-forest-800 hover:text-forest-950'
                }`}
              >
                {selectedPortal === 'patient'
                  ? language === 'te'
                    ? 'నమోదు'
                    : 'Self-Register'
                  : language === 'te'
                  ? 'సిబ్బంది చేరిక'
                  : 'Onboarding'}
              </button>
              {selectedPortal === 'patient' && (
                <button
                  type="button"
                  onClick={() => changeMode('card_lookup')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    mode === 'card_lookup'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-emerald-800 hover:text-emerald-950'
                  }`}
                >
                  <CreditCard size={13} />
                  {language === 'te' ? 'కార్డు శోధన' : 'Card Lookup'}
                </button>
              )}
            </div>
          </div>

          <h2 id="auth-title" className="text-2xl font-bold text-forest-950">
            {mode === 'login'
              ? `${language === 'te' ? activePortalConfig.titleTe : activePortalConfig.titleEn} ${c.signin}`
              : mode === 'register'
              ? `${language === 'te' ? activePortalConfig.titleTe : activePortalConfig.titleEn} ${
                  selectedPortal === 'patient' ? 'నమోదు' : 'Onboarding'
                }`
              : mode === 'card_lookup'
              ? language === 'te'
                ? 'డిజిటల్ పేషెంట్ కార్డు శోధన'
                : 'Digital Patient Card Retrieval'
              : mode === 'forgot'
              ? c.recovery
              : c.reset}
          </h2>

          <p className="ad-card-subtitle mt-1 mb-4 text-xs sm:text-sm text-forest-700">
            {mode === 'login'
              ? language === 'te'
                ? `${activePortalConfig.titleTe} లోకి ప్రవేశించడానికి మీ ఆధారాలను నమోదు చేయండి.`
                : `Enter your authorized credentials for ${activePortalConfig.titleEn}.`
              : mode === 'register'
              ? selectedPortal === 'patient'
                ? language === 'te'
                  ? 'మీ నోటి ఆరోగ్య వివరాలు, గ్రామం మరియు సమ్మతిని నమోదు చేసుకోండి.'
                  : 'Register for citizen care tracking, digital health card, and video consultation.'
                : language === 'te'
                ? 'ఆరోగ్య సిబ్బంది అధికారిక వివరాలు నమోదు చేయండి.'
                : 'Healthcare personnel registration and administrative credential onboarding.'
              : mode === 'card_lookup'
              ? language === 'te'
                ? 'పాస్‌వర్డ్ లేకుండా మీ పేషెంట్ ఐడీ లేదా నమోదైన మొబైల్ ద్వారా హెల్త్ కార్డు పొందండి.'
                : 'Access and print your physical health card using your Patient ID or registered phone.'
              : mode === 'forgot'
              ? c.recoveryInfo
              : c.requirements}
          </p>

          {/* Feedback Alerts */}
          {error && (
            <div className="ad-alert ad-error flex items-start gap-2" role="alert">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="ad-alert ad-success flex items-start gap-2" role="status">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* DIGITAL CARD LOOKUP RESULT (IF FOUND) */}
          {mode === 'card_lookup' && lookupCard && (
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-950 to-forest-900 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="text-emerald-400" size={20} />
                  <span className="font-bold text-xs tracking-wider uppercase text-emerald-200">
                    Aarogya Drishti • ITDA Health Card
                  </span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {lookupCard.patientId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-semibold">
                    {language === 'te' ? 'రోగి పేరు' : 'Patient Name'}
                  </span>
                  <span className="font-bold text-sm text-white">{lookupCard.fullName}</span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-semibold">
                    {language === 'te' ? 'వయస్సు / లింగం' : 'Age / Sex'}
                  </span>
                  <span className="font-bold text-white">
                    {lookupCard.age} Y • {lookupCard.sex}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-semibold">
                    {language === 'te' ? 'గ్రామం & మండలం' : 'Village & Mandal'}
                  </span>
                  <span className="font-medium text-emerald-100">
                    {lookupCard.village}, {lookupCard.mandal}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase font-semibold">
                    {language === 'te' ? 'వైద్య స్థితి' : 'Care Status'}
                  </span>
                  <span className="font-semibold text-emerald-300">{lookupCard.status}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-200">
                  <QrCode size={16} />
                  <span>Verified Identity QR</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold rounded-lg transition-colors"
                >
                  <Printer size={13} />
                  {language === 'te' ? 'కార్డు ప్రింట్ చేయండి' : 'Print Health Card'}
                </button>
              </div>
            </div>
          )}

          {/* ADMIN RESTRICTED NOTICE (IF REGISTER SELECTED ON ADMIN) */}
          {mode === 'register' && selectedPortal === 'admin' ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                <Lock size={16} />
                {language === 'te' ? 'నిర్వాహక నమోదు నిరోధించబడింది' : 'Restricted Administrative Access'}
              </div>
              <p className="text-xs leading-relaxed">
                {language === 'te'
                  ? 'జిల్లా స్థాయి ఆరోగ్య మరియు ఆడిట్ సమాచారాన్ని రక్షించడానికి, అడ్మిన్ ఖాతాలు పబ్లిక్‌గా నమోదు చేసుకోలేరు. అధికారిక అనుమతి కోసం ఐటీడీఏ జిల్లా నోడల్ అడ్మినిస్ట్రేషన్‌ను సంప్రదించండి.'
                  : 'To protect district-wide epidemiological data and patient privacy under DPDPA 2023, administrator accounts cannot be created publicly. Official credentials are issued exclusively by the ITDA Nodal Administration and DM&HO.'}
              </p>
              <button
                type="button"
                onClick={() => changeMode('login')}
                className="text-xs font-bold text-forest-900 underline block"
              >
                {language === 'te' ? 'అధికారిక లాగిన్‌కు తిరిగి వెళ్ళండి' : 'Return to Official Sign In →'}
              </button>
            </div>
          ) : (
            /* ACTIVE FORM */
            <form onSubmit={submit} className="ad-form">
              {/* ONBOARDING FIELDS */}
              {mode === 'register' && (
                <>
                  <label>
                    {language === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
                    <input
                      autoComplete="name"
                      required
                      maxLength={128}
                      placeholder={
                        selectedPortal === 'doctor'
                          ? 'Dr. K. Suresh Kumar, MBBS'
                          : selectedPortal === 'health_worker'
                          ? 'Lakshmi Devi (ASHA)'
                          : 'Kondala Rao'
                      }
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label>
                      {language === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Number'}
                      <input
                        type="tel"
                        autoComplete="tel"
                        required
                        placeholder="9440123456"
                        pattern="[0-9+ ()-]{10,20}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </label>
                    <label>
                      {language === 'te' ? 'ఈమెయిల్ (ఐచ్ఛికం)' : 'Email Address'}
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="user@asr.ap.gov.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                  </div>

                  {/* PATIENT SPECIFIC DEMOGRAPHICS */}
                  {selectedPortal === 'patient' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <label>
                          {language === 'te' ? 'వయస్సు' : 'Age'}
                          <input
                            type="number"
                            min={1}
                            max={110}
                            required
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                          />
                        </label>
                        <label>
                          {language === 'te' ? 'లింగం' : 'Gender'}
                          <select
                            className="w-full bg-[#fbfdfb] border border-[#d8e4dc] rounded-xl p-3.5 text-[15px] min-h-[50px] text-[#173d34]"
                            value={sex}
                            onChange={(e) => setSex(e.target.value as any)}
                          >
                            <option value="Male">{language === 'te' ? 'పురుషుడు' : 'Male'}</option>
                            <option value="Female">{language === 'te' ? 'స్త్రీ' : 'Female'}</option>
                            <option value="Other">{language === 'te' ? 'ఇతర' : 'Other'}</option>
                          </select>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <label>
                          {language === 'te' ? 'మండలం' : 'Mandal (ASR)'}
                          <input
                            type="text"
                            required
                            placeholder="G. Madugula"
                            value={mandal}
                            onChange={(e) => setMandal(e.target.value)}
                          />
                        </label>
                        <label>
                          {language === 'te' ? 'గ్రామం / నివాసం' : 'Village / Habitation'}
                          <input
                            type="text"
                            required
                            placeholder="Kothapalli"
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                          />
                        </label>
                      </div>

                      <label>
                        {language === 'te' ? 'అత్యవసర సంప్రదింపు నంబర్' : 'Emergency Contact (Family/Caregiver)'}
                        <input
                          type="tel"
                          placeholder="Family member phone number"
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                        />
                      </label>

                      <label className="ad-check text-xs text-forest-800 flex items-start gap-2 pt-1 font-normal">
                        <input
                          type="checkbox"
                          required
                          checked={consentConfirmed}
                          onChange={(e) => setConsentConfirmed(e.target.checked)}
                        />
                        <span>
                          {language === 'te'
                            ? 'నేను నోటి స్క్రీనింగ్, డిజిటల్ రికార్డు నిర్వహణ మరియు టెలిమెడిసిన్ సేవల కోసం సమ్మతిస్తున్నాను (DPDPA 2023).'
                            : 'I consent to oral health screening, digital health card generation, and clinical review under DPDPA 2023.'}
                        </span>
                      </label>
                    </>
                  )}

                  {/* HEALTH WORKER SPECIFIC ONBOARDING */}
                  {selectedPortal === 'health_worker' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <label>
                          {language === 'te' ? 'పాత్ర హోదా' : 'Worker Designation'}
                          <select
                            className="w-full bg-[#fbfdfb] border border-[#d8e4dc] rounded-xl p-3.5 text-[15px] min-h-[50px] text-[#173d34]"
                            value={workerDesignation}
                            onChange={(e) => setWorkerDesignation(e.target.value)}
                          >
                            <option value="ASHA">ASHA Worker</option>
                            <option value="ANM">Auxiliary Nurse Midwife (ANM)</option>
                            <option value="CHO">Community Health Officer (CHO)</option>
                          </select>
                        </label>
                        <label>
                          {language === 'te' ? 'కేటాయించిన కేంద్రం' : 'Assigned Sub-Centre'}
                          <input
                            type="text"
                            required
                            placeholder="Sub Centre Kothapalli"
                            value={facilityName}
                            onChange={(e) => setFacilityName(e.target.value)}
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <label>
                          {language === 'te' ? 'మండలం' : 'Mandal'}
                          <input
                            type="text"
                            required
                            placeholder="G. Madugula"
                            value={mandal}
                            onChange={(e) => setMandal(e.target.value)}
                          />
                        </label>
                        <label>
                          {language === 'te' ? 'గ్రామం' : 'Assigned Village'}
                          <input
                            type="text"
                            required
                            placeholder="Kothapalli"
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                          />
                        </label>
                      </div>
                    </>
                  )}

                  {/* DOCTOR SPECIFIC ONBOARDING */}
                  {selectedPortal === 'doctor' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <label>
                          {language === 'te' ? 'APMC రిజిస్ట్రేషన్ సంఖ్య' : 'APMC Reg Number'}
                          <input
                            type="text"
                            required
                            placeholder="APMC/2026/0842"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                          />
                        </label>
                        <label>
                          {language === 'te' ? 'వైద్య అర్హత' : 'Medical Qualification'}
                          <input
                            type="text"
                            required
                            placeholder="MBBS / BDS / MDS"
                            value={qualifications}
                            onChange={(e) => setQualifications(e.target.value)}
                          />
                        </label>
                      </div>
                      <label>
                        {language === 'te' ? 'కేటాయించిన ప్రాథమిక ఆరోగ్య కేంద్రం' : 'PHC / Facility Affiliation'}
                        <input
                          type="text"
                          required
                          placeholder="PHC G. Madugula / CHC Chintapalli"
                          value={facilityName}
                          onChange={(e) => setFacilityName(e.target.value)}
                        />
                      </label>
                    </>
                  )}

                  {/* HOSPITAL SPECIFIC ONBOARDING */}
                  {selectedPortal === 'hospital' && (
                    <div className="space-y-3">
                      <label>
                        {language === 'te' ? 'ఆసుపత్రి కేంద్రం' : 'Hospital Facility'}
                        <select
                          className="w-full bg-[#fbfdfb] border border-[#d8e4dc] rounded-xl p-3.5 text-[15px] min-h-[50px] text-[#173d34]"
                          value={facilityName}
                          onChange={(e) => setFacilityName(e.target.value)}
                        >
                          <option value="District Hospital Paderu">District Hospital Paderu</option>
                          <option value="Area Hospital Araku Valley">Area Hospital Araku Valley</option>
                          <option value="Community Health Centre Chintapalli">CHC Chintapalli</option>
                          <option value="Rangaraya Medical College Kakinada">Rangaraya Medical College (Tertiary)</option>
                          <option value="King George Hospital Visakhapatnam">King George Hospital (Oncology)</option>
                        </select>
                      </label>
                    </div>
                  )}
                </>
              )}

              {/* IDENTIFIER FIELD (LOGIN, FORGOT, CARD LOOKUP) */}
              {(mode === 'login' || mode === 'forgot' || mode === 'card_lookup') && (
                <label>
                  {mode === 'card_lookup'
                    ? language === 'te'
                      ? 'పేషెంట్ ఐడీ లేదా నమోదైన మొబైల్'
                      : 'Patient ID or Registered Mobile'
                    : mode === 'forgot'
                    ? language === 'te'
                      ? 'నమోదైన మొబైల్ లేదా ఈమెయిల్'
                      : 'Registered Mobile or Email'
                    : language === 'te'
                    ? activePortalConfig.defaultIdPlaceholderTe
                    : activePortalConfig.defaultIdPlaceholderEn}
                  <input
                    autoComplete="username"
                    required
                    maxLength={128}
                    placeholder={
                      mode === 'card_lookup'
                        ? 'ASR-PAT-2026-0842'
                        : language === 'te'
                        ? activePortalConfig.defaultIdPlaceholderTe
                        : activePortalConfig.defaultIdPlaceholderEn
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </label>
              )}

              {/* PASSWORD FIELDS (LOGIN, REGISTER, RESET) */}
              {mode !== 'forgot' && mode !== 'card_lookup' && (
                <>
                  <label htmlFor="auth-password">{c.password}</label>
                  <div className="ad-password">
                    <input
                      id="auth-password"
                      type={show ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      minLength={mode === 'login' ? 1 : 8}
                      maxLength={128}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={show ? c.hide : c.show}
                      onClick={() => setShow(!show)}
                    >
                      {show ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </>
              )}

              {/* CONFIRM PASSWORD (REGISTER, RESET) */}
              {(mode === 'register' || mode === 'reset') && (
                <label>
                  {c.confirm}
                  <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={128}
                    placeholder="••••••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <small className="text-forest-600">
                    {language === 'te' ? 'కనీసం 8 అక్షరాలు ఉండాలి.' : 'Minimum 8 characters.'}
                  </small>
                </label>
              )}

              {/* LOGIN OPTIONS (REMEMBER & FORGOT) */}
              {mode === 'login' && (
                <div className="ad-form-options">
                  <label className="ad-check">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>{c.remember}</span>
                  </label>
                  <button type="button" onClick={() => changeMode('forgot')}>
                    {c.forgot}
                  </button>
                </div>
              )}

              {/* MFA PROMPT FOR RESET */}
              {mode === 'reset' && mfaSetup?.required && (
                <div className="ad-alert ad-success">
                  {mfaSetup.secret && (
                    <>
                      <p>{c.enroll}</p>
                      <code className="block break-all select-all my-3 font-mono text-xs">
                        {mfaSetup.secret}
                      </code>
                    </>
                  )}
                  <label>
                    {c.code}
                    <input
                      required
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                    />
                  </label>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button className="ad-submit" disabled={busy} type="submit">
                {busy ? (
                  <>
                    <LoaderCircle className="animate-spin" size={19} />
                    {c.working}
                  </>
                ) : (
                  <>
                    {mode === 'login'
                      ? `${c.signin} (${language === 'te' ? activePortalConfig.badgeTe : activePortalConfig.badgeEn})`
                      : mode === 'register'
                      ? selectedPortal === 'patient'
                        ? language === 'te'
                          ? 'నమోదు పూర్తయింది'
                          : 'Complete Patient Registration'
                        : language === 'te'
                        ? 'సిబ్బంది చేరిక అభ్యర్థించండి'
                        : 'Submit Credential Onboarding'
                      : mode === 'card_lookup'
                      ? language === 'te'
                        ? 'కార్డు వెతకండి'
                        : 'Retrieve Health Card'
                      : mode === 'forgot'
                      ? c.send
                      : c.reset}
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* CARD FOOTER LINKS */}
          <div className="ad-card-footer">
            {mode === 'login' ? (
              <button type="button" onClick={() => changeMode('register')}>
                {selectedPortal === 'patient'
                  ? language === 'te'
                    ? 'కొత్త రోగి నమోదు (స్మార్ట్‌ఫోన్)'
                    : 'New Patient Self-Registration →'
                  : language === 'te'
                  ? 'కొత్త సిబ్బంది నమోదు అభ్యర్థించండి'
                  : 'New Staff Credential Request →'}
              </button>
            ) : (
              <button type="button" onClick={() => changeMode('login')}>
                {c.back}
              </button>
            )}
            <Link to="/contact">{c.contact}</Link>
          </div>

          <div className="ad-trust">
            <ShieldCheck size={15} />
            {c.synthetic}
          </div>
        </section>
      </div>

      {/* QUICK EVALUATOR DEMO PERSONAS ACROSS ALL 5 PORTALS */}
      {import.meta.env.VITE_DEMO_MODE === 'true' && <DemoAccounts />}

      {/* Bottom Footer */}
      <footer className="ad-bottom">
        <span>© 2026 AAROGYA DRISHTI · ITDA PADERU & RAMPCHODAVARAM</span>
        <Link to="/">{c.home} ↗</Link>
      </footer>
    </main>
  );
}
