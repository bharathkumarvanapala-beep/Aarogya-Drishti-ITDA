import React from 'react';
import { Link } from 'react-router-dom';
import { Ban, Apple, Droplets, ShieldCheck, Smile } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from '../../i18n';

export const HealthyHabitsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Go to Previous Navigation */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/" label="Go to Previous" labelTe="మునుపటి పేజీకి" variant="outline" size="sm" />
      </div>

      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Prevention & Well-being
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          {t('healthyHabitsTitle')}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold font-telugu text-forest-900">
          {t('healthyHabitsSubtitle')}
        </h2>
        <p className="text-xs sm:text-base text-ink-muted leading-relaxed">
          Over 85% of oral potentially malignant lesions and cancers can be prevented by adopting healthy everyday habits and breaking free from tobacco and areca nut.
        </p>
      </div>

      {/* Tobacco & Habit Harm Reduction Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h3 className="text-2xl font-bold text-ink">
            Understanding High-Risk Habits
          </h3>
          <p className="text-xs sm:text-sm font-telugu text-forest-800 font-semibold">
            నోటి ఆరోగ్యానికి హాని కలిగించే అలవాట్లు
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card padding="md" className="space-y-3 border-amber-200">
            <div className="p-3 rounded-2xl bg-amber-100 text-status-warning w-fit">
              <Ban className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">Chewing Tobacco & Gutkha</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">గుట్కా, ఖైనీ, తంబాకు నమలడం</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Holding tobacco and lime against the cheek causes chronic chemical and physical irritation. This directly causes leukoplakia and oral cancer.
            </p>
            <div className="text-xs font-semibold text-forest-900 bg-forest-50 p-2.5 rounded-xl">
              Tip: Replace gutkha with roasted fennel (saunf) or cardamom to overcome oral cravings.
            </div>
          </Card>

          <Card padding="md" className="space-y-3 border-amber-200">
            <div className="p-3 rounded-2xl bg-amber-100 text-status-warning w-fit">
              <Ban className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">Reverse Smoking (Chutta)</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">చుట్టను వెలిగించిన వైపు నోట్లో పెట్టుకోవడం</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Smoking with the lighted end inside the mouth exposes the hard palate to temperatures exceeding 100°C, causing Palatal Keratosis and severe cancer risks.
            </p>
            <div className="text-xs font-semibold text-forest-900 bg-forest-50 p-2.5 rounded-xl">
              Tip: Seek friendly cessation guidance from your village ASHA worker or PHC counselor.
            </div>
          </Card>

          <Card padding="md" className="space-y-3 border-amber-200">
            <div className="p-3 rounded-2xl bg-amber-100 text-status-warning w-fit">
              <Ban className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-ink">Areca Nut (Betel Nut / Supari)</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-2">పోకచెక్క (తమలపాకు సుపారీ)</p>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Areca nut contains alkaloid compounds that permanently scar the inner cheek collagen, causing Oral Submucous Fibrosis (OSMF) and restricted mouth opening.
            </p>
            <div className="text-xs font-semibold text-forest-900 bg-forest-50 p-2.5 rounded-xl">
              Tip: Even sweet supari or tobacco-free pan masala contains toxic arecoline compounds.
            </div>
          </Card>

        </div>
      </div>

      {/* Positive Health Habits */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h3 className="text-2xl font-bold text-ink">
            Healthy Habits for a Lifelong Smile
          </h3>
          <p className="text-xs sm:text-sm font-telugu text-forest-800 font-semibold">
            ఆరోగ్యకరమైన చిరునవ్వు కోసం మంచి అలవాట్లు
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="md" variant="nature" className="space-y-2">
            <div className="p-2.5 rounded-xl bg-forest-100 text-forest-900 w-fit">
              <Apple className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-ink">Fresh Green Foods</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold">తాజా ఆకుకూరలు</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Local leafy greens, amla (gooseberry), papaya, and carrots provide Vitamin A, C, and antioxidants that protect oral mucosa.
            </p>
          </Card>

          <Card padding="md" variant="nature" className="space-y-2">
            <div className="p-2.5 rounded-xl bg-forest-100 text-forest-900 w-fit">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-ink">Stay Hydrated</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold">సరిపడా నీరు త్రాగడం</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Drinking adequate clean water stimulates healthy saliva production, washing away food particles and protective enzymes.
            </p>
          </Card>

          <Card padding="md" variant="nature" className="space-y-2">
            <div className="p-2.5 rounded-xl bg-forest-100 text-forest-900 w-fit">
              <Smile className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-ink">Self-Oral Checkup</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold">నెలకు ఒకసారి స్వీయ పరీక్ష</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Once a month in front of a mirror or daylight, inspect your cheeks, tongue, and gums for any new color changes or sores.
            </p>
          </Card>

          <Card padding="md" variant="nature" className="space-y-2">
            <div className="p-2.5 rounded-xl bg-forest-100 text-forest-900 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-ink">Annual Screening</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold">వార్షిక ఉచిత పరీక్ష</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Participate in village screening drives when the ASHA worker visits or stop by your nearest PHC every 6 to 12 months.
            </p>
          </Card>
        </div>
      </div>

      {/* Free Cessation Counseling Banner */}
      <Card variant="default" padding="lg" className="border-forest-200 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-ink">
              Ready to Quit? Free Counseling at Your Nearest PHC
            </h4>
            <p className="text-xs sm:text-sm font-telugu text-forest-800 font-semibold">
              పొగాకు విముక్తి కొరకు మీ సమీప ప్రాథమిక ఆరోగ్య కేంద్రాన్ని సంప్రదించండి
            </p>
            <p className="text-xs sm:text-sm text-ink-muted max-w-xl">
              Medical Officers and community health workers provide non-judgmental, compassionate habit cessation counseling and nicotine gum guidance under the National Tobacco Control Programme (NTCP).
            </p>
          </div>

          <Link to="/facilities">
            <Button variant="primary" size="md">
              Find Counseling Locations
            </Button>
          </Link>
        </div>
      </Card>

    </div>
  );
};
