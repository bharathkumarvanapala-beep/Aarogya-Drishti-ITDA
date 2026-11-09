import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Users, 
  Stethoscope, 
  Building2, 
  ShieldAlert, 
  Heart, 
  UserPlus, 
  LogIn, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BackButton } from '../../components/common/BackButton';
import { Alert } from '../../components/common/Alert';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import type { UserRole } from '../../types';

type AuthMode = 'signin' | 'signup';

interface RoleConfig {
  role: UserRole;
  title: string;
  titleTe: string;
  badge: string;
  badgeTe: string;
  subtitle: string;
  subtitleTe: string;
  persona: string;
  demoIdentifier: string;
  demoPassword: string;
  targetPath: string;
  icon: React.FC<{ className?: string }>;
  accentColor: string;
  accentBorder: string;
  loginPlaceholder: string;
  loginPlaceholderTe: string;
  allowPublicSignup: boolean;
}

export const PortalLoginPage: React.FC = () => {
  const { signIn, registerUser, requestPasswordReset, resetPassword } = useAuth();
  const { language } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // State for active role selection & dialogs
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Unauthorized redirection message if arriving from protected route
  const unauthorizedAlert = location.state?.unauthorized
    ? location.state?.message || 'You are not authorized to access this portal. Please log in through your assigned portal.'
    : null;

  // Sign In form fields
  const [signInIdentifier, setSignInIdentifier] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');

  // Sign Up form fields tailored to role
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    fullNameTe: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Doctor Portal fields
    doctorId: '',
    medicalQualification: 'MBBS',
    specialization: 'General Medicine',
    registrationNumber: '', // APMC Reg #
    // ASHA Worker Portal fields
    ashaId: '',
    assignedVillage: 'Kothapalli',
    // ANM Portal fields
    anmId: '',
    assignedHealthCentre: 'G. Madugula Sub-Centre',
    // Hospital Coordinator fields
    hospitalCoordinatorId: '',
    facilityName: 'District Hospital, Paderu',
    // Common regional fields
    mandal: 'G. Madugula',
    district: 'Alluri Sitharama Raju',
  });

  // Forgot Password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState<string>('');
  const [forgotToken, setForgotToken] = useState<string>('');
  const [forgotNewPassword, setForgotNewPassword] = useState<string>('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState<string>('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const roleConfigs: Record<UserRole, RoleConfig> = {
    doctor: {
      role: 'doctor',
      title: 'Doctor Portal',
      titleTe: 'డాక్టర్ పోర్టల్ (వైద్యాధికారి / స్పెషలిస్ట్)',
      badge: 'Clinical Review & Diagnosis',
      badgeTe: 'క్లినికల్ సమీక్ష & నిర్ధారణ',
      subtitle: 'Primary Health Centre case review, lesion photography evaluation, APMC clinical diagnosis, and specialist oncology referral dispatch.',
      subtitleTe: 'ప్రాథమిక ఆరోగ్య కేంద్రాల కేసుల సమీక్ష, ఫోటోల పరీక్ష మరియు స్పెషలిస్ట్ రిఫరల్ నిర్ణయాలు.',
      persona: 'Dr. K. Suresh, MBBS (APMC/2018/04912, G. Madugula PHC)',
      demoIdentifier: 'dr_suresh',
      demoPassword: 'Aarogya@2026',
      targetPath: '/doctor',
      icon: Stethoscope,
      accentColor: 'bg-emerald-50/50',
      accentBorder: 'border-emerald-700',
      loginPlaceholder: 'Registered Mobile or Doctor ID / APMC #',
      loginPlaceholderTe: 'నమోదైన మొబైల్ లేదా డాక్టర్ ఐడీ / APMC సంఖ్య',
      allowPublicSignup: true,
    },
    asha: {
      role: 'asha',
      title: 'ASHA Worker Portal',
      titleTe: 'ఆశా కార్యకర్త పోర్టల్ (ASHA Worker)',
      badge: 'Frontline Community Screening',
      badgeTe: 'గ్రామీణ ఫీల్డ్ స్క్రీనింగ్',
      subtitle: 'Doorstep oral health screening, bilingual informed consent, 5-view guided camera intake, and offline synchronisation across tribal habitations.',
      subtitleTe: 'గ్రామీణ నివాసాల్లో నోటి స్క్రీనింగ్, సమ్మతి పత్రం, 5-యాంగిల్ ఫోటోలు మరియు ఆఫ్‌లైన్ సింక్.',
      persona: 'Lakshmi Devi (ASHA-GMAD-01, G. Madugula)',
      demoIdentifier: 'ASHA-GMAD-01',
      demoPassword: 'Aarogya@2026',
      targetPath: '/health-worker',
      icon: Users,
      accentColor: 'bg-forest-50/50',
      accentBorder: 'border-forest-700',
      loginPlaceholder: 'Registered Mobile or ASHA ID (e.g. ASHA-GMAD-01)',
      loginPlaceholderTe: 'నమోదైన మొబైల్ లేదా ఆశా ఐడీ',
      allowPublicSignup: true,
    },
    anm: {
      role: 'anm',
      title: 'ANM Portal',
      titleTe: 'ఏఎన్‌ఎం పోర్టల్ (Auxiliary Nurse Midwife)',
      badge: 'Sub-Centre & Village Healthcare',
      badgeTe: 'సబ్-సెంటర్ & ఆరోగ్య సేవలు',
      subtitle: 'Sub-centre screening oversight, village health camp coordination, follow-up monitoring, and high-risk case triaging.',
      subtitleTe: 'సబ్-సెంటర్ స్థాయి స్క్రీనింగ్ పర్యవేక్షణ, ఫాలో-అప్ నిర్వహణ మరియు రిఫరల్ సమన్వయం.',
      persona: 'Sarada Devi, ANM (ANM-GMAD-01, G. Madugula)',
      demoIdentifier: 'ANM-GMAD-01',
      demoPassword: 'Aarogya@2026',
      targetPath: '/health-worker',
      icon: Users,
      accentColor: 'bg-teal-50/50',
      accentBorder: 'border-teal-700',
      loginPlaceholder: 'Registered Mobile or ANM ID (e.g. ANM-GMAD-01)',
      loginPlaceholderTe: 'నమోదైన మొబైల్ లేదా ఏఎన్‌ఎం ఐడీ',
      allowPublicSignup: true,
    },
    admin: {
      role: 'admin',
      title: 'District Admin Portal',
      titleTe: 'జిల్లా అడ్మిన్ పోర్టల్ (ITDA Paderu)',
      badge: 'Governance & Analytics',
      badgeTe: 'జిల్లా స్థాయి పరిపాలన & గణాంకాలు',
      subtitle: 'Alluri Sitharama Raju district screening coverage, village mapping, professional account approval desk, and system monitoring.',
      subtitleTe: 'జిల్లా వ్యాప్తంగా స్క్రీనింగ్ గణాంకాలు, సిబ్బంది ఆమోద డెస్క్ మరియు పర్యవేక్షణ.',
      persona: 'Srikanth Rao, IAS (Project Officer, ITDA Paderu)',
      demoIdentifier: 'admin_rajesh',
      demoPassword: 'Aarogya@2026',
      targetPath: '/admin',
      icon: ShieldAlert,
      accentColor: 'bg-amber-50/50',
      accentBorder: 'border-amber-700',
      loginPlaceholder: 'Registered Admin Username or Mobile Number',
      loginPlaceholderTe: 'అడ్మిన్ యూజర్‌నేమ్ లేదా మొబైల్ సంఖ్య',
      allowPublicSignup: false, // Strict requirement: No unrestricted public admin registration
    },
    hospital_coordinator: {
      role: 'hospital_coordinator',
      title: 'Hospital Referral Coordinator Portal',
      titleTe: 'ఆసుపత్రి రిఫరల్ సమన్వయకర్త పోర్టల్',
      badge: 'Secondary/Tertiary Hospital Care',
      badgeTe: 'ఆసుపత్రి స్థాయి రిఫరల్ నావిగేషన్',
      subtitle: 'Inbound referral triage from PHCs, specialist oncology clinic scheduling, biopsy/pathology tracking, and tribal patient navigation.',
      subtitleTe: 'రిఫరల్స్ స్వీకరణ, స్పెషలిస్ట్ అపాయింట్‌మెంట్లు మరియు బయాప్సీ ట్రాకింగ్.',
      persona: 'Rajesh Varma (HRC-ASR-042, District Hospital Paderu)',
      demoIdentifier: 'HRC-ASR-042',
      demoPassword: 'Aarogya@2026',
      targetPath: '/hospital',
      icon: Building2,
      accentColor: 'bg-blue-50/50',
      accentBorder: 'border-blue-700',
      loginPlaceholder: 'Registered Mobile or Coordinator ID (e.g. HRC-ASR-042)',
      loginPlaceholderTe: 'నమోదైన మొబైల్ లేదా కోఆర్డినేటర్ ఐడీ',
      allowPublicSignup: true,
    },
    // Required by UserRole type; Patient Portal remains completely unchanged
    patient: {
      role: 'patient',
      title: 'Patient & Family Portal',
      titleTe: 'రోగి & కుటుంబ పోర్టల్',
      badge: 'Citizen Health Records',
      badgeTe: 'పౌరుల ఆరోగ్య రికార్డులు',
      subtitle: 'Self-service view of screening history, physical health card token preview, and family caregiver access.',
      subtitleTe: 'రోగి వివరాలు, హెల్త్ కార్డ్ మరియు సంరక్షకుల యాక్సెస్ నిర్వహణ.',
      persona: 'Kondala Rao (Self / Caregiver)',
      demoIdentifier: '9440188421',
      demoPassword: 'Aarogya@2026',
      targetPath: '/patient/portal',
      icon: Heart,
      accentColor: 'bg-rose-50/50',
      accentBorder: 'border-rose-700',
      loginPlaceholder: 'Health Card Reference Number or Mobile',
      loginPlaceholderTe: 'హెల్త్ కార్డ్ రిఫరెన్స్ లేదా మొబైల్',
      allowPublicSignup: false,
    },
    // Supporting legacy role mappings
    health_worker: {
      role: 'health_worker',
      title: 'Frontline Healthcare Worker',
      titleTe: 'ఆరోగ్య కార్యకర్త',
      badge: 'Frontline Team',
      badgeTe: 'ఫీల్డ్ బృందం',
      subtitle: 'Doorstep oral health screening and offline synchronisation.',
      subtitleTe: 'గ్రామీణ నివాసాల్లో నోటి స్క్రీనింగ్.',
      persona: 'Lakshmi Devi (ASHA, G. Madugula)',
      demoIdentifier: '9440123456',
      demoPassword: 'Aarogya@2026',
      targetPath: '/health-worker',
      icon: Users,
      accentColor: 'bg-forest-50/50',
      accentBorder: 'border-forest-700',
      loginPlaceholder: 'Registered Mobile or Staff ID',
      loginPlaceholderTe: 'మొబైల్ లేదా స్టాఫ్ ఐడీ',
      allowPublicSignup: true,
    },
    specialist: {
      role: 'specialist',
      title: 'Specialist Oncologist',
      titleTe: 'స్పెషలిస్ట్ ఓరల్ ఆంకాలజిస్ట్',
      badge: 'Specialist Triage',
      badgeTe: 'స్పెషలిస్ట్ సమీక్ష',
      subtitle: 'District Hospital Head & Neck surgical oncology review.',
      subtitleTe: 'స్పెషలిస్ట్ సమీక్ష.',
      persona: 'Dr. M. Anand, MDS',
      demoIdentifier: 'dr_ananya',
      demoPassword: 'Aarogya@2026',
      targetPath: '/doctor',
      icon: Stethoscope,
      accentColor: 'bg-emerald-50/50',
      accentBorder: 'border-emerald-700',
      loginPlaceholder: 'Doctor ID or Registered Mobile',
      loginPlaceholderTe: 'డాక్టర్ ఐడీ లేదా మొబైల్',
      allowPublicSignup: true,
    },
  };

  const currentConfig = roleConfigs[selectedRole] || roleConfigs.doctor;

  const handleOpenAuth = (role: UserRole, mode: AuthMode) => {
    setSelectedRole(role);
    setAuthMode(mode);
    setAuthError(null);
    setAuthSuccess(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setSignInIdentifier('');
    setSignInPassword('');
    setIsModalOpen(true);
  };

  const handleFillDemoCredentials = () => {
    setSignInIdentifier(currentConfig.demoIdentifier);
    setSignInPassword(currentConfig.demoPassword);
    setAuthError(null);
  };

  // 1-Click direct demo evaluation launch
  const handleDirectDemoLaunch = async (role: UserRole, _targetPath: string) => {
    const usernames: Partial<Record<UserRole, string>> = { doctor: 'dr_suresh', specialist: 'dr_ananya', asha: 'asha_lakshmi', health_worker: 'hw_lakshmi', anm: 'anm_sarada', hospital_coordinator: 'hosp_paderu', admin: 'admin_rajesh', patient: 'pat_kondala' };
    setIsSubmitting(true);
    const result = await signIn(role, usernames[role] || '', 'Aarogya@2026');
    setIsSubmitting(false);
    if (result.success) navigate(role === 'patient' ? '/patient/portal' : '/care');
    else { setAuthError(result.error || 'Sign in failed'); setIsModalOpen(true); }
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isForgotModalOpen) setIsForgotModalOpen(false);
        else if (isModalOpen) setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isForgotModalOpen]);

  // Handle Sign In submission
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    if (!signInIdentifier.trim()) {
      setAuthError('Please enter your registered mobile number or ID.');
      setIsSubmitting(false);
      return;
    }
    if (!signInPassword.trim()) {
      setAuthError('Please enter your password.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await signIn(selectedRole, signInIdentifier.trim(), signInPassword.trim());

      if (res.success) {
        setAuthSuccess(`Authentication successful! Accessing ${currentConfig.title}...`);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate(currentConfig.targetPath);
        }, 600);
      } else {
        setAuthError(res.error || 'Invalid mobile number/ID or password.');
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Invalid mobile number/ID or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Registration submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    // Basic common validations
    if (!signUpData.fullName.trim()) {
      setAuthError('Please enter your full legal name.');
      setIsSubmitting(false);
      return;
    }

    const cleanPhone = signUpData.phone.trim().replace(/[^\d]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setAuthError('Please provide a valid 10-digit mobile number.');
      setIsSubmitting(false);
      return;
    }

    if (!signUpData.password || signUpData.password.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setAuthError('Password and confirmation password do not match.');
      setIsSubmitting(false);
      return;
    }

    // Role-specific validation
    if (selectedRole === 'doctor') {
      if (!signUpData.registrationNumber.trim() && !signUpData.doctorId.trim()) {
        setAuthError('Please provide your APMC Medical Registration Number or Doctor ID.');
        setIsSubmitting(false);
        return;
      }
      if (!signUpData.medicalQualification.trim()) {
        setAuthError('Please specify your medical qualification (e.g. MBBS, MD, MDS).');
        setIsSubmitting(false);
        return;
      }
    } else if (selectedRole === 'asha') {
      if (!signUpData.ashaId.trim()) {
        setAuthError('Please provide your official ASHA ID (e.g. ASHA-GMAD-14).');
        setIsSubmitting(false);
        return;
      }
      if (!signUpData.assignedVillage.trim()) {
        setAuthError('Please enter your assigned village or habitation.');
        setIsSubmitting(false);
        return;
      }
    } else if (selectedRole === 'anm') {
      if (!signUpData.anmId.trim()) {
        setAuthError('Please provide your official ANM ID (e.g. ANM-GMAD-02).');
        setIsSubmitting(false);
        return;
      }
      if (!signUpData.assignedHealthCentre.trim()) {
        setAuthError('Please enter your assigned Primary Health Centre or Sub-Centre.');
        setIsSubmitting(false);
        return;
      }
    } else if (selectedRole === 'admin') {
      setAuthError('Public registration is not available for District Administrator accounts.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await registerUser({
        role: selectedRole,
        name: signUpData.fullName.trim(),
        nameTe: signUpData.fullNameTe.trim() || signUpData.fullName.trim(),
        phone: cleanPhone,
        email: signUpData.email.trim() || undefined,
        password: signUpData.password,
        qualification: signUpData.medicalQualification,
        specialization: signUpData.specialization,
        registrationNumber: signUpData.registrationNumber.trim() || undefined,
        doctorId: signUpData.doctorId.trim() || undefined,
        ashaId: signUpData.ashaId.trim() || undefined,
        anmId: signUpData.anmId.trim() || undefined,
        subCentre: signUpData.assignedHealthCentre || signUpData.assignedVillage,
        facility: signUpData.assignedHealthCentre || signUpData.facilityName,
        mandal: signUpData.mandal,
        district: signUpData.district,
      });

      if (res.success) {
        setAuthSuccess(
          `Registration submitted for ${signUpData.fullName}. An administrator must verify your account before you can sign in.`,
        );
        // Switch to sign in tab with pre-filled credentials
        setSignInIdentifier(cleanPhone);
        setSignInPassword(signUpData.password);
        setTimeout(() => {
          setAuthMode('signin');
        }, 1200);
      } else {
        setAuthError(res.error || 'Registration failed. Please check your details.');
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (forgotStep === 1) {
      if (!forgotIdentifier.trim()) {
        setForgotError('Please enter your registered mobile number or ID.');
        return;
      }
      const res = await requestPasswordReset(forgotIdentifier.trim(), selectedRole);
      setForgotToken(res.resetToken || 'RESET-8420-OTP');
      setForgotSuccess(res.message);
      setForgotStep(2);
    } else {
      if (!forgotNewPassword || forgotNewPassword.length < 8) {
        setForgotError('New password must be at least 8 characters long.');
        return;
      }
      if (forgotNewPassword !== forgotConfirmPassword) {
        setForgotError('Passwords do not match.');
        return;
      }
      const res = await resetPassword(forgotToken, forgotNewPassword, forgotConfirmPassword);
      if (res.success) {
        setForgotSuccess('Password updated successfully! You may now sign in.');
        setTimeout(() => {
          setIsForgotModalOpen(false);
          setForgotStep(1);
          setSignInPassword(forgotNewPassword);
        }, 1200);
      } else {
        setForgotError(res.error || 'Password update failed.');
      }
    }
  };

  // 5 non-patient portal options + 1 patient option
  const nonPatientPortals = [
    roleConfigs.doctor,
    roleConfigs.asha,
    roleConfigs.anm,
    roleConfigs.admin,
    roleConfigs.hospital_coordinator,
  ];

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Top Header & Navigation Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BackButton
              fallbackPath="/"
              label="Go to Website"
              labelTe="హోమ్‌ పేజీకి"
              variant="outline"
              size="sm"
            />

            <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-forest-700 rounded-xl p-1">
              <div className="w-10 h-10 rounded-2xl bg-forest-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                  <path d="M20 7C14 7 10 12 10 18C10 25 15 31 19 33.5C19.6 33.8 20.4 33.8 21 33.5C25 31 30 25 30 18C30 12 26 7 20 7Z" fill="#E8F5EF" stroke="#398F72" strokeWidth="2" />
                  <path d="M15 20C17 23 23 23 25 20" stroke="#075B4D" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-ink block leading-tight">AAROGYA DRISHTI</span>
                <span className="text-xs font-telugu text-forest-800 font-semibold block">ఆరోగ్య దృష్టి పోర్టల్ లాగిన్</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="pill" />
          </div>
        </div>

        {/* Unauthorized Redirection Alert (if redirected from direct URL manipulation) */}
        {unauthorizedAlert && (
          <Alert type="warning" title="Authorization Notice" titleTe="యాక్సెస్ హెచ్చరిక">
            <p className="font-semibold text-xs sm:text-sm">{unauthorizedAlert}</p>
          </Alert>
        )}

        {/* Portal Gateway Introduction */}
        <div className="text-center max-w-3xl mx-auto space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-bold uppercase tracking-wider font-mono">
            <KeyRound className="w-3.5 h-3.5 text-forest-800" />
            <span>Secure Role-Based Portal Gateway · ASR District</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
            Select Your Assigned Healthcare Portal
          </h1>
          <p className="text-sm font-telugu text-forest-900 font-semibold">
            మీ కేటాయించిన పోర్టల్‌ను ఎంచుకుని సరైన వివరాలతో లాగిన్ అవ్వండి
          </p>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl mx-auto">
            Each healthcare role provides dedicated workflow access. Professional accounts require valid credentials and administrator verification.
          </p>
        </div>

        {/* Portals Grid: 5 Separate Professional Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {nonPatientPortals.map((card) => {
            const isSelected = selectedRole === card.role;
            const Icon = card.icon;

            return (
              <div
                key={card.role}
                onClick={() => setSelectedRole(card.role)}
                className={`relative p-5 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between h-full bg-white shadow-nature hover:shadow-nature-lg cursor-pointer ${
                  isSelected
                    ? `${card.accentBorder} ${card.accentColor} scale-[1.01] ring-2 ring-forest-800/10`
                    : 'border-forest-100/90 hover:border-forest-300'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-forest-100 text-forest-900 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-forest-900/10 text-forest-900 text-[10px] font-bold uppercase tracking-wider font-mono">
                      {language === 'te' ? card.badgeTe : card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-ink leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs font-telugu text-forest-800 font-semibold mt-0.5">
                      {card.titleTe}
                    </p>
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {language === 'te' ? card.subtitleTe : card.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-forest-100/80 space-y-2.5">
                  <div className="text-[11px] text-ink-muted bg-forest-50/70 p-2 rounded-xl border border-forest-100">
                    <span className="font-semibold text-ink block text-[10px] uppercase tracking-wider text-forest-800">
                      Sample Registered Persona:
                    </span>
                    <span className="font-medium text-forest-900 truncate block">{card.persona}</span>
                  </div>

                  {/* Dual Action Buttons: Sign In & Sign Up */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={LogIn}
                      iconPosition="left"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAuth(card.role, 'signin');
                      }}
                    >
                      {language === 'te' ? 'లాగిన్' : 'Login'}
                    </Button>

                    {card.allowPublicSignup ? (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={UserPlus}
                        iconPosition="left"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAuth(card.role, 'signup');
                        }}
                      >
                        {language === 'te' ? 'రిజిస్టర్' : 'Signup'}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        disabled
                        className="text-xs text-ink-muted opacity-60"
                        title="Admin signup is restricted to authorized administrative invitation"
                      >
                        {language === 'te' ? 'పరిమితం' : 'Restricted'}
                      </Button>
                    )}
                  </div>

                  {/* 1-Click Direct Demo Launch */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectDemoLaunch(card.role, card.targetPath);
                    }}
                    className="w-full text-center text-xs font-semibold text-forest-800 hover:text-forest-950 hover:underline flex items-center justify-center gap-1.5 py-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>⚡ Quick Evaluator Demo →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Separate Patient Portal Link (Left Unchanged As Directed) */}
        <Card variant="flat" padding="md" className="border-rose-200 bg-rose-50/30 shadow-nature">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-800 shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink">
                  Patient & Family Portal (Citizen Self-Service)
                </h4>
                <p className="text-xs font-telugu text-rose-900 font-semibold">
                  రోగి & కుటుంబ పోర్టల్ — హెల్త్ కార్డ్ టోకెన్ లేదా కేర్‌గివర్ ద్వారా ఉచిత యాక్సెస్
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Citizens and family caregivers can view their oral screening continuum using their physical health card token. Doorstep services are provided free through village ASHA workers without requiring login.
                </p>
              </div>
            </div>

            <Link to="/patient/portal" className="shrink-0">
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                Open Patient Portal
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-xs text-ink-muted">
        <span>Aarogya Drishti • ITDA Paderu, Alluri Sitharama Raju District • Secure Role-Based Access Control</span>
      </div>

      {/* ==================== INTERACTIVE PORTAL AUTH MODAL ==================== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-nature-2xl border border-forest-200 w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Portal Identity */}
            <div className={`p-5 border-b border-forest-100 ${currentConfig.accentColor} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-forest-900 text-white shadow-sm">
                  {React.createElement(currentConfig.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-forest-900 uppercase tracking-wider">
                      {currentConfig.title}
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-forest-900/10 text-forest-900 text-[10px] font-bold">
                      {authMode === 'signin' ? 'Login' : 'Signup'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-ink">
                    {authMode === 'signin' ? `Sign In to ${currentConfig.title}` : `Register for ${currentConfig.title}`}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-ink-muted hover:text-ink hover:bg-forest-100/60 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs (If public signup is permitted) */}
            {currentConfig.allowPublicSignup && (
              <div className="grid grid-cols-2 p-2 bg-forest-50/80 border-b border-forest-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError(null);
                    setAuthSuccess(null);
                  }}
                  className={`py-2 rounded-xl text-center transition-all ${
                    authMode === 'signin'
                      ? 'bg-white text-forest-950 font-bold shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {language === 'te' ? 'లాగిన్ (Sign In)' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError(null);
                    setAuthSuccess(null);
                  }}
                  className={`py-2 rounded-xl text-center transition-all ${
                    authMode === 'signup'
                      ? 'bg-white text-forest-950 font-bold shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {language === 'te' ? 'కొత్త రిజిస్ట్రేషన్ (Sign Up)' : 'Sign Up (New User)'}
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Alert notifications */}
              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{authError}</p>
                  </div>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">{authSuccess}</p>
                  </div>
                </div>
              )}

              {/* ================= SIGN IN FORM ================= */}
              {authMode === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Demo Credential Quick-Fill Pill */}
                  <div className="flex items-center justify-between text-xs bg-forest-50 p-2.5 rounded-xl border border-forest-100">
                    <div>
                      <span className="font-semibold text-forest-950 block text-[11px]">Demo ID: {currentConfig.demoIdentifier}</span>
                      <span className="text-[10px] text-ink-muted">Password: {currentConfig.demoPassword}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleFillDemoCredentials}
                      className="px-2.5 py-1 text-xs font-bold text-forest-900 bg-white border border-forest-200 rounded-lg hover:bg-forest-100 transition-colors"
                    >
                      Auto-Fill Demo
                    </button>
                  </div>

                  {/* Identifier Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink">
                      {language === 'te' ? currentConfig.loginPlaceholderTe : currentConfig.loginPlaceholder} *
                    </label>
                    <input
                      type="text"
                      required
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      placeholder={currentConfig.loginPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30"
                    />
                  </div>

                  {/* Password Input with Show/Hide toggle */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-ink">
                        {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'} *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setForgotIdentifier(signInIdentifier);
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-forest-800 hover:text-forest-950 hover:underline"
                      >
                        {language === 'te' ? 'పాస్‌వర్డ్ మర్చిపోయారా?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-forest-200 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      loading={isSubmitting}
                      icon={LogIn}
                      iconPosition="left"
                    >
                      {language === 'te' ? 'లాగిన్ అవ్వండి' : `Log In to ${currentConfig.title}`}
                    </Button>
                  </div>
                </form>
              )}

              {/* ================= SIGN UP FORM (PORTAL SPECIFIC) ================= */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  {/* Common: Full Legal Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink">
                        {language === 'te' ? 'పూర్తి పేరు (ఇంగ్లీష్)' : 'Full Legal Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        placeholder="e.g. Dr. K. Suresh / Lakshmi Devi"
                        className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink">
                        {language === 'te' ? 'తెలుగు పేరు' : 'Name in Telugu Script'}
                      </label>
                      <input
                        type="text"
                        value={signUpData.fullNameTe}
                        onChange={(e) => setSignUpData({ ...signUpData, fullNameTe: e.target.value })}
                        placeholder="ఉదా: డా. సురేష్ / లక్ష్మి"
                        className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30 font-telugu"
                      />
                    </div>
                  </div>

                  {/* Common: Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink">
                        {language === 'te' ? 'మొబైల్ సంఖ్య' : 'Registered Mobile Number'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        placeholder="10-digit mobile (e.g. 9849012345)"
                        className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink">
                        {language === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Official Email Address'}
                      </label>
                      <input
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        placeholder="officer@asr.ap.gov.in"
                        className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30"
                      />
                    </div>
                  </div>

                  {/* ============ DOCTOR SPECIFIC FIELDS ============ */}
                  {selectedRole === 'doctor' && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                      <span className="text-[11px] font-bold text-emerald-950 block uppercase tracking-wider">
                        Doctor Professional Qualifications
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            APMC / Council Reg Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={signUpData.registrationNumber}
                            onChange={(e) => setSignUpData({ ...signUpData, registrationNumber: e.target.value })}
                            placeholder="e.g. APMC/2019/04812"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Medical Qualification *
                          </label>
                          <input
                            type="text"
                            required
                            value={signUpData.medicalQualification}
                            onChange={(e) => setSignUpData({ ...signUpData, medicalQualification: e.target.value })}
                            placeholder="MBBS / BDS / MS / MDS"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Specialization
                          </label>
                          <input
                            type="text"
                            value={signUpData.specialization}
                            onChange={(e) => setSignUpData({ ...signUpData, specialization: e.target.value })}
                            placeholder="General Medicine / Oral Oncology"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Doctor ID (If already assigned)
                          </label>
                          <input
                            type="text"
                            value={signUpData.doctorId}
                            onChange={(e) => setSignUpData({ ...signUpData, doctorId: e.target.value })}
                            placeholder="e.g. DOC-ASR-048"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ============ ASHA WORKER SPECIFIC FIELDS ============ */}
                  {selectedRole === 'asha' && (
                    <div className="p-3 bg-forest-50 rounded-xl border border-forest-200 space-y-3">
                      <span className="text-[11px] font-bold text-forest-950 block uppercase tracking-wider">
                        ASHA Frontline Accreditation Details
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Official ASHA ID *
                          </label>
                          <input
                            type="text"
                            required
                            value={signUpData.ashaId}
                            onChange={(e) => setSignUpData({ ...signUpData, ashaId: e.target.value })}
                            placeholder="e.g. ASHA-GMAD-14"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Assigned Village / Area *
                          </label>
                          <input
                            type="text"
                            required
                            value={signUpData.assignedVillage}
                            onChange={(e) => setSignUpData({ ...signUpData, assignedVillage: e.target.value })}
                            placeholder="e.g. Kothapalli Habitation"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ============ ANM SPECIFIC FIELDS ============ */}
                  {selectedRole === 'anm' && (
                    <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3">
                      <span className="text-[11px] font-bold text-teal-950 block uppercase tracking-wider">
                        ANM Sub-Centre Accreditation Details
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Official ANM ID *
                          </label>
                          <input
                            type="text"
                            required
                            value={signUpData.anmId}
                            onChange={(e) => setSignUpData({ ...signUpData, anmId: e.target.value })}
                            placeholder="e.g. ANM-GMAD-02"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Assigned Health Centre / Sub-Centre *
                          </label>
                          <input
                            type="text"
                            required
                            value={signUpData.assignedHealthCentre}
                            onChange={(e) => setSignUpData({ ...signUpData, assignedHealthCentre: e.target.value })}
                            placeholder="e.g. G. Madugula Sub-Centre"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ============ HOSPITAL COORDINATOR FIELDS ============ */}
                  {selectedRole === 'hospital_coordinator' && (
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                      <span className="text-[11px] font-bold text-blue-950 block uppercase tracking-wider">
                        Hospital Coordinator Appointment Details
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Coordinator Employee ID *
                          </label>
                          <input
                            type="text"
                            required
                            value={signUpData.hospitalCoordinatorId}
                            onChange={(e) => setSignUpData({ ...signUpData, hospitalCoordinatorId: e.target.value })}
                            placeholder="e.g. HRC-ASR-042"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-ink">
                            Hospital / Facility Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={signUpData.facilityName}
                            onChange={(e) => setSignUpData({ ...signUpData, facilityName: e.target.value })}
                            placeholder="District Hospital, Paderu"
                            className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password & Confirm Password with Show/Hide toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink">
                        {language === 'te' ? 'పాస్‌వర్డ్' : 'Create Password'} *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                          placeholder="Min 8 characters"
                          className="w-full px-3 py-2 pr-9 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink">
                        {language === 'te' ? 'పాస్‌వర్డ్ నిర్ధారించండి' : 'Confirm Password'} *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                          placeholder="Re-enter password"
                          className="w-full px-3 py-2 pr-9 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit registration button */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      loading={isSubmitting}
                      icon={UserPlus}
                      iconPosition="left"
                    >
                      {language === 'te' ? 'నమోదు సమర్పించండి' : 'Submit Registration for Verification'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== FORGOT PASSWORD MODAL ==================== */}
      {isForgotModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsForgotModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-nature-2xl border border-forest-200 w-full max-w-md overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <div className="flex items-center gap-2 text-forest-900">
                <Lock className="w-5 h-5 text-forest-800" />
                <h3 className="text-base font-bold text-ink">Account Password Recovery</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotStep === 1 ? (
                <>
                  <p className="text-xs text-ink-muted">
                    Enter your registered mobile number, Doctor ID, ASHA ID, or ANM ID. A secure verification OTP or password reset token will be dispatched.
                  </p>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink">Registered Identifier *</label>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. 9849012345 or ASHA-GMAD-01"
                      className="w-full px-3 py-2.5 rounded-xl border border-forest-200 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 bg-forest-50/30"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="md" fullWidth>
                    Send Recovery Code / OTP
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-2.5 bg-forest-50 rounded-xl border border-forest-100 text-[11px] text-forest-950">
                    <span className="font-semibold block">Demonstration OTP Token:</span>
                    <span className="font-mono font-bold text-forest-900">{forgotToken}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink">Reset Token / OTP *</label>
                    <input
                      type="text"
                      required
                      value={forgotToken}
                      onChange={(e) => setForgotToken(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs font-mono text-ink bg-forest-50/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink">New Password *</label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink bg-forest-50/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3 py-2 rounded-xl border border-forest-200 text-xs text-ink bg-forest-50/30"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="md" fullWidth>
                    Set New Password & Sign In
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
