import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  Cpu,
  RotateCcw,
  ArrowRight,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  Stethoscope,
  Layers,
  Zap,
  Info,
  ServerOff,
  Lock,
  FileCode,
  User,
  MapPin,
  Send
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';
import { getActiveScreening, saveDoctorCase } from '../../services/clinicalDataService';
import type { DoctorCase } from '../doctor/doctorData';

interface PipelineStage {
  id: number;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: 'Frontline Image Ingestion & Quality Gate',
    nameTe: 'చిత్ర సేకరణ & నాణ్యతా ధృవీకరణ',
    description: 'Validates minimum resolution (1920x1440), Laplacian focus sharpness (>80), and illumination uniformity.',
    descriptionTe: 'రిజల్యూషన్, పదును మరియు వెలుతురు నాణ్యతను తనిఖీ చేస్తుంది.',
    subtext: 'Passed: 1920x1440, Focus score: 94/100, Lighting: Uniform',
    icon: Layers,
  },
  {
    id: 2,
    name: 'Image Preprocessing & Normalization',
    nameTe: 'చిత్ర ప్రాసెసింగ్ & కాంట్రాస్ట్ సమానత్వం',
    description: 'Applies Contrast Limited Adaptive Histogram Equalization (CLAHE) and mucosal surface color calibration.',
    descriptionTe: 'స్పష్టమైన పరిశీలన కొరకు రంగులు మరియు కాంట్రాస్ట్ సర్దుబాటు చేస్తుంది.',
    subtext: 'CLAHE applied: Clip limit 2.0, Tile grid 8x8',
    icon: Sparkles,
  },
  {
    id: 3,
    name: 'Feature Map Extraction (Mock Backbone)',
    nameTe: 'ఫీచర్ మ్యాప్ ఎక్స్‌ట్రాక్షన్ (పరిశోధనా మోడల్)',
    description: 'Quantized convolutional neural network extracts 1,280 low-level mucosal texture and border gradient features.',
    descriptionTe: 'కణజాల అమరిక మరియు సరిహద్దు మార్పులను గుర్తిస్తుంది.',
    subtext: 'Architecture: mock-v1-efficientnet-b0 (Edge Optimized)',
    icon: Cpu,
  },
  {
    id: 4,
    name: 'Non-Clinical Research Classification',
    nameTe: 'నాన్-క్లినికల్ పరిశోధనా వర్గీకరణ',
    description: 'Tags image with structured demonstration label. Numerical clinical probabilities are strictly prohibited.',
    descriptionTe: 'పరిశోధనా ప్రదర్శన ట్యాగ్ కేటాయించబడుతుంది. క్యాన్సర్ శాతం ఇవ్వబడదు.',
    subtext: 'Research Flag: suspicious_example | Score: null (Prohibited)',
    icon: Zap,
  },
  {
    id: 5,
    name: 'Mandatory Medical Officer Review Gate',
    nameTe: 'వైద్యుల పరిశీలన తప్పనిసరి ప్రక్రియ',
    description: 'Confirms clinician review requirement flag and routes directly to PHC Medical Officer triage queue.',
    descriptionTe: 'వైద్య అధికారి స్వతంత్ర భౌతిక పరీక్ష కొరకు కేసును పంపుతుంది.',
    subtext: 'requires_clinician_review: true | Forwarded to Dr. Suresh (PHC)',
    icon: Stethoscope,
  },
];

