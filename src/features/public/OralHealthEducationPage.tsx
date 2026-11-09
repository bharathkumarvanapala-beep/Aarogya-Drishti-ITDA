import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from '../../i18n';

interface AnatomyZone {
  id: string;
  name: string;
  nameTe: string;
  location: string;
  healthyLook: string;
  healthyLookTe: string;
  whatToCheck: string;
  whatToCheckTe: string;
}

export const OralHealthEducationPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState<string>('cheeks');

  const zones: AnatomyZone[] = [
    {
      id: 'cheeks',
      name: 'Inner Cheeks (Buccal Mucosa)',
      nameTe: 'బుగ్గ లోపలి భాగం',
      location: 'The soft lining on the inside of both cheeks between upper and lower molars.',
      healthyLook: 'Smooth, moist, uniform pink color without rough white or red patches.',
      healthyLookTe: 'మృదువుగా, గులాబీ రంగులో ఎటువంటి గరుకు మచ్చలు లేకుండా ఉండాలి.',
      whatToCheck: 'Look for rough white lines, thickened fibrous bands, burning when eating chillies, or ulcers caused by sharp teeth.',
      whatToCheckTe: 'తెలుపు లేదా ఎరుపు మచ్చలు, గరుకుదనం, కారంగా ఉన్న ఆహారం తిన్నప్పుడు మంటను గమనించండి.',
    },
    {
      id: 'tongue',
      name: 'Tongue (Dorsum, Ventral & Lateral Borders)',
      nameTe: 'నాలుక (పైభాగం, అడుగు మరియు అంచులు)',
      location: 'The muscular organ in the center of the mouth, including top surface, sides, and underside.',
      healthyLook: 'Pink with small healthy papillae (taste buds), moves freely without pain or stiffness.',
      healthyLookTe: 'గులాబీ రంగులో ఉండి, సులభంగా కదలగలగాలి. నొప్పి ఉండకూడదు.',
      whatToCheck: 'Check the lateral sides and underside of the tongue for firm lumps, non-healing ulcers (> 2 weeks), or red velvety patches.',
      whatToCheckTe: 'నాలుక అంచులలో గడ్డలు, 2 వారాలకు మించి మానని పుండ్లు లేదా ఎరుపు రంగు మచ్చలను పరిశీలించండి.',
    },
    {
      id: 'gums',
      name: 'Gums & Alveolar Ridges',
      nameTe: 'చిగుళ్ళు',
      location: 'The mucosal tissue surrounding the teeth and covering the jawbone.',
      healthyLook: 'Firm, pale pink, tightly hugging the neck of each tooth without spontaneous bleeding.',
      healthyLookTe: 'గట్టిగా, తేలికపాటి గులాబీ రంగులో ఉండి, రక్తస్రావం కాకుండా ఉండాలి.',
      whatToCheck: 'Swollen, dark red, or bleeding gums; lumps or ulcers that do not resolve after brushing adjustments.',
      whatToCheckTe: 'చిగుళ్ల వాపు, నిరంతర రక్తస్రావం లేదా తగ్గని పుండ్లను గమనించండి.',
    },
    {
      id: 'palate',
      name: 'Roof of Mouth (Hard & Soft Palate)',
      nameTe: 'అంగిలి (నోటి పైకప్పు)',
      location: 'The upper bony roof behind front teeth (hard palate) and muscular rear arch (soft palate).',
      healthyLook: 'Pale pink with subtle ridges in front; smooth and darker pink in the back.',
      healthyLookTe: 'లేత గులాబీ రంగులో ఉండి, ఎటువంటి వాపు లేదా రంగు మార్పులు లేకుండా ఉండాలి.',
      whatToCheck: 'Smokers (especially reverse smoking / chutta) should check for red dots with white borders, persistent ulcers, or darkened patches.',
      whatToCheckTe: 'చుట్ట తాగేవారు ఎరుపు లేదా తెలుపు మచ్చలు, బొడిపెలను తప్పనిసరిగా పరీక్షించుకోవాలి.',
    },
    {
      id: 'floor',
      name: 'Floor of the Mouth',
      nameTe: 'నోటి అడుగు భాగం',
      location: 'The soft tissue situated directly underneath the tongue.',
      healthyLook: 'Thin, delicate, pink tissue with visible salivary gland ducts.',
      healthyLookTe: 'సున్నితంగా ఉండి, నాలుక కింద ఎటువంటి గట్టి గడ్డలు లేకుండా ఉండాలి.',
      whatToCheck: 'Any persistent ulcer, pebble-like hardness, or swelling under the tongue needs immediate medical attention.',
      whatToCheckTe: 'నాలుక కింద ఏర్పడే మానని పుండ్లు లేదా గట్టి గడ్డలను వెంటనే వైద్యునికి చూపించాలి.',
    },
    {
      id: 'lips',
      name: 'Lips & Corners (Labial Mucosa)',
      nameTe: 'పెదవులు మరియు మూలలు',
      location: 'Upper and lower lips, and outer commissures (corners of the mouth).',
      healthyLook: 'Smooth, supple, free of deep fissures, scaling, or lumps.',
      healthyLookTe: 'మృదువుగా ఉండి, పగుళ్లు లేదా గడ్డలు లేకుండా ఉండాలి.',
      whatToCheck: 'Crusting sores that do not heal, firm nodules, or cracks at the corners of the mouth that persist for weeks.',
      whatToCheckTe: 'మానని పుండ్లు లేదా పెదవుల మూలల్లో నిరంతర పగుళ్లను గమనించండి.',
    },
    {
      id: 'teeth',
      name: 'Teeth & Occlusion',
      nameTe: 'పళ్ళు',
      location: 'Upper and lower dental arches.',
      healthyLook: 'Clean enamel, intact crowns without sharp broken edges rubbing the cheeks or tongue.',
      healthyLookTe: 'పదునైన విరిగిన అంచులు లేకుండా శుభ్రంగా ఉండాలి.',
      whatToCheck: 'Sharp broken teeth causing chronic cheek biting, severe loose teeth without gum disease, or dark decayed cavities.',
      whatToCheckTe: 'బుగ్గలను గుచ్చుకునే విరిగిన పళ్ళను సరిచేయించుకోవాలి.',
    },
  ];

  const currentZone = zones.find((z) => z.id === selectedZone) || zones[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Go to Previous Navigation */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/" label="Go to Previous" labelTe="మునుపటి పేజీకి" variant="outline" size="sm" />
      </div>

      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
          Oral Health Education
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          {t('oralHealthTitle')}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold font-telugu text-forest-900">
          {t('oralHealthSubtitle')}
        </h2>
        <p className="text-xs sm:text-base text-ink-muted leading-relaxed">
          The mouth is the gateway to overall health. Learning to recognize normal anatomy allows you and your family to identify subtle warning signs before they become serious.
        </p>
      </div>

      {/* Interactive Anatomy Visualizer */}
      <Card variant="nature" padding="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Diagram */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden bg-white p-2 border border-forest-200 shadow-sm">
              <img
                src="/images/oral_anatomy_guide.jpg"
                alt="Illustrated anatomical regions of the mouth"
                loading="lazy"
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="p-3 rounded-xl bg-forest-100/70 border border-forest-200 text-xs text-forest-900">
              <span className="font-bold block">7 Key Examination Zones:</span>
              <span>Cheeks, Tongue, Gums, Palate, Floor of Mouth, Lips, and Teeth.</span>
            </div>
          </div>

          {/* Right Interactive Zone Explorer */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-ink">
                Select an Anatomical Zone to Learn More:
              </h3>
              <p className="text-xs font-telugu text-forest-800 font-semibold mt-0.5">
                వివరాలు తెలుసుకోవడానికి భాగాన్ని ఎంచుకోండి:
              </p>
            </div>

            {/* Zone Selector Chips */}
            <div className="flex flex-wrap gap-2">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedZone === zone.id
                      ? 'bg-forest-900 text-white shadow-sm scale-105'
                      : 'bg-white border border-forest-200 text-ink hover:bg-forest-100/60'
                  }`}
                >
                  {zone.name.split(' (')[0]}
                </button>
              ))}
            </div>

            {/* Active Zone Detail Card */}
            <div className="p-6 rounded-2xl bg-white border border-forest-200 shadow-sm space-y-4">
              <div className="border-b border-forest-100 pb-3">
                <h4 className="text-xl font-bold text-ink">
                  {currentZone.name}
                </h4>
                <p className="text-sm font-telugu text-forest-800 font-bold mt-0.5">
                  {currentZone.nameTe}
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  <span className="font-semibold text-ink">Location: </span>{currentZone.location}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-status-success block">
                    Healthy Appearance (సాధారణ లక్షణాలు)
                  </span>
                  <p className="text-sm text-ink font-medium mt-1">
                    {currentZone.healthyLook}
                  </p>
                  <p className="text-xs font-telugu text-forest-800 mt-1">
                    {currentZone.healthyLookTe}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-status-warning block">
                    What to Check During Examination (ఏమి గమనించాలి?)
                  </span>
                  <p className="text-sm text-ink font-medium mt-1">
                    {currentZone.whatToCheck}
                  </p>
                  <p className="text-xs font-telugu text-forest-900 mt-1">
                    {currentZone.whatToCheckTe}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </Card>

      {/* Daily Oral Hygiene Checklist */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h3 className="text-2xl font-bold text-ink">
            Daily Oral Hygiene Essentials
          </h3>
          <p className="text-xs sm:text-sm font-telugu text-forest-800 font-semibold">
            రోజువారీ నోటి పరిశుభ్రత నియమాలు
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="md" className="space-y-2">
            <div className="p-3 rounded-xl bg-forest-100 text-forest-900 w-fit">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-ink">Brush Twice Daily</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-1">రోజుకు రెండుసార్లు పళ్ళు తోముకోండి</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Use a soft-bristled brush and fluoride toothpaste. Brush gently along the gum line for at least 2 minutes every morning and night.
            </p>
          </Card>

          <Card padding="md" className="space-y-2">
            <div className="p-3 rounded-xl bg-forest-100 text-forest-900 w-fit">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-ink">Clean Your Tongue Gently</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-1">నాలుకను సున్నితంగా శుభ్రం చేయండి</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Bacteria accumulate on the tongue surface. Clean with your toothbrush or a smooth tongue cleaner without harsh scraping.
            </p>
          </Card>

          <Card padding="md" className="space-y-2">
            <div className="p-3 rounded-xl bg-forest-100 text-forest-900 w-fit">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-ink">Rinse After Every Meal</h4>
            <p className="text-xs font-telugu text-forest-800 font-semibold -mt-1">భోజనం తర్వాత నోటిని శుభ్రంగా కడగండి</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Rinsing with clean water after eating removes food particles, neutralizes acids, and prevents bacterial plaque formation.
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
};
