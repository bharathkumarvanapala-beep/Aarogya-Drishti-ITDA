import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  User, 
  Stethoscope, 
  Eye
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';
import { INITIAL_SCREENINGS } from './patientData';
import type { ScreeningHistoryItem } from './patientData';
import { Link } from 'react-router-dom';

export const PatientScreeningsPage: React.FC = () => {
  const { language } = useTranslation();
  const [selectedScreening, setSelectedScreening] = useState<ScreeningHistoryItem | null>(null);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Screening Archive
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              ASR-PAT-2026-0842
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            My Oral Screening Records
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Official chronological history of frontline community oral screenings and medical reviews.
          </p>
        </div>

        <Link to="/patient/journey">
          <Button variant="outline" size="md">
            View Longitudinal Journey
          </Button>
        </Link>
      </div>

      {/* Screenings List */}
      <div className="space-y-4">
        {INITIAL_SCREENINGS.map((screening) => (
          <Card key={screening.id} variant="default" padding="lg" className="border-forest-100 hover:border-forest-300 transition-colors">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded">
                    {screening.id}
                  </span>
                  <StatusBadge status={screening.status} />
                  <span className="text-xs text-ink-muted flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-forest-800" />
                    <span>{screening.date}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-ink">
                    {language === 'te' ? screening.findingsSummaryTe : screening.findingsSummary}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-ink-muted mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-forest-800" />
                      <span>{screening.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-forest-800" />
                      <span>Conducted by: <strong>{screening.workerName}</strong></span>
                    </span>
                    {screening.moReviewer && (
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-forest-800" />
                        <span>Reviewed by: <strong>{screening.moReviewer}</strong></span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Symptoms Badges */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] font-bold text-ink-muted uppercase font-mono">Recorded Symptoms:</span>
                  {screening.symptoms.map((sym, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 rounded-full text-xs bg-forest-50 border border-forest-200 text-forest-900 font-medium">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 flex items-center gap-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={Eye} 
                  onClick={() => setSelectedScreening(screening)}
                >
                  View Details
                </Button>
              </div>

            </div>
          </Card>
        ))}
      </div>

      {/* Screening Details Modal */}
      {selectedScreening && (
        <Modal
          isOpen={!!selectedScreening}
          onClose={() => setSelectedScreening(null)}
          title={`Screening Record Details — ${selectedScreening.id}`}
          titleTe="స్క్రీనింగ్ రికార్డు పూర్తి వివరాలు"
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-xs bg-forest-50 p-4 rounded-2xl border border-forest-100">
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Date & Habitation</span>
                <span className="font-bold text-ink text-sm block">{selectedScreening.date}</span>
                <span className="text-ink-muted">{selectedScreening.location}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Reviewing Medical Officer</span>
                <span className="font-bold text-ink text-sm block">{selectedScreening.moReviewer || 'Pending Review'}</span>
                <span className="text-ink-muted">G. Madugula Primary Health Centre</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-mono">
                Clinical Observations & Assessment
              </h4>
              <p className="text-sm text-ink leading-relaxed bg-white p-4 rounded-xl border border-forest-100">
                {selectedScreening.findingsSummary}
              </p>
            </div>

            {selectedScreening.referralId && (
              <Alert type="warning" title="Hospital Referral Generated" titleTe="ఆసుపత్రి రిఫరల్ వివరాలు">
                <p>
                  Referral Reference <strong>{selectedScreening.referralId}</strong>: Directed to <strong>District Hospital Paderu (Specialist Oral Oncology OPD)</strong> for high-resolution visual examination and diagnostic opinion. Free tribal patient transport available.
                </p>
              </Alert>
            )}

            <div className="flex justify-end pt-3 border-t border-forest-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedScreening(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
