import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Calendar,
  User,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';
import { INITIAL_INVESTIGATIONS } from './hospitalData';
import type { DiagnosticInvestigation } from './hospitalData';

export const BiopsyTrackerPage: React.FC = () => {
  const { language } = useTranslation();

  const [investigations, setInvestigations] = useState<DiagnosticInvestigation[]>(INITIAL_INVESTIGATIONS);
  const [selectedReport, setSelectedReport] = useState<DiagnosticInvestigation | null>(null);

  const handleAdvanceStage = (id: string) => {
    setInvestigations((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;

        if (inv.status === 'ADVISED') {
          return {
            ...inv,
            status: 'SAMPLE_COLLECTED',
            interimNotes: 'Punch biopsy successfully performed in Minor OT 2. Formalin-fixed specimen transferred to District Hospital Pathology Lab.',
          };
        } else if (inv.status === 'SAMPLE_COLLECTED') {
          return {
            ...inv,
            status: 'LAB_PROCESSING',
            interimNotes: 'Specimen grossing completed. Paraffin block sectioned and H&E stained slides under review by pathologist.',
          };
        } else if (inv.status === 'LAB_PROCESSING') {
          return {
            ...inv,
            status: 'REPORT_READY',
            interimNotes: 'Microscopic examination completed. Pathologist verified histopathological diagnostic report.',
            reportSummary: 'Histological examination shows stratified squamous epithelium with moderate hyperkeratosis and mild epithelial dysplasia. Basal layer intact. No invasive malignancy seen in current specimen. Margin surveillance recommended.',
          };
        } else if (inv.status === 'REPORT_READY') {
          return {
            ...inv,
            status: 'REVIEWED',
            interimNotes: 'Consultant Dr. M. Anand reviewed histopathology with patient. Conservative follow-up and habit cessation protocol initiated.',
          };
        }
        return inv;
      })
    );
  };

  const stageOrder: DiagnosticInvestigation['status'][] = [
    'ADVISED',
    'SAMPLE_COLLECTED',
    'LAB_PROCESSING',
    'REPORT_READY',
    'REVIEWED',
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/hospital" className="hover:underline">Hospital Hub</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Diagnostics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Diagnostic Investigation & Biopsy Tracking
            <span className="text-xs font-mono font-semibold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded-full">
              Pathology Lab • District Hospital Paderu
            </span>
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Longitudinal biopsy tracking pipeline from specialist order to tissue collection, microscopic analysis, and clinical sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/hospital/navigation">
            <Button variant="outline" size="sm">
              Patient Navigation Desk
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Alert */}
      <Alert 
        type="info" 
        title="Histopathology Turnaround Target: 72 Hours" 
        titleTe="హిస్టోపాథాలజీ రిపోర్ట్ గడువు: 72 గంటలు"
      >
        Specimens collected from tribal patients across ASR District are processed in-house at District Hospital Paderu Pathology Lab. Complex onco-pathology cases are cross-referred with KGH Visakhapatnam.
      </Alert>

      {/* Investigation Tracking Cards */}
      <div className="space-y-4">
        {investigations.map((inv) => {
          const isKondalaRao = inv.patientId === 'ASR-PAT-2026-0842';
          const currentStageIndex = stageOrder.indexOf(inv.status);

          return (
            <Card
              key={inv.id}
              padding="lg"
              className={`border space-y-4 ${
                isKondalaRao
                  ? 'border-forest-400 ring-2 ring-forest-200/50 bg-white'
                  : 'border-forest-200 bg-white'
              }`}
            >
              {/* Card Top: Patient Details & Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-forest-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded border border-forest-200">
                      {inv.id}
                    </span>
                    <span className="font-mono text-xs text-ink-muted">
                      Card: {inv.patientId}
                    </span>
                    <Badge
                      label={inv.status.replace(/_/g, ' ')}
                      variant={inv.status === 'REVIEWED' ? 'success' : inv.status === 'REPORT_READY' ? 'info' : 'warning'}
                      size="sm"
                    />
                    {isKondalaRao && (
                      <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                        Standard Synthetic Demo Scenario
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-ink">
                    {inv.patientName} — {inv.investigationType}
                  </h3>
                  {language === 'te' && (
                    <p className="text-xs font-telugu text-forest-800">
                      {inv.patientNameTe} • {inv.anatomicalSite}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {inv.reportSummary && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FileText}
                      onClick={() => setSelectedReport(inv)}
                    >
                      View Histopathology Report
                    </Button>
                  )}

                  {inv.status !== 'REVIEWED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ArrowRight}
                      onClick={() => handleAdvanceStage(inv.id)}
                    >
                      Advance Stage
                    </Button>
                  )}
                </div>
              </div>

              {/* 5-Stage Visual Progress Stepper */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800">
                  Biopsy Diagnostic Pipeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { key: 'ADVISED', label: '1. Advised' },
                    { key: 'SAMPLE_COLLECTED', label: '2. Sample Taken' },
                    { key: 'LAB_PROCESSING', label: '3. Lab Processing' },
                    { key: 'REPORT_READY', label: '4. Report Ready' },
                    { key: 'REVIEWED', label: '5. Reviewed' },
                  ].map((step, idx) => {
                    const isDone = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div
                        key={step.key}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          isCurrent
                            ? 'bg-forest-800 text-white font-bold border-forest-900 ring-2 ring-forest-400 shadow-sm'
                            : isDone
                            ? 'bg-emerald-50 text-emerald-950 border-emerald-200 font-semibold'
                            : 'bg-forest-50/50 text-ink-muted border-forest-100'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          {isDone ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-emerald-600'}`} />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-forest-400" />
                          )}
                          <span className="text-[11px] font-mono">{step.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Investigation Details & Interim Notes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-forest-50 p-3 rounded-xl border border-forest-200">
                <div>
                  <span className="text-ink-muted text-[11px] block">Anatomical Biopsy Site</span>
                  <span className="font-bold text-ink">{inv.anatomicalSite}</span>
                </div>
                <div>
                  <span className="text-ink-muted text-[11px] block">Consulting Pathologist</span>
                  <span className="font-bold text-ink flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-forest-700" />
                    {inv.pathologist}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted text-[11px] block">Schedule & SLA</span>
                  <span className="font-bold text-ink flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-forest-700" />
                    {inv.scheduledDate} (Turnaround: {inv.turnaroundDays} Days)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-forest-200 text-xs">
                <strong className="text-forest-950">Laboratory Status Notes:</strong>{' '}
                <span className="text-ink-muted">{inv.interimNotes}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* REPORT VIEWER MODAL */}
      <Modal
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        title="Histopathological Diagnostic Report"
        titleTe="హిస్టోపాథాలజీ తుది నివేదిక"
        maxWidth="lg"
      >
        {selectedReport && (
          <div className="space-y-4 py-2 text-xs">
            {/* Header Stamp */}
            <div className="p-4 bg-forest-50 rounded-xl border border-forest-200 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-forest-800">
                Department of Pathology • District Hospital Paderu (ASR District)
              </span>
              <h2 className="text-base font-bold text-ink">
                Surgical Pathology & Biopsy Evaluation
              </h2>
              <div className="flex justify-center gap-4 text-[11px] text-ink-muted pt-1">
                <span>Specimen ID: <strong>{selectedReport.id}</strong></span>
                <span>•</span>
                <span>Patient: <strong>{selectedReport.patientName}</strong></span>
                <span>•</span>
                <span>Health Card: <strong>{selectedReport.patientId}</strong></span>
              </div>
            </div>

            {/* Non-Clinical Demonstration Watermark */}
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg flex items-center gap-2 text-amber-950 font-semibold text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
              <span>SYNTHETIC DEMONSTRATION RECORD — AAROHAN HACKATHON 2026 TEST SUITE ONLY</span>
            </div>

            {/* Specimen Description */}
            <div className="space-y-2 p-3 bg-white rounded-xl border border-forest-200">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-forest-100">
                <div>
                  <span className="text-ink-muted block text-[10px]">Site of Specimen:</span>
                  <span className="font-bold text-ink">{selectedReport.anatomicalSite}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">Reporting Pathologist:</span>
                  <span className="font-bold text-ink">{selectedReport.pathologist}</span>
                </div>
              </div>

              <div>
                <span className="text-ink-muted block text-[10px] uppercase font-mono font-bold">
                  Microscopic Histopathological Description:
                </span>
                <p className="text-xs text-ink leading-relaxed pt-1">
                  {selectedReport.reportSummary || selectedReport.interimNotes}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setSelectedReport(null)}
              >
                Close Report
              </Button>
              <Link to="/hospital/referrals" className="w-full">
                <Button variant="primary" size="md" fullWidth>
                  Return to Referrals Hub
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