export const AiResearchDemoPage: React.FC = () => {
  const { language } = useTranslation();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const activeScreening = getActiveScreening();

  // Resolve active patient details
  const currentPatient = navState.patient || activeScreening?.patient || {
    id: 'ASR-PAT-2026-0842',
    name: 'Kondala Rao',
    nameTe: 'కొండల రావు',
    age: 46,
    gender: 'Male',
    habitation: 'Kothapalli',
    mandal: 'G. Madugula',
    gramPanchayat: 'Kothapalli',
  };

  // Resolve uploaded frontline image
  const uploadedImage =
    navState.activeImage ||
    activeScreening?.activeImageUrl ||
    ((navState.capturedViews && Object.values(navState.capturedViews)[0]) as any)?.url ||
    ((activeScreening?.capturedImages && Object.values(activeScreening.capturedImages)[0]) as any)?.url;

  const activeViewKey: string = navState.activeViewKey || 'tongue';
  const screeningHabits = navState.screeningData?.habits || activeScreening?.habits;
  const screeningSymptoms = navState.screeningData?.symptoms || activeScreening?.symptoms;
  const workerNotes = navState.screeningData?.workerNotes || activeScreening?.workerNotes;

  const hasCurrentPatient = Boolean(uploadedImage || (currentPatient && currentPatient.id !== 'ASR-PAT-2026-0842') || navState.patient);

  // Demonstration Case selection: default to current patient if active screening/image exists
  const [selectedCase, setSelectedCase] = useState<'current_patient' | 'case_a' | 'case_b'>(
    hasCurrentPatient ? 'current_patient' : 'case_a'
  );

  const [escalatedCaseId, setEscalatedCaseId] = useState<string | null>(null);
  const [escalatedSuccess, setEscalatedSuccess] = useState<boolean>(false);

  // Pipeline simulation state
  const [currentStep, setCurrentStep] = useState<number>(5);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Service Failure Simulation toggle
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  // Photographic overlay toggles
  const [showAttentionOverlay, setShowAttentionOverlay] = useState<boolean>(true);
  const [showPreprocessed, setShowPreprocessed] = useState<boolean>(false);
  
  // Raw JSON Copy state
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Run pipeline step-by-step
  const runPipeline = () => {
    setIsProcessing(true);
    setCurrentStep(1);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setIsProcessing(false);
          return 5;
        }
        return prev + 1;
      });
    }, 450);
  };

  useEffect(() => {
    // Initial run on mount or case switch
    runPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCase, simulateFailure]);

  const handleEscalateToDoctor = () => {
    const doctorCaseId = currentPatient.id.startsWith('ASR-PAT-')
      ? currentPatient.id.replace('ASR-PAT-', 'SCR-')
      : `SCR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const mappedGender: 'male' | 'female' | 'other' = 
      String(currentPatient.gender || 'male').toLowerCase() === 'female' ? 'female' : 'male';

    const validViewKey: 'right_cheek' | 'left_cheek' | 'tongue' | 'palate' | 'gums_floor' =
      ['right_cheek', 'left_cheek', 'tongue', 'palate', 'gums_floor'].includes(activeViewKey)
        ? (activeViewKey as any)
        : 'right_cheek';

    const newDoctorCase: DoctorCase = {
      id: doctorCaseId,
      patientId: currentPatient.id || currentPatient.uniquePatientId || 'ASR-PAT-2026-0842',
      patientName: currentPatient.name || 'Registered Citizen',
      patientNameTe: currentPatient.nameTe || currentPatient.name,
      age: Number(currentPatient.age) || 40,
      gender: mappedGender,
      habitation: currentPatient.habitation || 'Kothapalli',
      mandal: currentPatient.mandal || 'G. Madugula',
      gramPanchayat: currentPatient.gramPanchayat || 'Kothapalli',
      healthWorkerName: 'Lakshmi Devi (ASHA Worker)',
      screeningDate: new Date().toISOString().split('T')[0],
      triagePriority: 'HIGH_PRIORITY',
      status: 'NEW',
      complaint: 'Oral mucosal screening assessment',
      complaintTe: 'నోటి భాగంలో మార్పుల పరిశీలన',
      duration: '3 weeks',
      tobaccoHistory: screeningHabits?.chewingTobacco ? 'Daily Gutkha Chewing' : 'None',
      reverseSmoking: Boolean(screeningHabits?.reverseSmoking),
      trismusFingers: String(screeningSymptoms?.mouthFingers || '3.0'),
      burningSensation: Boolean(screeningSymptoms?.burningSensation),
      images: [
        {
          id: 'img-1',
          viewKey: validViewKey,
          viewName: activeViewKey === 'tongue' ? 'Tongue (Dorsum & Lateral)' : activeViewKey === 'right_cheek' ? 'Right Buccal Mucosa' : activeViewKey.replace('_', ' '),
          viewNameTe: activeViewKey === 'tongue' ? 'నాలుక ఉపరితలం & ప్రక్క భాగాలు' : 'కుడి దవడ లోపలి భాగం',
          url: uploadedImage || '/images/sample_oral_patch.jpg',
          quality: 'acceptable',
          sharpnessScore: 94,
          lightingScore: 88,
          resolution: '1920x1440',
        }
      ],
      aiDemoOutput: {
        modelVersion: 'mock-v1-efficientnet-b0',
        provider: 'mock',
        researchLabel: 'suspicious_example',
        score: null,
        isClinical: false,
        disclaimer: 'NOT FOR CLINICAL USE - RESEARCH DEMONSTRATION ONLY',
      },
    };

    saveDoctorCase(newDoctorCase);
    setEscalatedCaseId(doctorCaseId);
    setEscalatedSuccess(true);
  };

  // Demonstration payload based on active case
  const isCurrent = selectedCase === 'current_patient';
  const isCaseA = selectedCase === 'case_a';

  const activeImageSrc = isCurrent
    ? (uploadedImage || '/images/sample_oral_patch.jpg')
    : isCaseA
    ? '/images/sample_oral_patch.jpg'
    : '/images/sample_oral_tongue.jpg';

  const activeViewName = isCurrent
    ? `${currentPatient.name} — Frontline Intraoral Photograph (${activeViewKey.replace('_', ' ').toUpperCase()})`
    : isCaseA
    ? 'Right Buccal Mucosa (Inner Cheek)'
    : 'Dorsum of Tongue (Normal Control)';

  const activeViewNameTe = isCurrent
    ? `${currentPatient.nameTe || currentPatient.name} - అప్‌లోడ్ చేసిన చిత్రం`
    : isCaseA
    ? 'కుడి దవడ లోపలి భాగం (తెల్లటి మచ్చ)'
    : 'నాలుక పైభాగం (సాధారణ కణజాలం)';

  const syntheticPayload = {
    analysis_id: isCurrent ? `LIVE-AI-${currentPatient.id.slice(-4)}` : isCaseA ? 'DEMO-AI-009' : 'DEMO-AI-010',
    screening_id: isCurrent ? currentPatient.id.replace('ASR-PAT-', 'SCR-') : 'SCR-2026-0042',
    patient_name: isCurrent ? currentPatient.name : isCaseA ? 'Kondala Rao' : 'Normal Control Patient',
    patient_id: isCurrent ? currentPatient.id : isCaseA ? 'ASR-PAT-2026-0842' : 'ASR-PAT-2026-0105',
    habitation: isCurrent ? currentPatient.habitation : 'Kothapalli',
    mandal: isCurrent ? currentPatient.mandal : 'G. Madugula',
    timestamp: new Date().toISOString(),
    image_quality: 'acceptable',
    provider: 'mock',
    model_version: 'mock-v1-efficientnet-b0',
    research_label: isCurrent || isCaseA ? 'suspicious_example' : 'benign_example',
    score: null,
    clinical_use: false,
    requires_clinician_review: true,
    warning: 'NOT FOR CLINICAL USE - RESEARCH DEMONSTRATION ONLY',
    disclaimer_te: 'క్లినికల్ నిర్ధారణ కొరకు కాదు — పరిశోధనా ప్రదర్శన మాత్రమే',
    technical_metadata: {
      resolution: '1920x1440',
      sharpness_laplacian: isCurrent ? 95 : isCaseA ? 94 : 91,
      exposure_score: 88,
      glare_percentage: 12,
      latency_ms: 388,
    },
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(syntheticPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/health-worker" className="hover:underline">Health Worker Hub</Link>
            <span>/</span>
            <Link to="/health-worker/screening/camera" className="hover:underline">Guided Camera</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">AI Research Demonstration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            AI Research Demonstration Gateway
            <span className="text-sm font-normal text-ink-muted">
              (కేసు ID: {syntheticPayload.screening_id})
            </span>
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Non-clinical algorithmic demonstration pipeline for frontline visual screening in ASR District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge 
            label="RESEARCH DEMO ONLY" 
            labelTe="పరిశోధన ప్రదర్శన మాత్రమే" 
            variant="warning" 
            size="md" 
            icon={ShieldAlert}
          />
        </div>
      </div>

      {/* ACTIVE PATIENT CREDENTIALS & CLINICAL PROBLEM DETAILS CARD */}
      <Card padding="md" className="border-forest-300 bg-gradient-to-br from-forest-50/70 to-white shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-3 border-b border-forest-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-ink">
                  {currentPatient.name}
                  {currentPatient.nameTe && <span className="font-telugu text-sm text-forest-800 ml-1.5">({currentPatient.nameTe})</span>}
                </h2>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 border border-forest-200">
                  {currentPatient.id}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {currentPatient.age} yrs • {currentPatient.gender}
                </span>
                {uploadedImage && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Custom Frontline Photo Attached
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-1">
                <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                <span>{currentPatient.habitation || 'Kothapalli'}, {currentPatient.mandal || 'G. Madugula'} Mandal (ASR District)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            {escalatedSuccess ? (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Case {escalatedCaseId} Saved & Escalated to Dr. Suresh!</span>
                <Link to="/doctor/cases" className="underline font-bold text-emerald-900 ml-1 hover:text-emerald-950">
                  Open in Doctor Workstation →
                </Link>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                onClick={handleEscalateToDoctor}
                className="shadow-sm w-full lg:w-auto"
              >
                Save & Escalate Case to Medical Officer (Dr. Suresh)
              </Button>
            )}
          </div>
        </div>

        {/* Clinical Problem Details Recorded at Intake */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-forest-200 shadow-2xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest-800 font-bold block mb-1">
              Habits History (అలవాట్లు)
            </span>
            <div className="space-y-0.5 text-ink">
              <div>• Tobacco Chewing: <strong>{screeningHabits?.chewingTobacco ? 'Yes (Daily)' : 'None'}</strong> {screeningHabits?.chewingYears ? `(${screeningHabits.chewingYears} yrs)` : ''}</div>
              <div>• Smoking: <strong>{screeningHabits?.smoking ? 'Yes' : 'None'}</strong> | Reverse Smoking: <strong>{screeningHabits?.reverseSmoking ? 'Yes' : 'No'}</strong></div>
              <div>• Alcohol Intake: <strong>{screeningHabits?.alcohol ? 'Regular' : 'None'}</strong></div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-forest-200 shadow-2xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest-800 font-bold block mb-1">
              Reported Symptoms (లక్షణాలు)
            </span>
            <div className="space-y-0.5 text-ink">
              <div>• Mucosal Patch: <strong>{screeningSymptoms?.persistentPatch ? 'Yes (White/Red Plaque)' : 'None'}</strong></div>
              <div>• Burning Sensation: <strong>{screeningSymptoms?.burningSensation ? 'Yes on Spicy Food' : 'None'}</strong></div>
              <div>• Inter-incisal Opening: <strong>{screeningSymptoms?.mouthFingers ? `${screeningSymptoms.mouthFingers} Fingers` : '3.0 Fingers'}</strong></div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-forest-200 shadow-2xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest-800 font-bold block mb-1">
              Frontline Worker Assessment Note
            </span>
            <p className="text-ink-muted text-[11px] leading-relaxed line-clamp-3 italic">
              "{workerNotes || 'Patient screening recorded during frontline village intake. Real intraoral photographic protocol verified. Packaged for independent medical review.'}"
            </p>
          </div>
        </div>
      </Card>

      {/* NON-NEGOTIABLE CLINICAL SAFETY BANNER */}
      <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-200/80 border border-amber-400 flex items-center justify-center shrink-0 text-amber-900 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-amber-950 uppercase tracking-wide">
                NOT FOR CLINICAL USE — RESEARCH DEMONSTRATION PROTOTYPE ONLY
              </h2>
              <span className="bg-amber-200 text-amber-900 text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                NON-DIAGNOSTIC
              </span>
            </div>
            <p className="text-xs font-telugu font-semibold text-amber-900">
              క్లినికల్ నిర్ధారణ కొరకు కాదు — ప్రయోగాత్మక పరిశోధనా ప్రదర్శన మాత్రమే.
            </p>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              This machine learning interface is an experimental research module intended strictly for workflow simulation and engineering evaluation.
              It <strong>NEVER</strong> diagnoses oral cancer, <strong>NEVER</strong> rules out malignancy, does not provide reassurance, and cannot replace direct physical examination by a registered Medical Officer.
            </p>
          </div>
        </div>

        {/* 4 Pillars of Clinical Safety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-amber-200/70 text-xs">
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-800 shrink-0" />
            <span className="text-amber-950 font-medium">Never Diagnoses Disease</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-800 shrink-0" />
            <span className="text-amber-950 font-medium">No Cancer Probabilities</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-forest-800 shrink-0" />
            <span className="text-amber-950 font-medium">Doctor Retains Full Authority</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-forest-800 shrink-0" />
            <span className="text-amber-950 font-medium">Resilient Without AI</span>
          </div>
        </div>
      </div>

      {/* DEMONSTRATION TOOLBAR */}
      <Card padding="md" className="border-forest-200 bg-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Case Switcher */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
              Select Clinical Demonstration Case:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedCase('current_patient')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  selectedCase === 'current_patient'
                    ? 'bg-forest-800 text-white border-forest-900 shadow-sm'
                    : 'bg-white text-ink border-forest-200 hover:bg-forest-50'
                }`}
              >
                <span>⭐ Current Patient: {currentPatient.name} ({currentPatient.age}{currentPatient.gender?.charAt(0) || 'M'})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCase('case_a')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedCase === 'case_a'
                    ? 'bg-forest-800 text-white border-forest-900 shadow-sm'
                    : 'bg-white text-ink border-forest-200 hover:bg-forest-50'
                }`}
              >
                Case A: Kondala Rao 46M (Right Buccal Lesion)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCase('case_b')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedCase === 'case_b'
                    ? 'bg-forest-800 text-white border-forest-900 shadow-sm'
                    : 'bg-white text-ink border-forest-200 hover:bg-forest-50'
                }`}
              >
                Case B: Normal Control (Dorsum of Tongue)
              </button>
            </div>
          </div>

          {/* Service Failure Simulation & Re-run */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer bg-forest-50 px-3 py-1.5 rounded-lg border border-forest-200">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="w-4 h-4 text-forest-800 rounded focus:ring-forest-500"
              />
              <span className="text-forest-950 font-medium">Simulate AI Server Offline (HTTP 503)</span>
            </label>

            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={runPipeline}
              disabled={isProcessing}
            >
              Re-run Pipeline
            </Button>
          </div>

        </div>
      </Card>

      {/* 5-STAGE PROCESSING VISUALIZER */}
      <Card padding="lg" className="border-forest-200 bg-white space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800">
              Pipeline Architecture
            </span>
            <h3 className="text-base font-bold text-ink">
              5-Stage Processing Visualizer
            </h3>
          </div>
          <span className="text-xs font-mono text-ink-muted">
            {isProcessing ? 'Processing stages in real-time...' : 'All pipeline gates satisfied'}
          </span>
        </div>

        {/* Stepper Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {PIPELINE_STAGES.map((stage) => {
            const isCompleted = currentStep > stage.id || (!isProcessing && currentStep === 5);
            const isCurrent = currentStep === stage.id && isProcessing;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  simulateFailure && stage.id >= 3
                    ? 'bg-red-50/70 border-red-200 text-red-900'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : isCurrent
                    ? 'bg-forest-100 border-forest-500 text-forest-950 ring-2 ring-forest-400 shadow-sm'
                    : 'bg-forest-50/40 border-forest-200 text-ink-muted opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center bg-white border border-forest-300">
                    {stage.id}
                  </span>
                  {simulateFailure && stage.id >= 3 ? (
                    <ServerOff className="w-4 h-4 text-red-600" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Icon className="w-4 h-4 text-forest-800 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-forest-600" />
                  )}
                </div>

                <h4 className="text-xs font-bold leading-tight mb-1">
                  {stage.name}
                </h4>
                {language === 'te' && (
                  <p className="text-[11px] font-telugu font-medium text-forest-800 mb-1">
                    {stage.nameTe}
                  </p>
                )}

                <p className="text-[11px] text-ink-muted line-clamp-2 leading-relaxed">
                  {stage.description}
                </p>

                <div className="mt-2 pt-2 border-t border-forest-200/50 text-[10px] font-mono text-forest-800 truncate">
                  {simulateFailure && stage.id >= 3 ? 'Status: Service Offline (503)' : stage.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* GRACEFUL FAILURE SIMULATION NOTICE (If toggled) */}
      {simulateFailure && (
        <Alert 
          type="warning" 
          title="AI Service Demonstration Unavailable (Simulation Active)" 
          titleTe="AI సర్వీస్ అందుబాటులో లేదు (అనుకరణ)"
        >
          <div className="space-y-1 text-xs">
            <p>
              The remote non-clinical AI model server returned an HTTP 503 error (Simulated Offline/Poor Connectivity).
            </p>
            <p className="font-semibold text-amber-950">
              Zero Patient Impact — Workflow Resiliency Active: Primary frontline screening, symptoms checklist, and oral photographs are safely preserved locally and will be reviewed directly by Dr. K. Suresh (PHC G. Madugula).
            </p>
          </div>
        </Alert>
      )}

      {/* SPLIT INSPECTION SECTION: PHOTOGRAPHY VS RESEARCH PAYLOAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Examination Photo & Framing Reticle */}
        <div className="lg:col-span-6 space-y-4">
          <Card padding="md" className="border-forest-200 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-forest-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800">
                  Frontline Clinical Photograph
                </span>
                <h3 className="text-sm font-bold text-ink">
                  {activeViewName}
                </h3>
                <p className="text-xs font-telugu text-forest-800">
                  {activeViewNameTe}
                </p>
              </div>

              {/* Photographic Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowAttentionOverlay(!showAttentionOverlay)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    showAttentionOverlay
                      ? 'bg-forest-100 border-forest-300 text-forest-900'
                      : 'bg-white border-forest-200 text-ink-muted hover:bg-forest-50'
                  }`}
                  title="Toggle Research Attention Reticle"
                >
                  {showAttentionOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">Attention Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreprocessed(!showPreprocessed)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    showPreprocessed
                      ? 'bg-forest-100 border-forest-300 text-forest-900'
                      : 'bg-white border-forest-200 text-ink-muted hover:bg-forest-50'
                  }`}
                  title="Toggle CLAHE Enhancement"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{showPreprocessed ? 'Enhanced' : 'Natural'}</span>
                </button>
              </div>
            </div>

            {/* Photo Viewport with Framing Reticle */}
            <div className="relative mt-4 aspect-4/3 rounded-xl overflow-hidden bg-forest-950 flex items-center justify-center">
              <img
                src={activeImageSrc}
                alt={activeViewName}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  showPreprocessed ? 'contrast-125 saturate-110' : ''
                }`}
              />

              {/* Research Attention Reticle */}
              {(isCaseA || isCurrent) && showAttentionOverlay && !simulateFailure && (
                <div 
                  className="absolute border-2 border-amber-400 bg-amber-400/15 rounded-lg animate-pulse"
                  style={{ top: '32%', left: '34%', width: '32%', height: '34%' }}
                >
                  <div className="absolute -top-6 left-0 bg-amber-500 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase shadow">
                    Attention Region ({isCurrent ? 'Focal Lesion Demarcation' : 'Hyperkeratotic Patch'})
                  </div>
                </div>
              )}

              {/* Natural / Enhanced Pill */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-md text-[11px] text-white font-mono flex items-center gap-2">
                <span>View: {isCurrent ? (uploadedImage ? 'Uploaded Frontline Photo' : 'Frontline Capture') : showPreprocessed ? 'CLAHE Enhanced' : 'Raw Frontline Capture'}</span>
                <span>•</span>
                <span>1920 x 1440</span>
              </div>
            </div>

            <p className="text-[11px] text-ink-muted mt-3 italic text-center">
              * Attention overlay illustrates neural feature clustering. It does not represent an anatomical lesion margin or diagnostic boundary.
            </p>
          </Card>
        </div>

        {/* Right Column: Model Output & Clinical Isolation */}
        <div className="lg:col-span-6 space-y-4">
          <Card padding="md" className="border-forest-200 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-forest-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800">
                  Model Output Payload
                </span>
                <h3 className="text-sm font-bold text-ink">
                  Structured Algorithmic Findings
                </h3>
              </div>
              <Badge
                label={simulateFailure ? 'SERVICE_UNAVAILABLE' : (isCaseA || isCurrent) ? 'SUSPICIOUS_EXAMPLE' : 'BENIGN_EXAMPLE'}
                variant={simulateFailure ? 'danger' : (isCaseA || isCurrent) ? 'warning' : 'success'}
                size="md"
              />
            </div>

            {/* Key Field Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-forest-50 border border-forest-200">
                <span className="text-ink-muted text-[11px] block">Model Version</span>
                <span className="font-mono font-bold text-ink">{syntheticPayload.model_version}</span>
              </div>

              <div className="p-3 rounded-xl bg-forest-50 border border-forest-200">
                <span className="text-ink-muted text-[11px] block">Provider</span>
                <span className="font-mono font-bold text-ink">
                  {syntheticPayload.provider} (Research Adapter)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-forest-50 border border-forest-200">
                <span className="text-ink-muted text-[11px] block">Diagnostic Score</span>
                <span className="font-mono font-bold text-amber-900">
                  null (Strictly Prohibited)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-forest-50 border border-forest-200">
                <span className="text-ink-muted text-[11px] block">Clinical Use Flag</span>
                <span className="font-mono font-bold text-red-700">
                  false (Prohibited)
                </span>
              </div>
            </div>

            {/* Strict Separation Callout */}
            <div className="p-3.5 rounded-xl bg-forest-100/60 border border-forest-300 text-xs text-forest-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-forest-900">
                <Info className="w-4 h-4 text-forest-800" />
                <span>Strict Separation from Doctor Observations</span>
              </div>
              <p className="leading-relaxed">
                Under no circumstances does this research model pre-fill clinical impression fields or dictate patient management.
                Dr. K. Suresh (Medical Officer, PHC G. Madugula) conducts an independent physical examination and enters uninfluenced clinical notes.
              </p>
            </div>

            {/* Technical JSON Inspector */}
            <div className="border border-forest-200 rounded-xl overflow-hidden">
              <div className="bg-forest-900 px-4 py-2 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2 font-mono">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>API Response: POST /ai/analyze</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-forest-800 hover:bg-forest-700 text-[11px] transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-3 bg-forest-950 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                {JSON.stringify(syntheticPayload, null, 2)}
              </pre>
            </div>

          </Card>
        </div>

      </div>

      {/* FORWARD WORKFLOW CONTINUATION GATEWAY (Bridge to Phase 8) */}
      <Card padding="lg" className="border-forest-300 bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest-800">
                Workflow Complete: Screening & Demonstration Packaged
              </span>
            </div>
            <h3 className="text-base font-bold text-ink">
              Ready for Medical Officer Review & Independent Assessment (Phase 8)
            </h3>
            <p className="text-xs text-ink-muted">
              Patient {currentPatient.name} ({currentPatient.id})'s records, uploaded intraoral photograph, clinical symptoms, and research tags are synchronized for PHC G. Madugula.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/health-worker/screening/camera" className="w-full md:w-auto">
              <Button variant="outline" size="md" fullWidth>
                Back to Camera
              </Button>
            </Link>

            <Link to="/doctor/cases" className="w-full md:w-auto">
              <Button 
                variant="primary" 
                size="md" 
                icon={ArrowRight} 
                iconPosition="right" 
                fullWidth
              >
                Proceed to Doctor Review (Phase 8)
              </Button>
            </Link>
          </div>
        </div>
      </Card>

    </div>
  );
};
