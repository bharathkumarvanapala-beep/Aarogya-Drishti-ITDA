import { 
  MapPin, 
  User, 
  PhoneCall, 
  CreditCard,
  Calendar
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';
import { INITIAL_CARE_STEPS } from './patientData';
import { Link } from 'react-router-dom';

export const CareJourneyTimelinePage: React.FC = () => {
  const { language } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Care Continuum
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              Kondala Rao (46M)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            Longitudinal Care Journey Timeline
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Continuous medical pathway connecting doorstep tribal screening, primary care review, and specialist hospital treatment.
          </p>
        </div>

        <Link to="/patient/card-preview">
          <Button variant="outline" size="md" icon={CreditCard}>
            View Health Card
          </Button>
        </Link>
      </div>

      {/* Free Care & Transport Guarantee Alert */}
      <Alert type="info" title="Zero Cost Care & Free Transport Support" titleTe="ఉచిత వైద్యం మరియు రవాణా సదుపాయం">
        <p>
          Every stage on this timeline is covered under the Andhra Pradesh Tribal Health Mission and ITDA Paderu. If you require ambulance or travel assistance to District Hospital Paderu, call <strong>108</strong> or your ASHA worker <strong>Lakshmi Devi</strong>.
        </p>
      </Alert>

      {/* Vertical Care Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-forest-200 space-y-8 my-6">
        {INITIAL_CARE_STEPS.map((step) => {
          const isCompleted = step.status === 'COMPLETED';
          const isInProgress = step.status === 'IN_PROGRESS';
          const isPending = step.status === 'PENDING';

          return (
            <div key={step.id} className="relative group">
              {/* Timeline Marker Node */}
              <div 
                className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-transform group-hover:scale-110 shadow-sm ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : isInProgress 
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse' 
                    : isPending 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-forest-100 text-forest-700'
                }`}
              >
                {isCompleted ? '✓' : step.stepNumber}
              </div>

              {/* Step Card */}
              <Card 
                variant={isInProgress ? 'nature' : 'default'} 
                padding="lg"
                className={`transition-all ${
                  isInProgress ? 'border-amber-300 ring-2 ring-amber-200/50' : 'border-forest-100'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded">
                        Stage {step.stepNumber}
                      </span>
                      <StatusBadge status={step.status} />
                    </div>

                    <span className="text-xs text-ink-muted flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-forest-800" />
                      <span>{step.date}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="text-xs font-telugu text-forest-800 font-semibold mt-0.5">
                      {step.titleTe}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    {language === 'te' ? step.summaryTe : step.summary}
                  </p>

                  <div className="pt-2 border-t border-forest-100/80 flex flex-wrap items-center justify-between text-xs text-ink-muted gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-forest-800" />
                      <span>{step.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-forest-800" />
                      <span>Provider: <strong className="text-ink">{step.provider}</strong></span>
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Bottom Emergency Help Strip */}
      <Card variant="flat" padding="md" className="border-forest-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-ink">
              Have Questions About Your Scheduled Referral or Appointment?
            </h4>
            <p className="text-xs text-ink-muted">
              Speak with Rajesh Varma (District Hospital Paderu Patient Navigator) or your ASHA worker.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a href="tel:08935250000" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-forest-100 text-forest-900 font-mono text-xs font-bold hover:bg-forest-200 transition-colors">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>08935-250000</span>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};
