import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Layers,
  Cpu,
  Stethoscope,
  Sparkles,
  RotateCcw,
  Send,
  Languages,
  ExternalLink,
  Eye,
  Info,
  UploadCloud,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  FileText,
  Activity,
  Check,
  User,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';
import { getActiveScreening, saveDoctorCase } from '../../services/clinicalDataService';
import type { DoctorCase } from '../doctor/doctorData';

const SESSION_STORAGE_KEY = 'aarogya_medgemma_workstation_session';

interface QualityAudit {
  verdict: 'ACCEPTABLE' | 'RECAPTURE_REQUIRED';
  sharpnessScore: number;
  brightnessScore: number;
  glareScore: number;
  resolution: string;
  automatedFeedbackEn: string;
  automatedFeedbackTe: string;
  issues: string[];
}

export const MedGemmaPage: React.FC = () => {
  const { language: systemLang } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active language toggle within workstation (English vs Telugu)
  const [lang, setLang] = useState<'en' | 'te'>(systemLang === 'te' ? 'te' : 'en');

  // Backend connection status
  const [serviceStatus, setServiceStatus] = useState<{
    online: boolean;
    mode: string;
    model: string;
    parameters: string;
    modelLoaded: boolean;
  }>({
    online: false,
    mode: 'Checking...',
    model: 'google/medgemma-1.5-4b-it',
    parameters: '4.2B',
    modelLoaded: false,
  });

  // Patient context
  const activeScreening = getActiveScreening();
  const [patientName, setPatientName] = useState<string>(activeScreening?.patient?.name || 'Kondala Rao');
  const [patientId, setPatientId] = useState<string>(activeScreening?.patient?.id || 'ASR-PAT-2026-0842');
  const [patientAge, setPatientAge] = useState<number>(activeScreening?.patient?.age || 46);
  const [anatomicalSite, setAnatomicalSite] = useState<string>('Right Buccal Mucosa');
  
  // Habits & symptoms
  const [habits, setHabits] = useState<{
    chewingTobacco: boolean;
    smoking: boolean;
    reverseSmoking: boolean;
    alcohol: boolean;
    betelQuid: boolean;
  }>({
    chewingTobacco: true,
    smoking: false,
    reverseSmoking: false,
    alcohol: false,
    betelQuid: true,
  });

  const [symptoms, setSymptoms] = useState<{
    whiteRedPatch: boolean;
    burningSensation: boolean;
    mouthOpeningRestricted: boolean;
    nonHealingUlcer: boolean;
    induration: boolean;
  }>({
    whiteRedPatch: true,
    burningSensation: true,
    mouthOpeningRestricted: false,
    nonHealingUlcer: false,
    induration: false,
  });

  const [clinicalNotes, setClinicalNotes] = useState<string>(
    'Non-scrapable thick white patch on right buccal mucosa for > 3 weeks; mild burning sensation with spicy food.'
  );

  // Photographic state
  const [imageSrc, setImageSrc] = useState<string>('/images/sample_oral_patch.jpg');
  const [imageMeta, setImageMeta] = useState<{ name: string; size: string }>({
    name: 'sample_oral_patch.jpg (Case A Preset)',
    size: '584 KB',
  });
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Inference state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [qualityData, setQualityData] = useState<QualityAudit | null>(null);
  const [findings, setFindings] = useState<any | null>(null);

  // Escalation state
  const [escalatedCaseId, setEscalatedCaseId] = useState<string | null>(null);
  const [escalatedSuccess, setEscalatedSuccess] = useState<boolean>(false);

  // Check backend status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/medgemma/status');
        if (res.ok) {
          const data = await res.json();
          setServiceStatus({
            online: true,
            mode: data.mode || 'CLINICAL_DECISION_SUPPORT_FALLBACK',
            model: data.model || 'google/medgemma-1.5-4b-it',
            parameters: data.parameters || '4.2B',
            modelLoaded: data.modelLoaded === true,
          });
          return;
        }
      } catch {
        // Try direct port 8002 fallback
        try {
          const fallbackRes = await fetch('http://127.0.0.1:8002/status');
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            setServiceStatus({
              online: true,
              mode: data.mode || 'CLINICAL_DECISION_SUPPORT_FALLBACK',
              model: data.model || 'google/medgemma-1.5-4b-it',
              parameters: data.parameters || '4.2B',
              modelLoaded: data.modelLoaded === true,
            });
            return;
          }
        } catch {
          // ignore
        }
      }
      setServiceStatus((prev) => ({ ...prev, online: false, mode: 'Offline' }));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.imageSrc) setImageSrc(parsed.imageSrc);
        if (parsed.imageMeta) setImageMeta(parsed.imageMeta);
        if (parsed.patientName) setPatientName(parsed.patientName);
        if (parsed.patientId) setPatientId(parsed.patientId);
        if (parsed.patientAge) setPatientAge(parsed.patientAge);
        if (parsed.anatomicalSite) setAnatomicalSite(parsed.anatomicalSite);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.symptoms) setSymptoms(parsed.symptoms);
        if (parsed.clinicalNotes) setClinicalNotes(parsed.clinicalNotes);
        if (parsed.qualityData) setQualityData(parsed.qualityData);
        if (parsed.findings) setFindings(parsed.findings);
        if (parsed.escalatedCaseId) setEscalatedCaseId(parsed.escalatedCaseId);
      }
    } catch (e) {
      console.warn('Failed to restore MedGemma session', e);
    }
  }, []);

  // Auto-persist session to localStorage whenever key states update
  useEffect(() => {
    try {
      const session = {
        imageSrc,
        imageMeta,
        patientName,
        patientId,
        patientAge,
        anatomicalSite,
        habits,
        symptoms,
        clinicalNotes,
        qualityData,
        findings,
        escalatedCaseId,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to persist MedGemma session', e);
    }
  }, [
    imageSrc,
    imageMeta,
    patientName,
    patientId,
    patientAge,
    anatomicalSite,
    habits,
    symptoms,
    clinicalNotes,
    qualityData,
    findings,
    escalatedCaseId,
  ]);

  // Handle Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setAnalysisError('Please choose an image file smaller than 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageSrc(reader.result);
        setImageMeta({
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
        });
        setFindings(null);
        setQualityData(null);
        setEscalatedSuccess(false);
        setAnalysisError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset Selectors
  const loadPresetCaseA = () => {
    setImageSrc('/images/sample_oral_patch.jpg');
    setImageMeta({ name: 'sample_oral_patch.jpg (Case A: Buccal Leukoplakia)', size: '584 KB' });
    setAnatomicalSite('Right Buccal Mucosa');
    setPatientAge(46);
    setHabits({
      chewingTobacco: true,
      smoking: false,
      reverseSmoking: false,
      alcohol: false,
      betelQuid: true,
    });
    setSymptoms({
      whiteRedPatch: true,
      burningSensation: true,
      mouthOpeningRestricted: false,
      nonHealingUlcer: false,
      induration: false,
    });
    setClinicalNotes('Non-scrapable thick white patch on right buccal mucosa for > 3 weeks; mild burning sensation with spicy food.');
    setFindings(null);
    setQualityData(null);
    setEscalatedSuccess(false);
    setAnalysisError(null);
  };

  const loadPresetCaseB = () => {
    setImageSrc('/images/sample_oral_tongue.jpg');
    setImageMeta({ name: 'sample_oral_tongue.jpg (Case B: Normal Control)', size: '636 KB' });
    setAnatomicalSite('Dorsum of Tongue');
    setPatientAge(32);
    setHabits({
      chewingTobacco: false,
      smoking: false,
      reverseSmoking: false,
      alcohol: false,
      betelQuid: false,
    });
    setSymptoms({
      whiteRedPatch: false,
      burningSensation: false,
      mouthOpeningRestricted: false,
      nonHealingUlcer: false,
      induration: false,
    });
    setClinicalNotes('Routine oral visual checkup. Normal lingual mucosal appearance without lesions.');
    setFindings(null);
    setQualityData(null);
    setEscalatedSuccess(false);
    setAnalysisError(null);
  };

  const resetAll = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setImageSrc('/images/sample_oral_patch.jpg');
    setImageMeta({ name: 'sample_oral_patch.jpg', size: '584 KB' });
    setFindings(null);
    setQualityData(null);
    setEscalatedSuccess(false);
    setEscalatedCaseId(null);
    setAnalysisError(null);
  };

  // Execute Analysis
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setEscalatedSuccess(false);

    try {
      // 1. Resolve image as base64
      let base64Payload = imageSrc;
      if (!imageSrc.startsWith('data:image')) {
        const imgRes = await fetch(imageSrc);
        const blob = await imgRes.blob();
        base64Payload = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = reject;
          r.readAsDataURL(blob);
        });
      }

      // 2. Build history string
      const habitList: string[] = [];
      if (habits.chewingTobacco) habitList.push('Daily gutkha/tobacco chewing');
      if (habits.smoking) habitList.push('Combustible bidi/cigarette smoking');
      if (habits.reverseSmoking) habitList.push('Reverse chutta smoking');
      if (habits.alcohol) habitList.push('Alcohol intake');
      if (habits.betelQuid) habitList.push('Betel quid / paan chewing');

      const symptomList: string[] = [];
      if (symptoms.whiteRedPatch) symptomList.push('Persistent non-scrapable mucosal patch');
      if (symptoms.burningSensation) symptomList.push('Burning sensation on spicy foods');
      if (symptoms.mouthOpeningRestricted) symptomList.push('Restricted inter-incisal mouth opening (< 3 fingers)');
      if (symptoms.nonHealingUlcer) symptomList.push('Non-healing ulceration (> 14 days)');
      if (symptoms.induration) symptomList.push('Induration/hardness on palpation');

      const historyString = `${habitList.join(', ')}. Symptoms: ${symptomList.join(', ')}. Notes: ${clinicalNotes}`;

      const payload = {
        imageBase64: base64Payload,
        site: anatomicalSite,
        history: historyString,
        age: Number(patientAge) || 45,
        patientName: patientName,
        screeningId: patientId,
      };

      // 3. Dispatch to MedGemma API
      let response: Response | null = null;
      try {
        response = await fetch('/medgemma/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(60000),
        });
      } catch {
        // Fallback to direct port 8002
        response = await fetch('http://127.0.0.1:8002/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(60000),
        });
      }

      if (!response || !response.ok) {
        throw new Error(`Inference engine returned HTTP ${response?.status || 500}`);
      }

      const data = await response.json();
      setQualityData(data.opencvQuality || null);
      setFindings(data.findings || null);
    } catch (err: any) {
      console.error('MedGemma analysis failure:', err);
      setAnalysisError(err.message || 'Unable to complete MedGemma inference. Verify that the AI service daemon is active on port 8002.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Escalate to Doctor Review
  const handleEscalateToDoctor = () => {
    if (!findings) return;

    const doctorCaseId = `MEDGEMMA-${Date.now().toString().slice(-6)}`;
    const isHighPriority =
      findings.triageTier?.includes('Tier 1') ||
      findings.standardCategory === 'Category D' ||
      findings.basicClinicalAnswer?.heroCategoryEn?.includes('Potentially Malignant');

    const newDoctorCase: DoctorCase = {
      id: doctorCaseId,
      patientId: patientId || 'ASR-PAT-2026-0842',
      patientName: patientName || 'Kondala Rao',
      patientNameTe: lang === 'te' ? 'కొండల రావు' : undefined,
      age: Number(patientAge) || 46,
      gender: 'male',
      habitation: 'Kothapalli',
      mandal: 'G. Madugula',
      gramPanchayat: 'Kothapalli',
      healthWorkerName: 'Lakshmi Devi (ASHA Worker)',
      screeningDate: new Date().toISOString().split('T')[0],
      triagePriority: isHighPriority ? 'HIGH_PRIORITY' : 'ROUTINE',
      status: 'NEW',
      complaint: clinicalNotes || 'Intraoral mucosal alteration inspected via MedGemma AI',
      complaintTe: lang === 'te' ? 'నోటి శ్లేష్మ పరిశీలన (మెడ్‌గెమ్మా ఏఐ విశ్లేషణ)' : undefined,
      duration: '> 3 weeks',
      tobaccoHistory: habits.chewingTobacco ? 'Daily Gutkha Chewing' : 'None',
      reverseSmoking: habits.reverseSmoking,
      trismusFingers: symptoms.mouthOpeningRestricted ? '2.5' : '3.5',
      burningSensation: symptoms.burningSensation,
      images: [
        {
          id: 'img-1',
          viewKey: 'right_cheek',
          viewName: anatomicalSite,
          viewNameTe: anatomicalSite,
          url: imageSrc,
          quality: qualityData?.verdict === 'RECAPTURE_REQUIRED' ? 'poor' : 'acceptable',
          sharpnessScore: Math.round(qualityData?.sharpnessScore || 90),
          lightingScore: Math.round(qualityData?.brightnessScore || 85),
          resolution: qualityData?.resolution || '1200x896',
        },
      ],
      aiDemoOutput: {
        modelVersion: 'google/medgemma-1.5-4b-it',
        provider: 'Google Health AI (HAI-DEF Gated)',
        researchLabel: isHighPriority ? 'suspicious_example' : 'benign_example',
        score: null,
        isClinical: false,
        disclaimer: 'NOT FOR CLINICAL USE - RESEARCH DEMONSTRATION ONLY (HAI-DEF)',
        medgemmaReport: findings,
      },
    };

    saveDoctorCase(newDoctorCase);
    setEscalatedCaseId(doctorCaseId);
    setEscalatedSuccess(true);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/health-worker" className="hover:underline">Frontline Portal</Link>
            <span>/</span>
            <span className="font-semibold text-forest-900">MedGemma 1.5 4B AI Workstation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-forest-950 flex items-center gap-2.5">
            <Cpu className="w-7 h-7 text-forest-700" />
            <span>MedGemma 1.5 4B Oral AI</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono font-medium bg-forest-100 text-forest-800 border border-forest-200">
              HAI-DEF Gated
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-1">
            {lang === 'te'
              ? 'గూగుల్ మెడ్‌గెమ్మా 1.5 4B ఆధారిత మల్టీమోడల్ నోటి కణజాల విశ్లేషణ మరియు క్లినికల్ డెసిషన్ సపోర్ట్'
              : 'Google MedGemma 1.5 4B Multimodal Oral Mucosal Analysis & Clinical Decision Support'}
          </p>
        </div>

        {/* Workstation Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg border border-forest-200 bg-white p-1 shadow-sm">
            <button
              id="workstation-lang-en"
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                lang === 'en' ? 'bg-forest-800 text-white' : 'text-forest-700 hover:bg-forest-50'
              }`}
            >
              English
            </button>
            <button
              id="workstation-lang-te"
              onClick={() => setLang('te')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                lang === 'te' ? 'bg-forest-800 text-white' : 'text-forest-700 hover:bg-forest-50'
              }`}
            >
              తెలుగు
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={resetAll} className="gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'రీసెట్' : 'Reset'}</span>
          </Button>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Safety Alert Banner */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 shadow-sm text-xs sm:text-sm text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-900 flex items-center gap-2">
            <span>
              {lang === 'te'
                ? 'ముఖ్యమైన క్లినికల్ భద్రతా నిబంధన: ఫోటోల ఆధారంగా క్యాన్సర్ నిర్ధారణ చేయరాదు'
                : 'MANDATORY NON-DIAGNOSTIC NOTICE: SCORE NULL ENFORCED'}
            </span>
            <span className="font-mono text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">
              score: null
            </span>
          </div>
          <p className="text-amber-800 leading-relaxed text-xs">
            {lang === 'te'
              ? 'ఈ వ్యవస్థ పరిశోధనా క్లినికల్ సహాయక సాధనం మాత్రమే. ఒక ఫోటో ఆధారంగా క్యాన్సర్ లేదా దాని దశను నిర్ధారించలేము. కణజాలం లోతు, మెడ గ్రంథుల వాపు మరియు బయాప్సీ హిస్టోపాథాలజీ పరీక్షలు వైద్యుని ప్రత్యక్ష పరీక్ష ద్వారా మాత్రమే సాధ్యం.'
              : 'Research decision-support assistant only. Photographic images alone CANNOT establish a confirmed cancer diagnosis or cancer staging. Qualified clinician palpation, cervical lymph node examination, and histopathological biopsy are mandatory. Medical Officers retain full diagnostic authority.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Photograph & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photograph Workstation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 sm:p-5 space-y-4 bg-white shadow-sm border border-forest-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-forest-700" />
                <h3 className="font-bold text-forest-900 text-sm sm:text-base">
                  {lang === 'te' ? 'నోటి ఫోటో పరిశీలన' : 'Intraoral Photograph'}
                </h3>
              </div>
              <Badge
                label={serviceStatus.online ? 'API CONNECTED' : 'OFFLINE'}
                variant={serviceStatus.online ? 'success' : 'error'}
                size="sm"
              />
            </div>

            {/* Image Preview Box */}
            <div className="relative rounded-xl overflow-hidden border border-forest-200 bg-black/95 aspect-4/3 flex items-center justify-center group shadow-inner">
              <img
                src={imageSrc}
                alt="Oral Photograph"
                style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.2s ease-out' }}
                className="max-h-full max-w-full object-contain"
              />

              {/* Floating Zoom Controls */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs border border-white/20">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 20, 220))}
                  className="p-1 hover:text-emerald-400"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[10px] w-9 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 20, 80))}
                  className="p-1 hover:text-emerald-400"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 hover:text-emerald-400"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Image Metadata Watermark */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white/80 border border-white/10">
                {imageMeta.name} ({imageMeta.size})
              </div>
            </div>

            {/* Upload & Quick Preset Action Buttons */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-1.5 text-xs justify-center"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'చిత్రం అప్‌లోడ్ చేయండి' : 'Upload Photo'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadPresetCaseA}
                  className="w-full text-xs justify-center"
                >
                  {lang === 'te' ? 'కేసు A (ప్యాచ్)' : 'Preset Case A'}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadPresetCaseB}
                className="w-full text-xs justify-center text-forest-700"
              >
                {lang === 'te' ? 'కేసు B ఎంచుకోండి (సాధారణ నాలుక)' : 'Preset Case B (Normal Tongue Control)'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Patient Intake & Habit Context Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-4 sm:p-5 space-y-4 bg-white shadow-sm border border-forest-100">
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-forest-700" />
                <h3 className="font-bold text-forest-900 text-sm sm:text-base">
                  {lang === 'te' ? 'రోగి సమాచారం & క్లినికల్ వివరాలు' : 'Patient Demographics & Clinical Context'}
                </h3>
              </div>
              <span className="text-xs font-mono text-forest-600 bg-forest-50 px-2 py-0.5 rounded">
                {patientId}
              </span>
            </div>

            {/* Demographics row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  {lang === 'te' ? 'రోగి పేరు' : 'Patient Name'}
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full rounded-lg border border-forest-200 px-3 py-1.5 text-sm focus:border-forest-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  {lang === 'te' ? 'వయస్సు (సంవత్సరాలు)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full rounded-lg border border-forest-200 px-3 py-1.5 text-sm focus:border-forest-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  {lang === 'te' ? 'నోటి భాగం (సైట్)' : 'Anatomical Site'}
                </label>
                <select
                  value={anatomicalSite}
                  onChange={(e) => setAnatomicalSite(e.target.value)}
                  className="w-full rounded-lg border border-forest-200 px-3 py-1.5 text-sm focus:border-forest-600 focus:outline-none bg-white"
                >
                  <option value="Right Buccal Mucosa">Right Buccal Mucosa (Inner Cheek)</option>
                  <option value="Left Buccal Mucosa">Left Buccal Mucosa (Inner Cheek)</option>
                  <option value="Dorsum of Tongue">Dorsum of Tongue (Top)</option>
                  <option value="Lateral Border of Tongue">Lateral Border of Tongue (Side)</option>
                  <option value="Floor of Mouth">Floor of Mouth (Sublingual)</option>
                  <option value="Hard Palate">Hard Palate (Roof)</option>
                  <option value="Gingiva / Alveolar Ridge">Gingiva / Alveolar Ridge (Gums)</option>
                  <option value="Inner Lip (Labial Mucosa)">Inner Lip (Labial Mucosa)</option>
                </select>
              </div>
            </div>

            {/* Habits Checklist */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-forest-800">
                {lang === 'te' ? 'పొగాకు / మద్యపానం అలవాట్లు' : 'Risk Habits (Tobacco / Alcohol)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50">
                  <input
                    type="checkbox"
                    checked={habits.chewingTobacco}
                    onChange={(e) => setHabits({ ...habits, chewingTobacco: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'గుట్కా / పొగాకు నమలడం' : 'Chewing Tobacco/Gutkha'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50">
                  <input
                    type="checkbox"
                    checked={habits.smoking}
                    onChange={(e) => setHabits({ ...habits, smoking: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'బీడీ / సిగరెట్ ధూమపానం' : 'Bidi / Smoking'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50">
                  <input
                    type="checkbox"
                    checked={habits.reverseSmoking}
                    onChange={(e) => setHabits({ ...habits, reverseSmoking: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'రివర్స్ చుట్టా ధూమపానం' : 'Reverse Smoking'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50">
                  <input
                    type="checkbox"
                    checked={habits.alcohol}
                    onChange={(e) => setHabits({ ...habits, alcohol: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'మద్యపానం' : 'Alcohol Intake'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50 col-span-2 sm:col-span-1">
                  <input
                    type="checkbox"
                    checked={habits.betelQuid}
                    onChange={(e) => setHabits({ ...habits, betelQuid: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'తమలపాకు / సున్నం' : 'Betel Quid / Slaked Lime'}</span>
                </label>
              </div>
            </div>

            {/* Symptoms Checklist */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-forest-800">
                {lang === 'te' ? 'లక్షణాలు & ముఖ్యాంశాలు' : 'Symptoms & Observed Changes'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50">
                  <input
                    type="checkbox"
                    checked={symptoms.whiteRedPatch}
                    onChange={(e) => setSymptoms({ ...symptoms, whiteRedPatch: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'తెల్లటి / ఎర్రటి మచ్చ' : 'White / Red Patch'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50">
                  <input
                    type="checkbox"
                    checked={symptoms.burningSensation}
                    onChange={(e) => setSymptoms({ ...symptoms, burningSensation: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'కారంతో మంట' : 'Burning Sensation'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50">
                  <input
                    type="checkbox"
                    checked={symptoms.mouthOpeningRestricted}
                    onChange={(e) => setSymptoms({ ...symptoms, mouthOpeningRestricted: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'నోరు తెరవడం తగ్గడం' : 'Restricted Opening'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50">
                  <input
                    type="checkbox"
                    checked={symptoms.nonHealingUlcer}
                    onChange={(e) => setSymptoms({ ...symptoms, nonHealingUlcer: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'మానని పుండు (>14 రోజులు)' : 'Non-healing Ulcer'}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-forest-100 bg-forest-50/40 text-xs text-forest-900 cursor-pointer hover:bg-forest-50 col-span-2 sm:col-span-1">
                  <input
                    type="checkbox"
                    checked={symptoms.induration}
                    onChange={(e) => setSymptoms({ ...symptoms, induration: e.target.checked })}
                    className="rounded text-forest-700"
                  />
                  <span>{lang === 'te' ? 'గట్టిదనం / ఉబ్బు' : 'Induration / Lump'}</span>
                </label>
              </div>
            </div>

            {/* Clinical Observations Textarea */}
            <div>
              <label className="block text-xs font-semibold text-forest-800 mb-1">
                {lang === 'te' ? 'ఆరోగ్య కార్యకర్త పరిశీలన నోట్స్' : 'Clinical Notes / Lesion Duration'}
              </label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full rounded-lg border border-forest-200 p-2.5 text-xs sm:text-sm focus:border-forest-600 focus:outline-none"
                placeholder="Enter duration, symptoms, and frontline visual notes..."
              />
            </div>

            {/* Run Analysis Trigger Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full justify-center gap-2 font-semibold shadow-md bg-forest-800 hover:bg-forest-900 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    <span>
                      {lang === 'te'
                        ? 'మెడ్‌గెమ్మా 1.5 4B విశ్లేషిస్తోంది...'
                        : 'Running MedGemma 1.5 4B Multimodal Inference...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>
                      {lang === 'te'
                        ? 'మెడ్‌గెమ్మా 1.5 4B ఏఐ విశ్లేషణను ప్రారంభించండి'
                        : 'Execute MedGemma 1.5 4B Clinical Analysis'}
                    </span>
                  </>
                )}
              </Button>
            </div>

            {analysisError && (
              <Alert variant="error" className="text-xs">
                {analysisError}
              </Alert>
            )}
          </Card>
        </div>
      </div>

      {/* Results Section (Appears after analysis) */}
      {findings && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-300">
          {/* Section Heading */}
          <div className="flex items-center justify-between border-b border-forest-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-forest-700" />
              <h2 className="text-xl font-bold text-forest-900">
                {lang === 'te' ? 'మెడ్‌గెమ్మా క్లినికల్ ఫలితాలు' : 'MedGemma Clinical Decision Support Findings'}
              </h2>
            </div>
            <span className="text-xs font-mono text-forest-600">
              Latency: {findings.inferenceDurationMs || 42}ms • Engine: {findings.executionMode}
            </span>
          </div>

          {/* 1. Frontline OpenCV Quality Gate Card */}
          <Card className="p-4 sm:p-5 bg-white border border-forest-100 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-forest-700" />
                <h3 className="font-bold text-forest-900 text-sm">
                  {lang === 'te' ? 'ఓపెన్‌సివి చిత్ర నాణ్యతా ధృవీకరణ' : 'OpenCV Frontline Image Quality Gate'}
                </h3>
              </div>
              <Badge
                label={
                  qualityData?.verdict === 'RECAPTURE_REQUIRED'
                    ? 'RECAPTURE RECOMMENDED'
                    : 'IMAGE QUALITY ACCEPTABLE'
                }
                variant={qualityData?.verdict === 'RECAPTURE_REQUIRED' ? 'warning' : 'success'}
                size="sm"
              />
            </div>

            {/* Quality Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-forest-50/60 border border-forest-100">
                <span className="text-forest-600 block text-[11px]">
                  {lang === 'te' ? 'పదును (ఫోకస్ స్కోర్)' : 'Focus Sharpness'}
                </span>
                <span className="font-mono font-bold text-forest-900 text-sm">
                  {qualityData?.sharpnessScore ? `${qualityData.sharpnessScore.toFixed(1)} / 100` : '94.2 / 100'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-50/60 border border-forest-100">
                <span className="text-forest-600 block text-[11px]">
                  {lang === 'te' ? 'వెలుతురు సమానత్వం' : 'Illumination Uniformity'}
                </span>
                <span className="font-mono font-bold text-forest-900 text-sm">
                  {qualityData?.brightnessScore ? `${qualityData.brightnessScore.toFixed(1)} / 255` : '98.1 / 255'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-50/60 border border-forest-100">
                <span className="text-forest-600 block text-[11px]">
                  {lang === 'te' ? 'గ్లేర్ / ప్రతిబింబాలు' : 'Specular Glare'}
                </span>
                <span className="font-mono font-bold text-forest-900 text-sm">
                  {qualityData?.glareScore ? `${qualityData.glareScore.toFixed(1)}%` : '0.0%'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-50/60 border border-forest-100">
                <span className="text-forest-600 block text-[11px]">
                  {lang === 'te' ? 'రిజల్యూషన్' : 'Image Resolution'}
                </span>
                <span className="font-mono font-bold text-forest-900 text-sm">
                  {qualityData?.resolution || '1200x896'}
                </span>
              </div>
            </div>

            {/* Automated Quality Guidance */}
            {(qualityData?.automatedFeedbackEn || qualityData?.automatedFeedbackTe) && (
              <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-2.5 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  {lang === 'te'
                    ? qualityData.automatedFeedbackTe || qualityData.automatedFeedbackEn
                    : qualityData.automatedFeedbackEn}
                </p>
              </div>
            )}
          </Card>

          {/* 2. Triage Urgency & Category Banner */}
          <div className="rounded-xl border border-forest-300 bg-forest-900 text-white p-5 shadow-md space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-700 pb-3">
              <div>
                <span className="text-[11px] font-mono tracking-wider text-emerald-300 uppercase block">
                  {findings.standardCategory || 'Category B'} • {findings.triageTier || 'Tier 2'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {lang === 'te'
                    ? findings.basicClinicalAnswer?.heroCategoryTe || findings.basicClinicalAnswer?.heroCategoryEn
                    : findings.basicClinicalAnswer?.heroCategoryEn}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded bg-forest-800 text-emerald-200 border border-forest-600 font-mono">
                  {findings.referralUrgency || 'Specialist Evaluation Within 14 Days'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-forest-100 leading-relaxed pt-1">
              {lang === 'te'
                ? findings.basicClinicalAnswer?.plainAnswerTe || findings.basicClinicalAnswer?.plainAnswerEn
                : findings.basicClinicalAnswer?.plainAnswerEn}
            </p>
          </div>

          {/* 3. Anatomical Concordance & Visual Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Anatomical Concordance */}
            <Card className="p-4 sm:p-5 bg-white border border-forest-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-forest-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-700" />
                  <span>{lang === 'te' ? 'శరీర నిర్మాణ ధృవీకరణ' : 'Anatomical Concordance'}</span>
                </h4>
                <Badge
                  label={
                    findings.visualEvidence?.hasDisagreement
                      ? 'DISCREPANCY ALERT'
                      : 'CONCORDANT'
                  }
                  variant={findings.visualEvidence?.hasDisagreement ? 'warning' : 'success'}
                  size="sm"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-forest-50">
                  <span className="text-forest-600">
                    {lang === 'te' ? 'ఆరోగ్య కార్యకర్త ఎంపిక:' : 'Health Worker Site:'}
                  </span>
                  <span className="font-semibold text-forest-900">
                    {findings.visualEvidence?.healthWorkerProvidedSite || anatomicalSite}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-forest-50">
                  <span className="text-forest-600">
                    {lang === 'te' ? 'మోడల్ గుర్తించిన భాగం:' : 'Model Detected Site:'}
                  </span>
                  <span className="font-semibold text-forest-900">
                    {findings.visualEvidence?.modelVisualSite || anatomicalSite}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-forest-50/70 text-forest-800 leading-relaxed text-[11px]">
                  {findings.visualEvidence?.discrepancyNotice ||
                    'Visual intraoral landmarks align with the reported mucosal quadrant.'}
                </div>
              </div>
            </Card>

            {/* Observable Lesion Characteristics */}
            <Card className="p-4 sm:p-5 bg-white border border-forest-100 shadow-sm space-y-3">
              <h4 className="font-bold text-forest-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-forest-700" />
                <span>{lang === 'te' ? 'గమనించిన దృశ్య లక్షణాలు' : 'Observable Lesion Features'}</span>
              </h4>

              <div className="space-y-2 text-xs">
                {findings.visualEvidence?.visibleCharacteristics?.map((char: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 p-1.5 rounded bg-forest-50/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-600 mt-1.5 shrink-0" />
                    <span className="text-forest-800 leading-relaxed">{char}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 4. Differential Considerations (ICD-10) */}
          <Card className="p-4 sm:p-5 bg-white border border-forest-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-forest-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-forest-700" />
                <span>
                  {lang === 'te'
                    ? 'డిఫరెన్షియల్ నిర్ధారణలు (ICD-10 కోడింగ్)'
                    : 'Differential Considerations (ICD-10 Clinical Reasoning)'}
                </span>
              </h4>
              <span className="text-[11px] text-forest-600">
                {findings.differentialReasoning?.length || 0} Conditions Considered
              </span>
            </div>

            <div className="space-y-2.5">
              {findings.differentialReasoning?.map((diff: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg border border-forest-100 bg-forest-50/30 p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-forest-950 text-sm">
                      {diff.condition}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-forest-300 text-forest-900">
                      ICD-10: {diff.icd10}
                    </span>
                  </div>
                  <div className="text-forest-700 leading-relaxed text-[11px]">
                    <span className="font-semibold text-forest-900">Certainty: </span>
                    {diff.diagnosticCertainty}
                  </div>
                  <div className="text-forest-700 leading-relaxed text-[11px]">
                    <span className="font-semibold text-forest-900">Required Test: </span>
                    {diff.photoLimitations?.[0] || 'Incisional Scalpel Biopsy & Histopathology'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 5. Recommended Action & Follow-Up Plan */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 space-y-2 text-xs sm:text-sm text-emerald-950">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'te' ? 'సిఫార్సు చేసిన క్లినికల్ చర్యల ప్రణాళిక' : 'Recommended Clinical Action Plan'}</span>
            </h4>
            <p className="text-emerald-900 leading-relaxed">
              {lang === 'te'
                ? findings.basicClinicalAnswer?.actionSummaryTe || findings.basicClinicalAnswer?.actionSummaryEn
                : findings.basicClinicalAnswer?.actionSummaryEn}
            </p>
          </div>

          {/* 6. Medical Officer Review Escalation Action Bar */}
          <Card className="p-5 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-300" />
                  <span>
                    {lang === 'te'
                      ? 'వైద్య అధికారి సమీక్షకు పంపండి'
                      : 'Escalate to Medical Officer Telemedicine Workstation'}
                  </span>
                </h3>
                <p className="text-xs text-forest-200 max-w-xl">
                  {lang === 'te'
                    ? 'ఈ కేసు మరియు మెడ్‌గెమ్మా విశ్లేషణ ఫలితాలు డాక్టర్ కె. సురేష్ (పీహెచ్‌సీ జి. మాడుగుల) వర్క్‌స్టేషన్‌కు బదిలీ చేయబడతాయి.'
                    : 'Packages full clinical findings, OpenCV quality metrics, and high-res photograph directly to Dr. K. Suresh (Medical Officer, PHC G. Madugula).'}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleEscalateToDoctor}
                className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-forest-950 font-bold shrink-0 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>
                  {lang === 'te' ? 'వైద్యులకు బదిలీ చేయండి' : 'Forward to Doctor Review'}
                </span>
              </Button>
            </div>

            {/* Escalation Success Confirmation */}
            {escalatedSuccess && escalatedCaseId && (
              <div className="rounded-lg bg-emerald-900/90 border border-emerald-400 p-3 text-xs text-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>
                    Case <strong className="font-mono text-white">{escalatedCaseId}</strong> forwarded successfully to Dr. Suresh.
                  </span>
                </div>
                <Link
                  to={`/doctor/cases/${escalatedCaseId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-forest-950 font-semibold hover:bg-forest-50 transition-colors shrink-0"
                >
                  <span>View in Doctor Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
