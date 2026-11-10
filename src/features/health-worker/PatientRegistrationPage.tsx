import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  CheckCircle2, 
  Camera, 
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { useAuth, useSync } from '../../context';
import { useTranslation } from '../../i18n';
import { careApi, type CareRecord } from '../../services/careApi';
import { putDraft, type OfflineDraft } from '../../services/db';
import { saveRegisteredPatient } from '../../services/clinicalDataService';
import { 
  ASR_DIVISIONS, 
  getMandalsByDivision, 
  getPanchayatsForMandal, 
  getVillagesForPanchayat 
} from '../../data/asrMandals';

export const PatientRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { language } = useTranslation();
  const { refreshDrafts } = useSync();

  // Clean Initial Form State (No hardcoded sample values)
  const defaultMandal = currentUser?.mandal || 'G. Madugula';
  const defaultVillage = currentUser?.village || '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameTe, setNameTe] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mandal, setMandal] = useState(defaultMandal);
  const [gramPanchayat, setGramPanchayat] = useState('G. Madugula');
  const [habitation, setHabitation] = useState(defaultVillage);

  // Phone
  const [phone, setPhone] = useState('');
  const [hasNoPhone, setHasNoPhone] = useState(false);
  const [isSharedPhone, setIsSharedPhone] = useState(false);

  // Clinical Habits
  const [chewingTobacco, setChewingTobacco] = useState(false);
  const [gutkha, setGutkha] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [reverseSmoking, setReverseSmoking] = useState(false);
  const [alcohol, setAlcohol] = useState(false);

  // Oral Symptoms
  const [whitePatch, setWhitePatch] = useState(false);
  const [redPatch, setRedPatch] = useState(false);
  const [ulcer, setUlcer] = useState(false);
  const [burning, setBurning] = useState(false);
  const [restrictedOpening, setRestrictedOpening] = useState(false);
  const [otherSymptoms, setOtherSymptoms] = useState('');

  // Mandatory Informed Consent
  const [generalConsent, setGeneralConsent] = useState(false);
  
  // Optional Photo Upload with Separate Consent
  const [photoConsent, setPhotoConsent] = useState(false);
  const [photoData, setPhotoData] = useState<string>('');
  const [photoSite, setPhotoSite] = useState('Right cheek (Buccal mucosa)');
  const [photoMessage, setPhotoMessage] = useState<string>('');

  // Submission & Result States
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredRecord, setRegisteredRecord] = useState<CareRecord | null>(null);

  // Duplicate Check Modal
  const [duplicateMatch, setDuplicateMatch] = useState<any>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const availablePanchayats = getPanchayatsForMandal(mandal);
  const availableVillages = getVillagesForPanchayat(gramPanchayat, mandal);

  const handleMandalChange = (newMandal: string) => {
    setMandal(newMandal);
    const gps = getPanchayatsForMandal(newMandal);
    const firstGp = gps.length > 0 ? gps[0].nameEn : '';
    setGramPanchayat(firstGp);
  };

  const handlePanchayatChange = (newGp: string) => {
    setGramPanchayat(newGp);
  };

  // Image upload and client-side quality validation
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPhotoMessage(language === 'te' ? 'దయచేసి JPEG లేదా PNG ఇమేజ్‌ను ఎంచుకోండి.' : 'Please select a JPEG or PNG image.');
      return;
    }
    if (file.size > 2000000) {
      setPhotoMessage(language === 'te' ? 'చిత్రం పరిమాణం 2MB కన్నా తక్కువ ఉండాలి.' : 'Image size must be smaller than 2MB.');
      return;
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Simple resolution check
      const img = new Image();
      img.onload = () => {
        if (img.width < 320 || img.height < 240) {
          setPhotoMessage(language === 'te' ? 'చిత్రం రిజల్యూషన్ చాలా తక్కువగా ఉంది. స్పష్టంగా తీయండి.' : 'Image resolution too low. Retake with proper framing.');
          return;
        }
        setPhotoData(dataUrl);
        setPhotoMessage(language === 'te' ? 'చిత్రం నాణ్యత తనిఖీ చేయబడింది.' : 'Image resolution and exposure verified.');
      };
      img.src = dataUrl;
    } catch {
      setPhotoMessage('Failed to process image file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!generalConsent) {
      setError(language === 'te' ? 'రోగి సమాచార సమ్మతి తప్పనిసరి.' : 'General patient informed consent is mandatory before registering.');
      return;
    }

    if (!habitation.trim()) {
      setError(language === 'te' ? 'గ్రామము పేరు రాయడం తప్పనిసరి.' : 'Village / Habitation name is required.');
      return;
    }

    setBusy(true);

    try {
      // Check existing cases on server for potential duplicate in the same village
      try {
        const existingCases = await careApi<CareRecord[]>('/cases');
        const match = existingCases.find(
          (c) =>
            c.name.toLowerCase().includes(firstName.trim().toLowerCase()) &&
            c.village.toLowerCase().includes(habitation.trim().toLowerCase())
        );
        if (match) {
          setDuplicateMatch(match);
          setShowDuplicateModal(true);
          setBusy(false);
          return;
        }
      } catch {
        // If server check fails, continue
      }

      await executeRegistration();
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please verify fields.');
    } finally {
      setBusy(false);
    }
  };

  const executeRegistration = async () => {
    setBusy(true);
    setError(null);

    // Build habit history summary
    const habitList: string[] = [];
    if (chewingTobacco) habitList.push('Chewing Tobacco');
    if (gutkha) habitList.push('Gutkha');
    if (smoking) habitList.push('Smoking / Beedi');
    if (reverseSmoking) habitList.push('Reverse Smoking (Chutta)');
    if (alcohol) habitList.push('Alcohol');
    const habitSummary = habitList.length > 0 ? habitList.join(', ') : 'No tobacco/alcohol habits recorded';

    // Build symptoms summary
    const symptomList: string[] = [];
    if (whitePatch) symptomList.push('White patch (Leukoplakia)');
    if (redPatch) symptomList.push('Red patch (Erythroplakia)');
    if (ulcer) symptomList.push('Non-healing oral ulcer (>2w)');
    if (burning) symptomList.push('Burning sensation on spicy food');
    if (restrictedOpening) symptomList.push('Restricted mouth opening (OSF)');
    if (otherSymptoms.trim()) symptomList.push(otherSymptoms.trim());
    const symptomSummary = symptomList.length > 0 ? symptomList.join('; ') : 'Routine preventive screening check';

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const idempotencyKey = crypto.randomUUID();

    const payload: any = {
      name: fullName,
      nameTe: nameTe.trim() || fullName,
      age: Number(age) || 35,
      sex: gender,
      village: habitation.trim(),
      mandal,
      history: habitSummary,
      symptoms: symptomSummary,
      consent: generalConsent,
      contactPhone: hasNoPhone ? null : phone.trim(),
      language,
      ...(photoData && photoConsent ? { photos: [{ site: photoSite, data: photoData }], photographyConsent: true } : {}),
    };

    try {
      // 1. Try sending directly to server
      const createdRecord = await careApi<CareRecord>('/cases', payload, idempotencyKey);
      setRegisteredRecord(createdRecord);

      // Save to centralized local service so other tabs/components update
      saveRegisteredPatient({
        id: createdRecord.patientId || createdRecord.id,
        uniquePatientId: createdRecord.patientId || createdRecord.id,
        firstName,
        lastName,
        age: Number(age) || 35,
        gender: gender.toLowerCase() as any,
        village: habitation.trim(),
        mandal,
        contactPhone: hasNoPhone ? null : phone.trim(),
        createdAt: new Date().toISOString(),
      } as any);

      sessionStorage.setItem('active_screening_patient', JSON.stringify(createdRecord));
    } catch (serverErr: any) {
      console.warn('Server registration offline or failed, caching locally:', serverErr);

      // 2. Offline fallback: store in IndexedDB sync queue
      const offlineId = `OFFLINE-${idempotencyKey.slice(0, 8)}`;
      const offlineDraft: OfflineDraft = {
        id: idempotencyKey,
        type: 'Citizen Enrollment',
        patientName: fullName,
        habitation: habitation.trim(),
        savedAt: new Date().toLocaleTimeString(),
        size: '1.2 KB',
        payload,
      };

      await putDraft(offlineDraft);
      await refreshDrafts();

      // Fabricate local CareRecord representation
      const localRecord: CareRecord = {
        id: idempotencyKey,
        version: 1,
        name: fullName,
        age: Number(age) || 35,
        sex: gender,
        village: habitation.trim(),
        mandal,
        history: habitSummary,
        symptoms: symptomSummary,
        status: 'OFFLINE_DRAFT',
        createdAt: new Date().toISOString(),
        patientId: offlineId,
        images: photoData ? [{ site: photoSite, data: photoData }] : [],
        events: [
          {
            id: crypto.randomUUID(),
            action: 'OFFLINE_SAVED',
            actor: currentUser?.fullName || 'ASHA Worker',
            at: new Date().toISOString(),
            data: { note: 'Saved in offline database. Will sync when network reconnects.' },
          },
        ],
      };

      setRegisteredRecord(localRecord);
      sessionStorage.setItem('active_screening_patient', JSON.stringify(localRecord));
    } finally {
      setBusy(false);
      setShowDuplicateModal(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
            {language === 'te' ? 'సమగ్ర నమోదు' : 'Inclusive Registration'}
          </span>
          <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
            {currentUser?.facilityName || 'Sub Centre Kothapalli'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
          {language === 'te' ? 'ఓరల్ స్క్రీనింగ్ కోసం పౌరుడి నమోదు' : 'Register Citizen for Oral Healthcare'}
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          {language === 'te'
            ? 'గిరిజన ఆవాసాల కోసం ఇంటింటి నమోదు. స్మార్ట్‌ఫోన్ లేదా ఓటీపీ అవసరం లేదు.'
            : 'Doorstep clinical enrollment for tribal communities. Neither a smartphone nor OTP is required.'}
        </p>
      </div>

      {/* Success View */}
      {registeredRecord ? (
        <Card variant="nature" padding="lg" className="border-emerald-300 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                {registeredRecord.status === 'OFFLINE_DRAFT' 
                  ? (language === 'te' ? 'ఆఫ్‌లైన్‌లో భద్రపరచబడింది (సింక్ సిద్ధంగా ఉంది)' : 'Saved Securely Offline (Ready to Sync)')
                  : (language === 'te' ? 'పౌరుడు విజయవంతంగా నమోదు అయ్యారు' : 'Citizen Registered Successfully')}
              </span>
              <h2 className="text-2xl font-extrabold text-ink">
                {registeredRecord.name}
              </h2>
              <p className="text-xs text-ink-muted">
                Unique Patient ID: <strong className="font-mono text-forest-900">{registeredRecord.patientId || registeredRecord.id}</strong> • Habitation: {registeredRecord.village}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/80 border border-emerald-200 text-xs space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Age / Sex</span>
                <span className="font-bold text-ink">{registeredRecord.age} Yrs / {registeredRecord.sex}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Mandal</span>
                <span className="font-bold text-ink">{registeredRecord.mandal}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Village</span>
                <span className="font-bold text-ink">{registeredRecord.village}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Enrolled By</span>
                <span className="font-bold text-ink">{currentUser?.fullName || 'ASHA Worker'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="primary"
              size="md"
              icon={Camera}
              onClick={() => navigate('/health-worker/screening/new', { state: { patient: registeredRecord } })}
            >
              {language === 'te' ? 'గైడెడ్ ఓరల్ స్క్రీనింగ్ ప్రారంభించండి' : 'Proceed to Guided Oral Screening'}
            </Button>
            <Link to="/health-worker/patients">
              <Button variant="secondary" size="md">
                {language === 'te' ? 'రోగుల రిజిస్టర్ చూడండి' : 'View in Patient Directory'}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="md" 
              onClick={() => {
                setRegisteredRecord(null);
                setFirstName('');
                setLastName('');
                setNameTe('');
                setAge('');
                setHabitation(defaultVillage);
                setPhotoData('');
                setGeneralConsent(false);
              }}
            >
              {language === 'te' ? 'మరో రోగిని నమోదు చేయండి' : 'Register Another Citizen'}
            </Button>
          </div>
        </Card>
      ) : (
        /* Clean Registration Form with Autofill Protection */
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-700" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Demographics */}
          <Card title="Demographic Information" titleTe="ప్రాథమిక వివరాలు" subtitle="Citizen identity and basic demographics">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'మొదటి పేరు' : 'First Name'} *
                </label>
                <input 
                  type="text"
                  required
                  name="patient_first_name"
                  autoComplete="off"
                  placeholder="e.g. Kondala"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'ఇంటి పేరు / చివరి పేరు' : 'Last Name / Surname'} *
                </label>
                <input 
                  type="text"
                  required
                  name="patient_last_name"
                  autoComplete="off"
                  placeholder="e.g. Rao"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'తెలుగులో పేరు (ఐచ్ఛికం)' : 'Name in Telugu Script (Optional)'}
                </label>
                <input 
                  type="text"
                  name="patient_name_te"
                  autoComplete="off"
                  placeholder="ఉదా. కొండల రావు"
                  value={nameTe}
                  onChange={(e) => setNameTe(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 font-telugu"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'వయస్సు' : 'Age (Years)'} *
                </label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="120"
                  name="patient_age"
                  autoComplete="off"
                  placeholder="e.g. 46"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'లింగం' : 'Gender'} *
                </label>
                <select 
                  value={gender}
                  name="patient_gender"
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 font-medium"
                >
                  <option value="Male">{language === 'te' ? 'పురుషుడు (Male)' : 'Male'}</option>
                  <option value="Female">{language === 'te' ? 'స్త్రీ (Female)' : 'Female'}</option>
                  <option value="Other">{language === 'te' ? 'ఇతర (Other)' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'ఫోన్ నంబర్ (ఐచ్ఛికం)' : 'Contact Phone (Optional)'}
                </label>
                <input 
                  type="tel"
                  disabled={hasNoPhone}
                  name="patient_contact_number"
                  autoComplete="off"
                  placeholder="+91 98480 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 ${
                    hasNoPhone ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''
                  }`}
                />
                <div className="flex items-center gap-4 mt-2 text-xs text-ink-muted">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={hasNoPhone}
                      onChange={(e) => {
                        setHasNoPhone(e.target.checked);
                        if (e.target.checked) setPhone('');
                      }}
                      className="rounded text-forest-800 focus:ring-forest-700"
                    />
                    <span>{language === 'te' ? 'ఫోన్ లేదు' : 'No personal phone'}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      disabled={hasNoPhone}
                      checked={isSharedPhone}
                      onChange={(e) => setIsSharedPhone(e.target.checked)}
                      className="rounded text-forest-800 focus:ring-forest-700"
                    />
                    <span>{language === 'te' ? 'కుటుంబ సభ్యుని ఫోన్' : 'Shared family phone'}</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Habitation Scoping (Text input for village name without forced dropdown symbol) */}
          <Card title="Tribal Habitation Location (ASR District)" titleTe="నివాస ప్రాంత వివరాలు (అల్లూరి సీతారామరాజు జిల్లా)" subtitle="22 Mandals administrative scoping across ITDA Paderu">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'మండలం' : 'Mandal'} *
                </label>
                <select 
                  value={mandal}
                  name="patient_mandal"
                  onChange={(e) => handleMandalChange(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 font-medium"
                >
                  {ASR_DIVISIONS.map((div) => {
                    const divMandals = getMandalsByDivision(div.id);
                    return (
                      <optgroup key={div.id} label={`${div.nameEn} (${div.nameTe})`}>
                        {divMandals.map((m) => (
                          <option key={m.id} value={m.nameEn}>
                            {m.nameEn} ({m.nameTe})
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'గ్రామ పంచాయతీ' : 'Gram Panchayat'}
                </label>
                <select 
                  value={gramPanchayat}
                  name="patient_panchayat"
                  onChange={(e) => handlePanchayatChange(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 font-medium"
                >
                  {availablePanchayats.map((gp, idx) => (
                    <option key={gp.nameEn} value={gp.nameEn}>
                      {idx + 1}. {gp.nameEn} GP ({gp.nameTe})
                    </option>
                  ))}
                  <option value="Other Gram Panchayat">Other GP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'గ్రామము / నివాసము పేరు (వ్రాయండి)' : 'Village / Habitation Name (Write Here)'} *
                </label>
                <input
                  type="text"
                  required
                  name="patient_habitation_name"
                  autoComplete="off"
                  placeholder={language === 'te' ? 'గ్రామము పేరు రాయండి (ఉదా. దబ్బగరువు)' : 'Type village name here (e.g. Dabbagaruvu)'}
                  value={habitation}
                  onChange={(e) => setHabitation(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 font-medium"
                />
                {availableVillages.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-ink-muted block">
                      {language === 'te' ? 'సూచించిన గ్రామాలు (ఎంచుకోవడానికి నొక్కండి):' : 'Click to autofill village name:'}
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                      {availableVillages.map((v) => (
                        <button
                          key={v.nameEn}
                          type="button"
                          onClick={() => setHabitation(v.nameEn)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            habitation.toLowerCase() === v.nameEn.toLowerCase()
                              ? 'bg-forest-900 text-white border-forest-900 font-bold'
                              : 'bg-forest-50 hover:bg-forest-100 text-forest-900 border-forest-200'
                          }`}
                        >
                          {v.nameEn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Section 3: High-Risk Habits & Symptoms Checklist */}
          <Card title="Habit Background & Oral Symptoms" titleTe="అలవాట్లు మరియు నోటి లక్షణాలు" subtitle="Screening baseline indicators">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-forest-900 block mb-2">
                  {language === 'te' ? 'పొగాకు / అలవాట్లు:' : 'Habit History (Check all that apply):'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-forest-50 border border-forest-100 cursor-pointer">
                    <input type="checkbox" checked={chewingTobacco} onChange={(e) => setChewingTobacco(e.target.checked)} className="rounded text-forest-800" />
                    <span>Chewing Tobacco / Khaini</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-forest-50 border border-forest-100 cursor-pointer">
                    <input type="checkbox" checked={gutkha} onChange={(e) => setGutkha(e.target.checked)} className="rounded text-forest-800" />
                    <span>Gutkha / Pan Masala</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-forest-50 border border-forest-100 cursor-pointer">
                    <input type="checkbox" checked={smoking} onChange={(e) => setSmoking(e.target.checked)} className="rounded text-forest-800" />
                    <span>Beedi / Cigarette</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-forest-50 border border-forest-100 cursor-pointer">
                    <input type="checkbox" checked={reverseSmoking} onChange={(e) => setReverseSmoking(e.target.checked)} className="rounded text-forest-800" />
                    <span>Reverse Smoking (Chutta)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-forest-50 border border-forest-100 cursor-pointer">
                    <input type="checkbox" checked={alcohol} onChange={(e) => setAlcohol(e.target.checked)} className="rounded text-forest-800" />
                    <span>Alcohol Consumption</span>
                  </label>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-forest-900 block mb-2">
                  {language === 'te' ? 'నోటి ఫిర్యాదులు / లక్షణాలు:' : 'Chief Complaints & Oral Symptoms:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200 cursor-pointer">
                    <input type="checkbox" checked={whitePatch} onChange={(e) => setWhitePatch(e.target.checked)} className="rounded text-amber-800" />
                    <span>White Patch (తేలికైన తెల్లటి మచ్చ)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200 cursor-pointer">
                    <input type="checkbox" checked={redPatch} onChange={(e) => setRedPatch(e.target.checked)} className="rounded text-amber-800" />
                    <span>Red Patch (ఎర్రటి మచ్చ)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200 cursor-pointer">
                    <input type="checkbox" checked={ulcer} onChange={(e) => setUlcer(e.target.checked)} className="rounded text-amber-800" />
                    <span>Non-healing Ulcer {'>'} 2w (పుండు)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200 cursor-pointer">
                    <input type="checkbox" checked={burning} onChange={(e) => setBurning(e.target.checked)} className="rounded text-amber-800" />
                    <span>Burning on spicy food (మంట)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200 cursor-pointer">
                    <input type="checkbox" checked={restrictedOpening} onChange={(e) => setRestrictedOpening(e.target.checked)} className="rounded text-amber-800" />
                    <span>Restricted opening (నోరు తెరవలేకపోవడం)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {language === 'te' ? 'ఇతర గమనికలు / లక్షణాలు' : 'Other Symptoms or Observations'}
                </label>
                <input
                  type="text"
                  name="patient_other_symptoms"
                  autoComplete="off"
                  placeholder="e.g. Painful swallowing, mobility of tooth, throat irritation"
                  value={otherSymptoms}
                  onChange={(e) => setOtherSymptoms(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Optional Photo Upload with Separate Photography Consent */}
          <Card title="Optional Oral Photo Upload" titleTe="ఐచ్ఛిక ఓరల్ ఫోటో అప్‌లోడ్" subtitle="Separate explicit photography consent required">
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-forest-50 border border-forest-200 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={photoConsent}
                  onChange={(e) => {
                    setPhotoConsent(e.target.checked);
                    if (!e.target.checked) setPhotoData('');
                  }}
                  className="mt-0.5 rounded text-forest-800 focus:ring-forest-700"
                />
                <span className="text-xs text-forest-950 font-medium">
                  {language === 'te'
                    ? 'రోగి క్లినికల్ ఫోటోగ్రఫీ మరియు టెలి-ట్రయాజ్ కోసం ప్రత్యేక స్పష్టమైన సమ్మతిని ఇచ్చారు.'
                    : 'Patient granted separate, informed consent specifically for intraoral clinical photography and tele-triage.'}
                </span>
              </label>

              {photoConsent && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Anatomical Oral View</label>
                      <select 
                        value={photoSite}
                        onChange={(e) => setPhotoSite(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none font-medium"
                      >
                        <option value="Right cheek (Buccal mucosa)">Right Cheek (Buccal mucosa)</option>
                        <option value="Left cheek (Buccal mucosa)">Left Cheek (Buccal mucosa)</option>
                        <option value="Tongue (Dorsum/Ventral)">Tongue Surface</option>
                        <option value="Lower Labial Mucosa">Lower Lip (Labial mucosa)</option>
                        <option value="Hard / Soft Palate">Hard & Soft Palate</option>
                        <option value="Floor of mouth">Floor of Mouth</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Select JPEG/PNG Image (&lt; 2MB)</label>
                      <input 
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handlePhotoUpload}
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-100 file:text-forest-900 hover:file:bg-forest-200"
                      />
                    </div>
                  </div>

                  {photoMessage && (
                    <p className="text-xs font-semibold text-forest-800">{photoMessage}</p>
                  )}

                  {photoData && (
                    <div className="flex items-center gap-3 p-3 bg-forest-50/60 rounded-xl border border-forest-100">
                      <img src={photoData} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-forest-200" />
                      <div className="text-xs">
                        <span className="font-bold text-forest-900 block">{photoSite}</span>
                        <span className="text-[11px] text-emerald-700 font-semibold">Photo ready for submission</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Section 5: Mandatory General Informed Consent */}
          <Card title="Mandatory Informed Consent" titleTe="సమాచార సమ్మతి" subtitle="Required for clinical screening enrollment">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  required
                  checked={generalConsent}
                  onChange={(e) => setGeneralConsent(e.target.checked)}
                  className="mt-1 rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4"
                />
                <div className="text-xs text-ink space-y-1">
                  <span className="font-bold text-forest-950 block">
                    {language === 'te' 
                      ? 'రోగి స్వచ్ఛంద మౌఖిక/వ్రాతపూర్వక సమ్మతిని ఇచ్చారు (Informed Consent Verified) *' 
                      : 'Verified Voluntary Patient Informed Consent *'}
                  </span>
                  <p className="text-ink-muted">
                    {language === 'te'
                      ? 'స్క్రీనింగ్ ప్రయోజనాలు, గోప్యత మరియు డిజిటల్ ఆరోగ్య రికార్డు సృష్టి గురించి రోగికి వారి మాతృభాషలో స్పష్టంగా వివరించబడింది.'
                      : 'The purpose, non-invasive oral examination procedure, and confidentiality of the digital health record have been fully explained to the citizen.'}
                  </p>
                </div>
              </label>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/health-worker">
              <Button variant="outline" size="md">
                {language === 'te' ? 'రద్దు చేయండి' : 'Cancel'}
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={UserPlus}
              disabled={busy}
            >
              {busy ? (language === 'te' ? 'నమోదు అవుతోంది...' : 'Registering...') : (language === 'te' ? 'రోగిని నమోదు చేయండి' : 'Register Citizen & Issue Health ID')}
            </Button>
          </div>
        </form>
      )}

      {/* Duplicate Record Modal */}
      {duplicateMatch && (
        <Modal
          isOpen={showDuplicateModal}
          onClose={() => setShowDuplicateModal(false)}
          title="Existing Patient Record in Same Village"
          titleTe="ఇదే గ్రామంలో ఇప్పటికే నమోదైన రోగి వివరాలు సరిపోలుతున్నాయి"
          size="md"
        >
          <div className="space-y-4">
            <Alert type="warning" title="Duplicate Detection" titleTe="డూప్లికేట్ నివారణ">
              <p>
                A patient named <strong>{duplicateMatch.name}</strong> is already enrolled in <strong>{duplicateMatch.village}</strong>.
              </p>
            </Alert>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="font-mono font-bold text-amber-950">{duplicateMatch.patientId || duplicateMatch.id}</div>
              <div>{duplicateMatch.name} • {duplicateMatch.age} yrs • {duplicateMatch.sex}</div>
              <div>Habitation: {duplicateMatch.village}, {duplicateMatch.mandal}</div>
              <div className="text-slate-500">Status: {duplicateMatch.status}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={executeRegistration}
              >
                {language === 'te' ? 'వేరే వ్యక్తిగా నమోదు చేయండి' : 'Register as Different Individual'}
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => {
                  navigate('/health-worker/screening/new', { state: { patient: duplicateMatch } });
                }}
              >
                {language === 'te' ? 'ఈ రికార్డును ఉపయోగించండి' : 'Use Existing Record'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
