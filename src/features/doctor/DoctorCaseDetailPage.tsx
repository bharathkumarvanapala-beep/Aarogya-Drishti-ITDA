import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Stethoscope,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Send,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  Video,
  Hospital
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Alert } from '../../components/common/Alert';
import { Modal } from '../../components/common/Modal';
import { useTranslation } from '../../i18n';
import { INITIAL_DOCTOR_CASES } from './doctorData';
import type { DoctorCase } from './doctorData';
import { getCustomDoctorCases, saveDoctorCase, saveInboundReferral } from '../../services/clinicalDataService';

export const DoctorCaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useTranslation();

  // Find active case from custom cases or initial cases, default to Kondala Rao SCR-2026-0042
  const allCases: DoctorCase[] = [...getCustomDoctorCases(), ...INITIAL_DOCTOR_CASES];
  const activeCase: DoctorCase =
    allCases.find((c) => c.id === id) || allCases[0];

  // Image Inspector State
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isEnhanced, setIsEnhanced] = useState<boolean>(false);

  // Clinical Assessment Form State
  const [observations, setObservations] = useState<string>(
    activeCase.review?.observations ||
      'Irregular, non-scrapable leukoplakic plaque on right buccal mucosa, measuring approx 1.5 x 1.0 cm. Associated with focal roughness adjacent to lower right second molar. Retromolar extension observed. No active ulceration or spontaneous bleeding on gentle palpation. Inter-incisal mouth opening restricted to 2.5 fingers.'
  );

  const [cardinalSigns, setCardinalSigns] = useState<string[]>(
    activeCase.review?.cardinalSigns || [
      'Induration / Firmness',
      'Non-scrapable lesion',
      'Burning sensation on spicy food',
      'Restricted mouth opening (< 3 fingers)',
    ]
  );

  const [provisionalCategory, setProvisionalCategory] = useState<string>(
    activeCase.review?.provisionalCategory || 'POTENTIALLY_MALIGNANT_DISORDER'
  );

  const [decision, setDecision] = useState<string>(
    activeCase.review?.decision || 'REFER_TO_SPECIALIST_HOSPITAL'
  );

  const [targetFacility, setTargetFacility] = useState<string>(
    activeCase.review?.targetFacility || 'District Hospital Paderu (Specialist Oral Onco OPD)'
  );

  const [priority, setPriority] = useState<string>(
    activeCase.review?.priority || 'HIGH_2W'
  );

  const [referralNotes, setReferralNotes] = useState<string>(
    activeCase.review?.referralNotes ||
      'Patient has 22-year history of daily gutkha chewing with persistent non-scrapable right buccal lesion (> 3 weeks). Urgent diagnostic punch biopsy and histopathological evaluation recommended at District Hospital Paderu. Patient transport coordination initiated with ITDA tribal desk.'
  );

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(activeCase.status === 'COMPLETED');

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 100));
  const handleResetZoom = () => setZoomLevel(100);

  const toggleCardinalSign = (sign: string) => {
    setCardinalSigns((prev) =>
      prev.includes(sign) ? prev.filter((s) => s !== sign) : [...prev, sign]
    );
  };

  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setShowSuccessModal(true);

    const updatedCase: DoctorCase = {
      ...activeCase,
      status: 'COMPLETED',
      review: {
        doctorName: 'Dr. K. Suresh, MBBS',
        doctorRegNo: 'APMC/2016/88412',
        observations,
        cardinalSigns,
        provisionalCategory: provisionalCategory as any,
        decision: decision as any,
        recommendedSpecialty: 'Specialist Oral Onco OPD',
        targetFacility,
        priority: (priority === 'HIGH_2W' ? 'HIGH_2W' : 'ROUTINE') as any,
        referralNotes,
        signedAt: new Date().toISOString(),
      },
    };
    saveDoctorCase(updatedCase);

    if (decision === 'REFER_TO_SPECIALIST_HOSPITAL' || decision === 'URGENT_BIOPSY') {
      saveInboundReferral({
        id: `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        screeningId: activeCase.id,
        patientId: activeCase.patientId,
        patientName: activeCase.patientName,
        patientNameTe: activeCase.patientNameTe,
        age: activeCase.age,
        gender: activeCase.gender,
        habitation: activeCase.habitation,
        gramPanchayat: activeCase.gramPanchayat,
        mandal: activeCase.mandal,
        referringFacility: 'PHC G. Madugula',
        referringDoctor: 'Dr. K. Suresh, MBBS',
        priority: priority === 'HIGH_2W' ? 'HIGH_2W' : 'ROUTINE',
        provisionalDiagnosis: provisionalCategory === 'POTENTIALLY_MALIGNANT_DISORDER' ? 'Oral Potentially Malignant Disorder (OPMD)' : provisionalCategory,
        assignedSpecialist: 'Dr. M. Anand, MDS (Oral Onco-Surgery)',
        status: 'NEW',
        dateReferred: new Date().toISOString().split('T')[0],
        transportAssistance: 'ITDA 108 Ambulance Requested',
        notes: referralNotes,
      });
    }
  };

  const currentImage = activeCase.images[selectedImageIndex] || activeCase.images[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Breadcrumb & Clinical Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/doctor" className="hover:underline">Clinical Workstation</Link>
            <span>/</span>
            <Link to="/doctor/cases" className="hover:underline">Triage Queue</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">{activeCase.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Independent Clinical Assessment & Case Review
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Physical examination record and specialist referral disposition for Dr. K. Suresh, MBBS (PHC G. Madugula).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/doctor/telemedicine">
            <Button variant="outline" size="sm" icon={Video}>
              Start Teleconsultation
            </Button>
          </Link>
          <Link to="/doctor/cases">
            <Button variant="ghost" size="sm">
              Back to Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Identification Card */}
      <Card padding="md" className="border-forest-200 bg-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded border border-forest-200">
                Case: {activeCase.id}
              </span>
              <span className="font-mono text-xs text-ink-muted">
                Health Card: {activeCase.patientId}
              </span>
              <StatusBadge status={isSubmitted ? 'COMPLETED' : activeCase.status} size="sm" />
              {activeCase.triagePriority === 'HIGH_PRIORITY' && (
                <Badge label="HIGH PRIORITY LESION" variant="danger" size="sm" />
              )}
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <h2 className="text-lg font-bold text-ink">
                {activeCase.patientName}
              </h2>
              {language === 'te' && (
                <span className="text-base font-telugu text-forest-800">
                  ({activeCase.patientNameTe})
                </span>
              )}
              <span className="text-xs text-ink-muted">
                • {activeCase.age} Years / {activeCase.gender === 'male' ? 'Male' : 'Female'}
              </span>
              <span className="text-xs text-forest-950 font-semibold">
                • Habitation: {activeCase.habitation}, Mandal: {activeCase.mandal} (ASR District)
              </span>
            </div>

            <p className="text-xs text-ink-muted">
              <strong>Chief Complaint:</strong> {activeCase.complaint} (Duration: {activeCase.duration})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs bg-forest-50 p-3 rounded-xl border border-forest-200">
            <div>
              <span className="text-ink-muted text-[11px] block">Frontline Screener</span>
              <span className="font-bold text-ink flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-forest-700" />
                {activeCase.healthWorkerName}
              </span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-forest-200" />
            <div>
              <span className="text-ink-muted text-[11px] block">Screening Date</span>
              <span className="font-bold text-ink flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-forest-700" />
                {activeCase.screeningDate}
              </span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-forest-200" />
            <div>
              <span className="text-ink-muted text-[11px] block">Informed Consent</span>
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Witnessed & Verified
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* TWO-COLUMN WORKSTATION LAYOUT: INSPECTOR ON LEFT, CLINICAL DECISION ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: MULTI-VIEW HIGH-RES PHOTO INSPECTOR & ISOLATED AI PANEL */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Multi-View Photo Inspector */}
          <Card padding="md" className="border-forest-200 bg-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-forest-100 flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800">
                  Visual Clinical Examination
                </span>
                <h3 className="text-sm font-bold text-ink">
                  {currentImage.viewName}
                </h3>
              </div>

              {/* Pan-Zoom & Enhancement Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 100}
                  className="p-1.5 rounded-lg border border-forest-200 hover:bg-forest-50 text-forest-800 disabled:opacity-40"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs font-bold px-1.5 min-w-[42px] text-center text-ink">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 250}
                  className="p-1.5 rounded-lg border border-forest-200 hover:bg-forest-50 text-forest-800 disabled:opacity-40"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 rounded-lg border border-forest-200 hover:bg-forest-50 text-forest-800"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEnhanced(!isEnhanced)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    isEnhanced
                      ? 'bg-forest-800 text-white border-forest-900'
                      : 'bg-white border-forest-200 text-forest-800 hover:bg-forest-50'
                  }`}
                  title="Toggle CLAHE Contrast Optimization"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{isEnhanced ? 'Enhanced' : 'CLAHE'}</span>
                </button>
              </div>
            </div>

            {/* Anatomical View Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {activeCase.images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setZoomLevel(100);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedImageIndex === idx
                      ? 'bg-forest-800 text-white border-forest-900 shadow-sm'
                      : 'bg-forest-50 text-forest-900 border-forest-200 hover:bg-forest-100'
                  }`}
                >
                  {img.viewKey.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            {/* High-Resolution Inspection Canvas */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-forest-950 flex items-center justify-center border border-forest-800">
              <div 
                className="w-full h-full flex items-center justify-center overflow-auto cursor-grab active:cursor-grabbing"
              >
                <img
                  src={currentImage.url}
                  alt={currentImage.viewName}
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transition: 'transform 0.2s ease-out',
                  }}
                  className={`max-w-full max-h-full object-contain ${
                    isEnhanced ? 'contrast-125 saturate-110' : ''
                  }`}
                />
              </div>

              {/* Image Quality Metadata Chip */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-white font-mono flex items-center gap-3">
                <span>{currentImage.resolution}</span>
                <span>•</span>
                <span>Laplacian Focus: {currentImage.sharpnessScore}%</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold uppercase">Acceptable Quality</span>
              </div>
            </div>

            <p className="text-[11px] text-ink-muted italic text-center">
              * Frontline photography supplements, but does not replace, direct clinical inspection and palpation.
            </p>
          </Card>

          {/* ISOLATED NON-CLINICAL AI ADVISORY CARD */}
          <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 shadow-sm space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0" />
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Non-Clinical AI Demonstration Advisory
                </h4>
              </div>
              <Badge
                label={activeCase.aiDemoOutput.researchLabel === 'suspicious_example' ? 'RESEARCH: SUSPICIOUS' : 'RESEARCH: BENIGN'}
                variant={activeCase.aiDemoOutput.researchLabel === 'suspicious_example' ? 'warning' : 'neutral'}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <span className="text-[10px] text-ink-muted block">Architecture</span>
                <span className="font-mono font-bold text-ink text-[11px]">mock-v1-eff-b0</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <span className="text-[10px] text-ink-muted block">Provider</span>
                <span className="font-mono font-bold text-ink text-[11px]">mock (Research)</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <span className="text-[10px] text-ink-muted block">Score</span>
                <span className="font-mono font-bold text-amber-900 text-[11px]">null (Prohibited)</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-amber-200">
                <span className="text-[10px] text-ink-muted block">Clinical Reliance</span>
                <span className="font-mono font-bold text-red-700 text-[11px]">Prohibited</span>
              </div>
            </div>

            <p className="text-[11px] text-amber-900/90 leading-relaxed pt-1">
              <strong>Clinical Guardrail:</strong> This research advisory was generated automatically by a test prototype. It does not constitute a medical diagnosis. The Medical Officer must independently assess all physical findings below.
            </p>
          </div>

          {/* Risk Factors Checklist */}
          <Card padding="md" className="border-forest-200 bg-white space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800">
              Frontline Risk Factors & History
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-forest-50 border border-forest-200">
                <span className="text-ink-muted block text-[11px]">Tobacco & Gutkha History</span>
                <span className="font-bold text-ink">{activeCase.tobaccoHistory}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-50 border border-forest-200">
                <span className="text-ink-muted block text-[11px]">Mouth Opening (Inter-incisal)</span>
                <span className="font-bold text-ink">{activeCase.trismusFingers}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-50 border border-forest-200">
                <span className="text-ink-muted block text-[11px]">Burning Sensation</span>
                <span className="font-bold text-ink">{activeCase.burningSensation ? 'Yes (Marked on spicy food)' : 'No'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-50 border border-forest-200">
                <span className="text-ink-muted block text-[11px]">Reverse Smoking</span>
                <span className="font-bold text-ink">{activeCase.reverseSmoking ? 'Yes (High risk)' : 'None reported'}</span>
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: INDEPENDENT CLINICAL ASSESSMENT & REFERRAL DISPOSITION */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmitAssessment} className="space-y-4">
            
            <Card padding="lg" className="border-forest-200 bg-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-forest-100">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800">
                    Medical Officer Clinical Form
                  </span>
                  <h3 className="text-base font-bold text-ink">
                    Independent Clinical Assessment
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-forest-800 font-mono">
                  <Stethoscope className="w-4 h-4" />
                  <span>Dr. K. Suresh, MBBS</span>
                </div>
              </div>

              {/* Clinical Observations Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Physical Examination Findings & Mucosal Observations:
                </label>
                <textarea
                  rows={4}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full p-3 border border-forest-300 rounded-xl text-xs text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-forest-500 font-sans"
                  placeholder="Record lesion characteristics: size, site, texture, scrapability, induration, lymph node status..."
                  required
                />
                <span className="text-[10px] text-ink-muted block text-right">
                  {observations.length} characters • Direct clinical entry
                </span>
              </div>

              {/* Cardinal Signs Checklist */}
              <div className="space-y-2 pt-2 border-t border-forest-100">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Cardinal Clinical Signs Observed:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Induration / Firmness',
                    'Non-scrapable lesion',
                    'Spontaneous bleeding',
                    'Burning sensation on spicy food',
                    'Restricted mouth opening (< 3 fingers)',
                    'Palpable cervical lymphadenopathy',
                  ].map((sign) => {
                    const isChecked = cardinalSigns.includes(sign);
                    return (
                      <button
                        key={sign}
                        type="button"
                        onClick={() => toggleCardinalSign(sign)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          isChecked
                            ? 'bg-forest-100 border-forest-400 text-forest-950 font-semibold'
                            : 'bg-forest-50/50 border-forest-200 text-ink-muted hover:bg-forest-100/50'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                          isChecked ? 'bg-forest-800 text-white border-forest-800' : 'border-forest-300'
                        }`}>
                          {isChecked && '✓'}
                        </span>
                        <span>{sign}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Provisional Category Selector */}
              <div className="space-y-2 pt-2 border-t border-forest-100">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Provisional Clinical Category:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'POTENTIALLY_MALIGNANT_DISORDER', label: 'Potentially Malignant Disorder (OPMD)' },
                    { id: 'SUSPICIOUS_MALIGNANCY', label: 'Suspicious for Malignancy' },
                    { id: 'BENIGN_ORAL_LESION', label: 'Benign Inflammatory / Traumatic' },
                    { id: 'NORMAL_MUCOSA', label: 'Normal Mucosa / Variations' },
                  ].map((cat) => (
                    <label
                      key={cat.id}
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                        provisionalCategory === cat.id
                          ? 'bg-forest-800 text-white border-forest-900 font-bold'
                          : 'bg-white border-forest-200 text-ink hover:bg-forest-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="provisionalCategory"
                        value={cat.id}
                        checked={provisionalCategory === cat.id}
                        onChange={() => setProvisionalCategory(cat.id)}
                        className="hidden"
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clinical Decision */}
              <div className="space-y-2 pt-2 border-t border-forest-100">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Clinical Action & Disposition:
                </label>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {[
                    { id: 'REFER_TO_SPECIALIST_HOSPITAL', label: 'Refer to Specialist Hospital (Diagnostic Biopsy & Staging)', icon: Hospital },
                    { id: 'SCHEDULE_PHC_TELECONSULTATION', label: 'Schedule PHC Specialist Teleconsultation', icon: Video },
                    { id: 'CONSERVATIVE_CARE_AND_RECALL', label: 'Conservative Care & 2-Week Recall (Habit Cessation)', icon: RotateCcw },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <label
                        key={item.id}
                        className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                          decision === item.id
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300'
                            : 'bg-white border-forest-200 text-ink hover:bg-forest-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-forest-700" />
                          <span>{item.label}</span>
                        </div>
                        <input
                          type="radio"
                          name="decision"
                          value={item.id}
                          checked={decision === item.id}
                          onChange={() => setDecision(item.id)}
                          className="w-4 h-4 text-emerald-700"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Referral Details (Only if referral selected) */}
              {decision === 'REFER_TO_SPECIALIST_HOSPITAL' && (
                <div className="space-y-3 p-3.5 bg-forest-50 rounded-xl border border-forest-200 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-ink-muted mb-1">
                        Target Specialist Facility:
                      </label>
                      <select
                        value={targetFacility}
                        onChange={(e) => setTargetFacility(e.target.value)}
                        className="w-full p-2 border border-forest-300 rounded-lg bg-white text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-500 font-semibold"
                      >
                        <option value="District Hospital Paderu (Specialist Oral Onco OPD)">
                          District Hospital Paderu (Paderu Division HQ)
                        </option>
                        <option value="Area Hospital Rampachodavaram (Specialist Onco OPD)">
                          Area Hospital Rampachodavaram (Rampachodavaram Division HQ)
                        </option>
                        <option value="Community Health Centre (CHC) Chintoor">
                          Community Health Centre (CHC) Chintoor (Chintoor Division HQ)
                        </option>
                        <option value="Area Hospital Chintapalli">
                          Area Hospital Chintapalli
                        </option>
                        <option value="King George Hospital (KGH) Visakhapatnam (Oncology Centre)">
                          King George Hospital (KGH) Visakhapatnam (Tertiary Oncology)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-ink-muted mb-1">
                        Referral Protocol Priority:
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-2 border border-forest-300 rounded-lg bg-white text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-500 font-semibold"
                      >
                        <option value="URGENT_72H">URGENT (Within 72 Hours)</option>
                        <option value="HIGH_2W">HIGH PRIORITY (Within 1-2 Weeks)</option>
                        <option value="ROUTINE">ROUTINE (Within 3-4 Weeks)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-ink-muted mb-1">
                      Clinical Rationale & Hospital Referral Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={referralNotes}
                      onChange={(e) => setReferralNotes(e.target.value)}
                      className="w-full p-2.5 border border-forest-300 rounded-lg bg-white text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                </div>
              )}

              {/* Digital Doctor Signature Badge */}
              <div className="p-3 bg-forest-100/70 border border-forest-300 rounded-xl flex items-center justify-between text-xs text-forest-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="font-bold block">Digital Signature Stamp:</span>
                    <span className="text-[11px] text-ink-muted">Dr. K. Suresh, MBBS (APMC-48291) • Medical Officer</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-forest-800 bg-white px-2 py-1 rounded border border-forest-200">
                  30/10/2026 Verified
                </span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Send}
                fullWidth
              >
                Sign Assessment & Dispatch Referral (Phase 9)
              </Button>

            </Card>

          </form>
        </div>

      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Clinical Assessment Signed & Referral Dispatched"
        titleTe="క్లినికల్ పరిశీలన పూర్తయింది & రిఫరల్ పంపబడింది"
        maxWidth="lg"
      >
        <div className="space-y-4 py-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-ink">
              Referral Dispatched to {targetFacility.split(' (')[0]}
            </h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Case <strong>{activeCase.id}</strong> for <strong>{activeCase.patientName} (46M)</strong> has been finalized by Dr. K. Suresh.
              The referral is now active in the <strong>Hospital & Diagnostics Portal (Phase 9)</strong>.
            </p>
          </div>

          <div className="p-3.5 bg-forest-50 rounded-xl border border-forest-200 text-xs space-y-2">
            <div className="flex justify-between border-b border-forest-200 pb-1.5">
              <span className="text-ink-muted">Referral Token:</span>
              <span className="font-mono font-bold text-ink">REF-2026-0019</span>
            </div>
            <div className="flex justify-between border-b border-forest-200 pb-1.5">
              <span className="text-ink-muted">Provisional Diagnosis:</span>
              <span className="font-bold text-forest-900">{provisionalCategory.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between border-b border-forest-200 pb-1.5">
              <span className="text-ink-muted">Priority SLA:</span>
              <span className="font-bold text-red-700">{priority.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Tribal Patient Transport:</span>
              <span className="font-bold text-emerald-800">ITDA Helpdesk Desk Assigned</span>
            </div>
          </div>

          <Alert 
            type="info" 
            title="Continuity of Care Guarantee" 
            titleTe="నిరంతర వైద్య సంరక్షణ హామీ"
          >
            The patient's physical health card QR code will automatically link to this outbound referral record during district hospital registration.
          </Alert>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setShowSuccessModal(false)}
            >
              Stay on Case
            </Button>
            <Link to="/hospital" className="w-full">
              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                fullWidth
              >
                Proceed to Hospital Portal (Phase 9)
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

    </div>
  );
};
