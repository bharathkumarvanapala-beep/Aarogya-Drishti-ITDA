import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  CheckCircle2, 
  Camera, 
  CreditCard, 
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import type { Patient } from '../../types';
import { saveRegisteredPatient } from '../../services/clinicalDataService';
import { 
  ASR_DIVISIONS, 
  getMandalsByDivision, 
  getPanchayatsForMandal, 
  getVillagesForPanchayat 
} from '../../data/asrMandals';

export const PatientRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [mandal, setMandal] = useState('G. Madugula');
  const [gramPanchayat, setGramPanchayat] = useState('G. Madugula');
  const [habitation, setHabitation] = useState('Kothapalli');

  const availablePanchayats = getPanchayatsForMandal(mandal);
  const availableVillages = getVillagesForPanchayat(gramPanchayat, mandal);

  const handleMandalChange = (newMandal: string) => {
    setMandal(newMandal);
    const gps = getPanchayatsForMandal(newMandal);
    const firstGp = gps.length > 0 ? gps[0].nameEn : '';
    setGramPanchayat(firstGp);

    const vils = getVillagesForPanchayat(firstGp, newMandal);
    if (vils.length > 0) {
      setHabitation(vils[0].nameEn);
    }
  };

  const handlePanchayatChange = (newGp: string) => {
    setGramPanchayat(newGp);
    const vils = getVillagesForPanchayat(newGp, mandal);
    if (vils.length > 0) {
      setHabitation(vils[0].nameEn);
    }
  };
  
  // Phone flexibility
  const [phone, setPhone] = useState('');
  const [hasNoPhone, setHasNoPhone] = useState(false);
  const [isSharedPhone, setIsSharedPhone] = useState(false);

  // Duplicate Warning Modal
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateMatch, setDuplicateMatch] = useState<any>(null);

  // Registered Patient Result
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for simulated duplicate: if first name is "Kondala" and habitation contains "kothapalli"
    if (
      firstName.trim().toLowerCase().includes('kondala') && 
      habitation.trim().toLowerCase().includes('kothapalli')
    ) {
      setDuplicateMatch({
        id: 'ASR-PAT-2026-0842',
        fullName: 'Kondala Rao (కొండల రావు)',
        age: 46,
        gender: 'male',
        habitation: 'Kothapalli',
        mandal: 'G. Madugula',
        registeredDate: '28 Oct 2026',
        registeredBy: 'Lakshmi Devi (ASHA)',
      });
      setShowDuplicateModal(true);
      return;
    }

    // Complete registration
    completeRegistration();
  };

  const completeRegistration = () => {
    const newId = `ASR-PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      id: newId,
      uniquePatientId: newId,
      cardReferenceToken: `AAROGYA-DRISHTI://CARD-REF/${newId}`,
      firstName,
      lastName,
      firstNameTe: firstName,
      lastNameTe: lastName,
      age: Number(age) || 30,
      gender,
      district: 'Alluri Sitharama Raju',
      mandal,
      gramPanchayat,
      village: habitation,
      contactPhone: hasNoPhone ? null : phone,
      hasSmartphone: false,
      preferredLanguage: 'te',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      healthWorkerId: 'USR-HW-001',
    };

    setRegisteredPatient(newPatient);
    setShowDuplicateModal(false);

    // Save to centralized clinical store so patient appears across ASHA and all portals
    saveRegisteredPatient(newPatient);

    try {
      sessionStorage.setItem('active_screening_patient', JSON.stringify(newPatient));
      localStorage.setItem('last_registered_patient', JSON.stringify(newPatient));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
            Inclusive Registration
          </span>
          <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
            Zero Barriers
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
          Register New Citizen for Screening
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          Doorstep registration for rural and tribal habitations. Neither a smartphone nor an OTP is required.
        </p>
      </div>

      {/* Philosophy Callout */}
      <Alert type="info" title="100% Inclusive Frontline Policy" titleTe="సమగ్ర నమోదు విధానం">
        <p>
          Citizens without phones or literacy are fully supported. Select the assigned habitation and record the citizen's verbal details. A physical AAROGYA DRISHTI card with a unique token will be generated immediately.
        </p>
      </Alert>

      {/* Success View */}
      {registeredPatient ? (
        <Card variant="nature" padding="lg" className="border-emerald-300 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                Citizen Registered Successfully
              </span>
              <h2 className="text-2xl font-extrabold text-ink">
                {registeredPatient.firstName} {registeredPatient.lastName}
              </h2>
              <p className="text-xs text-ink-muted">
                Unique Patient ID: <strong className="font-mono text-forest-900">{registeredPatient.uniquePatientId}</strong> • Habitation: {registeredPatient.village}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/80 border border-emerald-200 text-xs space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Age / Sex</span>
                <span className="font-bold text-ink">{registeredPatient.age} Yrs / {registeredPatient.gender.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Mandal</span>
                <span className="font-bold text-ink">{registeredPatient.mandal}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Phone Status</span>
                <span className="font-bold text-ink">{registeredPatient.contactPhone || 'No Phone (Assisted)'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-ink-muted block">Worker</span>
                <span className="font-bold text-ink">Lakshmi Devi (ASHA)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/health-worker/screening/new" state={{ patient: registeredPatient }}>
              <Button variant="primary" size="md" icon={Camera}>
                Proceed to Guided Oral Screening
              </Button>
            </Link>
            <Link to="/patient/card-preview" state={{ patient: registeredPatient }}>
              <Button variant="secondary" size="md" icon={CreditCard}>
                Preview Health Card
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="md" 
              onClick={() => {
                setRegisteredPatient(null);
                setFirstName('');
                setLastName('');
                setAge('');
              }}
            >
              Register Another Citizen
            </Button>
          </div>
        </Card>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="Demographic Information" titleTe="ప్రాథమిక వివరాలు" subtitle="Citizen identity and habitation in ASR district">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  First Name (మొదటి పేరు) *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Kondala"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Last Name / Surname (ఇంటి పేరు) *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Rao"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Age (వయస్సు) *
                </label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="115"
                  placeholder="e.g., 46"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Gender (లింగం) *
                </label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                >
                  <option value="male">Male (పురుషుడు)</option>
                  <option value="female">Female (స్త్రీ)</option>
                  <option value="other">Other (ఇతర)</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Tribal Habitation Details (ASR District)" titleTe="నివాస ప్రాంత వివరాలు (అల్లూరి సీతారామరాజు జిల్లా)" subtitle="22 Mandals administrative scoping across Paderu, Rampachodavaram & Chintoor divisions">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Mandal (మండలం) *
                </label>
                <select 
                  value={mandal}
                  onChange={(e) => handleMandalChange(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 font-medium"
                >
                  {ASR_DIVISIONS.map((div) => {
                    const divMandals = getMandalsByDivision(div.id);
                    return (
                      <optgroup key={div.id} label={`${div.nameEn} / ${div.nameTe} (${div.mandalCount})`}>
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
                  Gram Panchayat (గ్రామ పంచాయతీ) *
                  <span className="text-forest-700 font-mono ml-1 font-semibold">({availablePanchayats.length} GPs in order)</span>
                </label>
                <select 
                  value={gramPanchayat}
                  onChange={(e) => handlePanchayatChange(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 font-medium"
                >
                  {availablePanchayats.map((gp, idx) => (
                    <option key={gp.nameEn} value={gp.nameEn}>
                      {idx + 1}. {gp.nameEn} GP ({gp.nameTe})
                    </option>
                  ))}
                  <option value="Other Gram Panchayat">Other GP (ఇతర పంచాయతీ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Habitation / Village (గ్రామము/నివాసము) *
                  <span className="text-forest-700 font-mono ml-1 font-semibold">({availableVillages.length} Villages in this GP)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Write village name / గ్రామము పేరు రాయండి (e.g. Kothapalli)"
                  value={habitation}
                  onChange={(e) => setHabitation(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 font-medium"
                />
                {availableVillages.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-ink-muted block font-medium">
                      Suggested villages in {gramPanchayat} GP (click to write in blank):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {availableVillages.map((v) => (
                        <button
                          key={v.nameEn}
                          type="button"
                          onClick={() => setHabitation(v.nameEn)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            habitation.toLowerCase() === v.nameEn.toLowerCase()
                              ? 'bg-forest-900 text-white border-forest-900 font-bold shadow-sm'
                              : 'bg-forest-50 hover:bg-forest-100 text-forest-900 border-forest-200'
                          }`}
                        >
                          {v.nameEn} ({v.nameTe})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card title="Contact Phone (Optional)" titleTe="సంప్రదింపుల ఫోన్ (ఐచ్ఛికం)" subtitle="No OTP or confirmation text will be sent">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Mobile Number (Optional)
                </label>
                <input 
                  type="tel"
                  disabled={hasNoPhone}
                  placeholder="+91 98480 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700 ${
                    hasNoPhone ? 'bg-gray-100 opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-xs text-ink pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={hasNoPhone}
                    onChange={(e) => {
                      setHasNoPhone(e.target.checked);
                      if (e.target.checked) setPhone('');
                    }}
                    className="rounded text-forest-800 focus:ring-forest-700"
                  />
                  <span>No mobile phone in household (పూర్తి సహాయక సేవలు)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    disabled={hasNoPhone}
                    checked={isSharedPhone}
                    onChange={(e) => setIsSharedPhone(e.target.checked)}
                    className="rounded text-forest-800 focus:ring-forest-700"
                  />
                  <span>Shared family phone (కుటుంబ సభ్యుని ఫోన్)</span>
                </label>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/health-worker">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" size="md" type="submit" icon={UserPlus}>
              Register Citizen & Issue Health ID
            </Button>
          </div>
        </form>
      )}

      {/* Duplicate Patient Warning Modal */}
      {duplicateMatch && (
        <Modal
          isOpen={showDuplicateModal}
          onClose={() => setShowDuplicateModal(false)}
          title="Potential Duplicate Patient Record Detected"
          titleTe="ఇప్పటికే నమోదైన రోగి వివరాలు సరిపోలుతున్నాయి"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Alert type="warning" title="Duplicate Detection System" titleTe="డూప్లికేట్ నమోదు నివారణ">
              <p>
                A citizen with matching name and village is already enrolled in the village register. To prevent record fragmentation, please verify if this is the same individual.
              </p>
            </Alert>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-950 text-sm">
                  {duplicateMatch.id}
                </span>
                <span className="font-mono text-ink-muted">Registered: {duplicateMatch.registeredDate}</span>
              </div>
              <h4 className="text-base font-bold text-ink">
                {duplicateMatch.fullName}
              </h4>
              <p className="text-ink-muted">
                Age: {duplicateMatch.age} • Gender: {duplicateMatch.gender} • Habitation: <strong>{duplicateMatch.habitation}, {duplicateMatch.mandal}</strong>
              </p>
              <p className="text-ink-muted">
                Enrolled by: <strong>{duplicateMatch.registeredBy}</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-forest-100 flex flex-col sm:flex-row items-center justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={completeRegistration}
              >
                Confirm as Different Individual
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => {
                  if (duplicateMatch) {
                    try {
                      sessionStorage.setItem('active_screening_patient', JSON.stringify(duplicateMatch));
                    } catch (e) {}
                  }
                  navigate('/health-worker/screening/new', { state: { patient: duplicateMatch } });
                }}
                icon={ArrowRight}
              >
                Use Existing Patient Record
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
