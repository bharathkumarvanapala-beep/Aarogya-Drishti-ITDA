import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Volume2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { ArrowRight } from 'lucide-react';
import { saveActiveScreening, type ActiveScreeningData } from '../../services/clinicalDataService';

export const ScreeningIntakePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navPatient = location.state?.patient;

  // Resolve active patient: navigation state -> sessionStorage -> fallback demo
  const resolveInitialPatient = () => {
    if (navPatient) {
      const name = navPatient.fullName || `${navPatient.firstName || ''} ${navPatient.lastName || ''}`.trim() || 'Registered Citizen';
      const habitation = navPatient.habitation || [navPatient.village, navPatient.gramPanchayat ? `${navPatient.gramPanchayat} GP` : '', navPatient.mandal].filter(Boolean).join(', ') || 'ASR District';
      const initials = ((navPatient.firstName?.[0] || name[0] || 'P') + (navPatient.lastName?.[0] || name.split(' ')[1]?.[0] || 'T')).toUpperCase();
      return {
        id: navPatient.uniquePatientId || navPatient.id || 'ASR-PAT-2026-0842',
        name,
        nameTe: navPatient.firstNameTe ? `${navPatient.firstNameTe} ${navPatient.lastNameTe || ''}`.trim() : '',
        age: navPatient.age || 35,
        gender: typeof navPatient.gender === 'string' ? navPatient.gender.charAt(0).toUpperCase() + navPatient.gender.slice(1) : 'Male',
        habitation,
        mandal: navPatient.mandal || 'G. Madugula',
        gramPanchayat: navPatient.gramPanchayat || '',
        initials,
        isCustom: true,
      };
    }

    try {
      const stored = sessionStorage.getItem('active_screening_patient');
      if (stored) {
        const parsed = JSON.parse(stored);
        const name = parsed.fullName || `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || 'Registered Citizen';
        const habitation = parsed.habitation || [parsed.village, parsed.gramPanchayat ? `${parsed.gramPanchayat} GP` : '', parsed.mandal].filter(Boolean).join(', ') || 'ASR District';
        const initials = ((parsed.firstName?.[0] || name[0] || 'P') + (parsed.lastName?.[0] || name.split(' ')[1]?.[0] || 'T')).toUpperCase();
        return {
          id: parsed.uniquePatientId || parsed.id || 'ASR-PAT-2026-0842',
          name,
          nameTe: parsed.firstNameTe ? `${parsed.firstNameTe} ${parsed.lastNameTe || ''}`.trim() : '',
          age: parsed.age || 35,
          gender: typeof parsed.gender === 'string' ? parsed.gender.charAt(0).toUpperCase() + parsed.gender.slice(1) : 'Male',
          habitation,
          mandal: parsed.mandal || 'G. Madugula',
          gramPanchayat: parsed.gramPanchayat || '',
          initials,
          isCustom: true,
        };
      }
    } catch (e) {
      // ignore
    }

    return {
      id: 'ASR-PAT-2026-0842',
      name: 'Kondala Rao (కొండల రావు)',
      nameTe: 'కొండల రావు',
      age: 46,
      gender: 'Male',
      habitation: 'Kothapalli, G. Madugula',
      mandal: 'G. Madugula',
      gramPanchayat: 'Kothapalli',
      initials: 'KR',
      isCustom: false,
    };
  };

  const [patient] = useState(resolveInitialPatient);

  // Consent is pre-confirmed (verbal assent documented per protocol)
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentType, setConsentType] = useState<'verbal' | 'thumb' | 'written'>('verbal');
  const [witnessName, setWitnessName] = useState('Lakshmi Devi (ASHA Worker)');

  // Habits State: customize for newly registered patient vs demo walkthrough
  const isKondala = !patient.isCustom;
  const [chewingTobacco, setChewingTobacco] = useState(isKondala);
  const [chewingFrequency, setChewingFrequency] = useState(isKondala ? '4-5 packets/day' : '');
  const [chewingYears, setChewingYears] = useState(isKondala ? '22' : '');
  const [smoking, setSmoking] = useState(false);
  const [reverseSmoking, setReverseSmoking] = useState(isKondala);
  const [alcohol, setAlcohol] = useState(false);

  // Symptoms State
  const [persistentPatch, setPersistentPatch] = useState(isKondala);
  const [patchType, setPatchType] = useState<'white' | 'red' | 'mixed'>('white');
  const [patchLocation, setPatchLocation] = useState('right_cheek');
  const [nonHealingUlcer, setNonHealingUlcer] = useState(false);
  const [burningSensation, setBurningSensation] = useState(isKondala);
  const [restrictedMouthOpening, setRestrictedMouthOpening] = useState(isKondala);
  const [mouthFingers, setMouthFingers] = useState(isKondala ? 2.5 : 3.5);
  const [swellingLump, setSwellingLump] = useState(false);
  const [symptomDurationWeeks, setSymptomDurationWeeks] = useState(isKondala ? '3' : '');
  const [workerNotes, setWorkerNotes] = useState(isKondala ? 'Patient reports white rough patch on right inner cheek. Sensation of burning with spicy curries.' : '');

  const handleConfirmConsent = () => {
    setShowConsentModal(false);
  };

  const handleProceedToCamera = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Package all problem details, habits, symptoms, and active patient data
    const screeningPayload: ActiveScreeningData = {
      patient: {
        id: patient.id,
        uniquePatientId: patient.id,
        name: patient.name,
        nameTe: patient.nameTe,
        age: patient.age,
        gender: patient.gender,
        habitation: patient.habitation,
        mandal: patient.mandal,
        gramPanchayat: patient.gramPanchayat,
      },
      habits: {
        chewingTobacco,
        chewingFrequency,
        chewingYears,
        smoking,
        reverseSmoking,
        alcohol,
      },
      symptoms: {
        persistentPatch,
        patchType,
        patchLocation,
        nonHealingUlcer,
        burningSensation,
        restrictedMouthOpening,
        mouthFingers,
        swellingLump,
        symptomDurationWeeks,
      },
      workerNotes,
      consentType,
      witnessName,
      updatedAt: new Date().toISOString(),
    };

    saveActiveScreening(screeningPayload);
    try {
      sessionStorage.setItem('active_screening_patient', JSON.stringify(patient));
      sessionStorage.setItem('active_screening_intake', JSON.stringify(screeningPayload));
    } catch {
      // ignore
    }

    navigate('/health-worker/screening/camera', { 
      state: { 
        patient, 
        screeningData: screeningPayload 
      } 
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
            Clinical Intake & Consent
          </span>
          <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
            Frontline Protocol
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
          Guided Oral Screening & Risk Questionnaire
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          Mandatory informed consent, exposure history, and symptoms checklist before camera capture.
        </p>
      </div>

      {/* Patient Header Card */}
      <Card variant="nature" padding="md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold font-mono">
              {patient.initials}
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded">
                {patient.id}
              </span>
              <h3 className="text-lg font-bold text-ink">
                {patient.name}
              </h3>
              <p className="text-xs text-ink-muted">
                {patient.age} Yrs • {patient.gender} • Habitation: {patient.habitation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>CONSENT CONFIRMED</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Form Container */}
      <form onSubmit={handleProceedToCamera} className="space-y-6">
        
        {/* Habit & Exposure History */}
        <Card 
          title="Habit & Exposure History" 
          titleTe="అలవాట్లు మరియు పొగాకు వివరాలు" 
          subtitle="Long-term tobacco, gutkha, and reverse smoking exposure"
        >
          <div className="space-y-4">
            
            {/* Chewing Tobacco */}
            <div className="p-4 rounded-xl bg-forest-50/60 border border-forest-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-ink block">
                    Chewing Tobacco / Gutkha / Khaini / Zarda
                  </span>
                  <span className="text-xs font-telugu text-forest-800">
                    గుట్కా, ఖైనీ లేదా నమిలే పొగాకు అలవాటు
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-ink cursor-pointer">
                    <input 
                      type="radio" 
                      name="chewing" 
                      checked={chewingTobacco} 
                      onChange={() => setChewingTobacco(true)} 
                      className="text-forest-800"
                    />
                    <span>Yes (ఉంది)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-ink cursor-pointer">
                    <input 
                      type="radio" 
                      name="chewing" 
                      checked={!chewingTobacco} 
                      onChange={() => setChewingTobacco(false)} 
                      className="text-forest-800"
                    />
                    <span>No (లేదు)</span>
                  </label>
                </div>
              </div>

              {chewingTobacco && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-forest-100">
                  <div>
                    <label className="block text-[11px] font-bold text-ink mb-1">
                      Daily Frequency (రోజుకు ఎన్ని ప్యాకెట్లు)
                    </label>
                    <input 
                      type="text" 
                      value={chewingFrequency}
                      onChange={(e) => setChewingFrequency(e.target.value)}
                      placeholder="e.g., 4-5 packets/day"
                      className="w-full text-xs p-2.5 rounded-lg border border-forest-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-ink mb-1">
                      Duration in Years (ఎన్ని సంవత్సరాలుగా)
                    </label>
                    <input 
                      type="text" 
                      value={chewingYears}
                      onChange={(e) => setChewingYears(e.target.value)}
                      placeholder="e.g., 22 years"
                      className="w-full text-xs p-2.5 rounded-lg border border-forest-200 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reverse Smoking (Chutta) - Tribal Specific */}
            <div className="p-4 rounded-xl bg-forest-50/60 border border-forest-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-ink block">
                  Reverse Smoking / Chutta (అడ్డా పొగ చుట్ట)
                </span>
                <span className="text-xs font-telugu text-forest-800">
                  నిప్పు భాగాన్ని నోటి లోపల ఉంచి కాల్చే చుట్ట (గిరిజన ప్రాంత సాంప్రదాయం)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs font-bold text-ink cursor-pointer">
                  <input 
                    type="radio" 
                    name="reverseSmoking" 
                    checked={reverseSmoking} 
                    onChange={() => setReverseSmoking(true)} 
                    className="text-forest-800"
                  />
                  <span>Yes (ఉంది)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-ink cursor-pointer">
                  <input 
                    type="radio" 
                    name="reverseSmoking" 
                    checked={!reverseSmoking} 
                    onChange={() => setReverseSmoking(false)} 
                    className="text-forest-800"
                  />
                  <span>No (లేదు)</span>
                </label>
              </div>
            </div>

            {/* Standard Smoking & Alcohol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-ink block">Beedi / Cigarette Smoking</span>
                  <span className="text-[11px] text-ink-muted">సాధారణ ధూమపానం</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={smoking} 
                    onChange={(e) => setSmoking(e.target.checked)}
                    className="rounded text-forest-800"
                  />
                  <span className="text-xs font-medium">Yes</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-ink block">Alcohol Consumption</span>
                  <span className="text-[11px] text-ink-muted">మద్యపానం</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={alcohol} 
                    onChange={(e) => setAlcohol(e.target.checked)}
                    className="rounded text-forest-800"
                  />
                  <span className="text-xs font-medium">Yes</span>
                </div>
              </div>
            </div>

          </div>
        </Card>

        {/* Symptoms Checklist */}
        <Card 
          title="Symptoms & Clinical Signs Checklist" 
          titleTe="లక్షణాలు మరియు నోటి పరిశీలన" 
          subtitle="Frontline visual examination indicators"
        >
          <div className="space-y-4">
            
            {/* White/Red Patch */}
            <div className="p-4 rounded-xl bg-forest-50/60 border border-forest-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-ink block">
                    Persistent White or Red Patch in Mouth (&gt; 3 Weeks)
                  </span>
                  <span className="text-xs font-telugu text-forest-800">
                    నోటి లోపల 3 వారాలకు మించి తగ్గని తెల్లటి లేదా ఎర్రటి మచ్చ
                  </span>
                </div>
                <input 
                  type="checkbox"
                  checked={persistentPatch}
                  onChange={(e) => setPersistentPatch(e.target.checked)}
                  className="w-5 h-5 rounded text-forest-800 focus:ring-forest-700"
                />
              </div>

              {persistentPatch && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-forest-100 text-xs">
                  <div>
                    <label className="block font-bold text-ink mb-1">Patch Appearance</label>
                    <select 
                      value={patchType}
                      onChange={(e) => setPatchType(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg border border-forest-200 bg-white"
                    >
                      <option value="white">White Patch (Leukoplakia / లైకోప్లేకియా)</option>
                      <option value="red">Red Velvety Patch (Erythroplakia / ఎరిథ్రోప్లేకియా)</option>
                      <option value="mixed">Mixed Red & White (Speckled)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-ink mb-1">Primary Anatomical Location</label>
                    <select 
                      value={patchLocation}
                      onChange={(e) => setPatchLocation(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-forest-200 bg-white"
                    >
                      <option value="right_cheek">Right Buccal Mucosa (కుడి దవడ లోపల)</option>
                      <option value="left_cheek">Left Buccal Mucosa (ఎడమ దవడ లోపల)</option>
                      <option value="tongue">Lateral Tongue Border (నాలుక ప్రక్క భాగం)</option>
                      <option value="palate">Hard Palate (అంగిలి)</option>
                      <option value="floor_mouth">Floor of Mouth (నాలుక కింద)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Other Cardinal Signs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-100 flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={nonHealingUlcer}
                  onChange={(e) => setNonHealingUlcer(e.target.checked)}
                  className="mt-0.5 rounded text-forest-800"
                />
                <div>
                  <span className="font-bold text-xs text-ink block">Non-healing mouth ulcer (&gt; 2 weeks)</span>
                  <span className="text-[11px] text-forest-800 font-telugu">మానని నోటి పుండు</span>
                </div>
              </label>

              <label className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-100 flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={burningSensation}
                  onChange={(e) => setBurningSensation(e.target.checked)}
                  className="mt-0.5 rounded text-forest-800"
                />
                <div>
                  <span className="font-bold text-xs text-ink block">Burning sensation with spicy foods</span>
                  <span className="text-[11px] text-forest-800 font-telugu">కారం తిన్నప్పుడు తీవ్రమైన మంట</span>
                </div>
              </label>

              <label className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-100 flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={swellingLump}
                  onChange={(e) => setSwellingLump(e.target.checked)}
                  className="mt-0.5 rounded text-forest-800"
                />
                <div>
                  <span className="font-bold text-xs text-ink block">Unexplained swelling or neck lump</span>
                  <span className="text-[11px] text-forest-800 font-telugu">మెడలో లేదా దవడలో వాపు/గడ్డ</span>
                </div>
              </label>

              {/* Mouth Opening Difficulty */}
              <div className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-100 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={restrictedMouthOpening}
                    onChange={(e) => setRestrictedMouthOpening(e.target.checked)}
                    className="mt-0.5 rounded text-forest-800"
                  />
                  <div>
                    <span className="font-bold text-xs text-ink block">Restricted mouth opening (నోరు తెరవలేకపోవడం)</span>
                    <span className="text-[11px] text-forest-800 font-telugu">ఓరల్ సబ్‌మ్యూకస్ ఫైబ్రోసిస్ అనుమానం</span>
                  </div>
                </label>
                {restrictedMouthOpening && (
                  <div className="pl-6 pt-1 flex items-center gap-2 text-xs">
                    <span className="text-ink-muted">Mouth opening:</span>
                    <input 
                      type="number"
                      step="0.5"
                      min="1"
                      max="4"
                      value={mouthFingers}
                      onChange={(e) => setMouthFingers(Number(e.target.value))}
                      className="w-16 p-1 border rounded font-mono text-center font-bold"
                    />
                    <span className="font-mono font-bold text-forest-900">fingers (~2.5 cm)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Duration & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Symptom Duration (Weeks)
                </label>
                <input 
                  type="number"
                  value={symptomDurationWeeks}
                  onChange={(e) => setSymptomDurationWeeks(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-ink mb-1">
                  Health Worker Field Observations (ఫీల్డ్ పరిశీలనలు)
                </label>
                <input 
                  type="text"
                  value={workerNotes}
                  onChange={(e) => setWorkerNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white"
                />
              </div>
            </div>

          </div>
        </Card>

        {/* Save & Next Action Button Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-forest-900 text-white shadow-nature">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-300 font-bold block">
              Problem Details & Symptoms Documented
            </span>
            <span className="text-sm font-bold block">
              Save Assessment & Proceed to Guided Oral Screening Test
            </span>
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            type="submit" 
            icon={ArrowRight}
            iconPosition="right"
            className="bg-emerald-600 hover:bg-emerald-500 font-bold text-base px-6 py-3 shadow-lg"
          >
            Save & Next (సేవ్ చేసి తదుపరి: గైడెడ్ స్క్రీనింగ్)
          </Button>
        </div>

      </form>

      {/* Informed Consent Modal */}
      <Modal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        title="Informed Bilingual Screening Consent"
        titleTe="నోటి స్క్రీనింగ్ మరియు ఫోటోల కొరకు సమ్మతి పత్రం"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 space-y-2">
            <div className="flex items-center gap-2 text-forest-900 font-bold text-sm">
              <Volume2 className="w-5 h-5 text-forest-800" />
              <span>Verbal Explanation Script in Telugu (రోగికి వివరించాల్సిన సారాంశం):</span>
            </div>
            <p className="text-ink leading-relaxed font-telugu text-sm">
              "ఈ నోటి స్క్రీనింగ్ మరియు ఫోటోలు కేవలం అనుమానాస్పద మార్పులను గుర్తించి వైద్యుల పరిశీలనకు పంపేందుకు మాత్రమే. ఇది క్యాన్సర్ వ్యాధి నిర్ధారణ కాదు. మీ ఫోటోలు ప్రభుత్వ వైద్యాధికారుల పరిశీలన కొరకు మాత్రమే సురక్షితంగా ఉపయోగించబడతాయి. ఈ సేవలు పూర్తిగా ఉచితం."
            </p>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-ink">
              Mode of Consent Recording (సమ్మతి రకం)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConsentType('verbal')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  consentType === 'verbal' 
                    ? 'border-forest-800 bg-forest-100/60 font-bold text-forest-950' 
                    : 'border-forest-200 text-ink-muted'
                }`}
              >
                Verbal Assent (మౌఖిక సమ్మతి)
              </button>
              <button
                type="button"
                onClick={() => setConsentType('thumb')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  consentType === 'thumb' 
                    ? 'border-forest-800 bg-forest-100/60 font-bold text-forest-950' 
                    : 'border-forest-200 text-ink-muted'
                }`}
              >
                Witnessed Mark (వేలిముద్ర)
              </button>
              <button
                type="button"
                onClick={() => setConsentType('written')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  consentType === 'written' 
                    ? 'border-forest-800 bg-forest-100/60 font-bold text-forest-950' 
                    : 'border-forest-200 text-ink-muted'
                }`}
              >
                Signature (సంతకం)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">
              Recorded & Witnessed By (సాక్ష్యం ఇచ్చిన ఆశా కార్యకర్త)
            </label>
            <input 
              type="text" 
              value={witnessName}
              onChange={(e) => setWitnessName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-forest-200 bg-white text-xs"
            />
          </div>

          <Alert type="info" title="Clinical Ethics & Non-Coercion" titleTe="నైతిక ప్రమాణాలు">
            <p>
              Consent is voluntary. Refusal to consent to photography does not affect the patient's right to routine healthcare examination at the Primary Health Centre.
            </p>
          </Alert>

          <div className="pt-3 border-t border-forest-100 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowConsentModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmConsent} icon={CheckCircle2}>
              Confirm Consent & Proceed
            </Button>
          </div>

        </div>
      </Modal>
    </div>
  );
};
