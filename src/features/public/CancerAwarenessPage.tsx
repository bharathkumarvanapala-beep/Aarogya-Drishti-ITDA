import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Alert } from '../../components/common/Alert';
import { Button } from '../../components/common/Button';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from '../../i18n';

export const CancerAwarenessPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Go to Previous Navigation */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/" label="Go to Previous" labelTe="మునుపటి పేజీకి" variant="outline" size="sm" />
      </div>

      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-3 py-1 rounded-full">
          Awareness & Early Action
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          {t('cancerAwarenessTitle')}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold font-telugu text-forest-900">
          {t('cancerAwarenessSubtitle')}
        </h2>
        <p className="text-xs sm:text-base text-ink-muted leading-relaxed">
          Oral cancer is one of the most preventable and treatable cancers when identified early. Knowing the warning signs allows timely consultation at your local Primary Health Centre.
        </p>
      </div>

      {/* Mandatory Clinical Education Boundary Alert */}
      <Alert type="info" title="Educational Information Only — Not a Medical Diagnosis" titleTe="కేవలం అవగాహన కొరకు మాత్రమే — రోగ నిర్ధారణ కాదు">
        <p>
          The information on this page is created to assist community awareness. It is NOT a medical diagnosis and cannot confirm or rule out cancer. Only a qualified clinician (Medical Officer, Dental Surgeon, or Oncologist) can perform a clinical examination. All educational materials require review by qualified oral cancer specialists.
        </p>
      </Alert>

      {/* 5 Cardinal Warning Signs Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h3 className="text-2xl font-bold text-ink">
            5 Key Warning Signs to Watch For
          </h3>
          <p className="text-xs sm:text-sm font-telugu text-forest-800 font-semibold">
            గమనించాల్సిన 5 ప్రధాన హెచ్చరిక సంకేతాలు
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Card padding="md" variant="accent" className="space-y-3">
            <div className="p-3 rounded-2xl bg-red-50 text-status-danger w-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">1. Persistent Mouth Ulcers</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">మానని నోటి పుండ్లు (2-3 వారాలకు మించి)</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Common mouth ulcers heal within 10 to 14 days. Any ulcer on the tongue, cheek, or gums that remains unhealed for more than 3 weeks must be evaluated by a doctor.
            </p>
          </Card>

          <Card padding="md" variant="accent" className="space-y-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-status-warning w-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">2. White or Red Patches</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">తెలుపు లేదా ఎరుపు రంగు మచ్చలు</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              A persistent white patch (leukoplakia) or bright red velvety patch (erythroplakia) that cannot be rubbed off. These are potentially malignant disorders that require specialist monitoring.
            </p>
          </Card>

          <Card padding="md" variant="accent" className="space-y-3">
            <div className="p-3 rounded-2xl bg-forest-100 text-forest-900 w-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">3. Restricted Mouth Opening</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">నోరు తెరవడంలో తీవ్రమైన ఇబ్బంది</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Progressive reduction in mouth opening (Oral Submucous Fibrosis - OSMF), stiff inner cheeks, and a burning sensation when eating spicy food, common among chronic gutkha and areca nut chewers.
            </p>
          </Card>

          <Card padding="md" variant="accent" className="space-y-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-status-info w-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">4. Unusual Growth or Swelling</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">అసాధారణ గడ్డలు లేదా వాపులు</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Any painless or tender lump, pebble-like firmness, or thickened tissue on the cheek, tongue, palate, or in the neck lymph nodes.
            </p>
          </Card>

          <Card padding="md" variant="accent" className="space-y-3">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 w-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">5. Difficulty Swallowing or Chewing</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">మింగడంలో లేదా నమలడంలో నొప్పి</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Persistent sensation that something is caught in the throat, difficulty moving the tongue, unprovoked bleeding, or voice hoarseness lasting more than 3 weeks.
            </p>
          </Card>

          <Card padding="md" variant="accent" className="space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-status-success w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">Early Detection is Curable</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">ముందుగా గుర్తిస్తే చికిత్స సులభం</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              When caught in early stages (or precancerous phases), survival rates exceed 80–90%. Delaying examination until advanced stages makes treatment much more complex.
            </p>
          </Card>

        </div>
      </div>

      {/* What to Do Next Action Card */}
      <Card variant="nature" padding="lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-ink">
              Have You Noticed Any of These Symptoms?
            </h3>
            <p className="text-sm font-telugu text-forest-900 font-semibold">
              మీకు లేదా మీ కుటుంబ సభ్యులకు ఈ లక్షణాలు ఉంటే ఏం చేయాలి?
            </p>
            <p className="text-xs sm:text-sm text-ink-muted max-w-xl">
              Do not worry or hesitate. Inform your village ASHA worker or visit the nearest Primary Health Centre. Screening is completely free and respectful.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/facilities">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Find Nearest Health Centre
              </Button>
            </Link>
          </div>
        </div>
      </Card>

    </div>
  );
};
