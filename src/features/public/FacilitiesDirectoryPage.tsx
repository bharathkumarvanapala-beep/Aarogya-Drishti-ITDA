import React, { useState } from 'react';
import { MapPin, Phone, Clock, Search, Building2, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/forms/Input';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from '../../i18n';
import { ASR_DIVISIONS, getMandalsByDivision, getPanchayatsForMandal } from '../../data/asrMandals';

interface HealthcareFacility {
  id: string;
  name: string;
  nameTe: string;
  type: string;
  typeTe: string;
  mandal: string;
  address: string;
  phone: string;
  timings: string;
  services: string[];
  isTertiary?: boolean;
}

export const FacilitiesDirectoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMandal, setSelectedMandal] = useState<string>('all');

  const mandalPanchayats =
    selectedMandal !== 'all' && selectedMandal !== 'Visakhapatnam (Tertiary)'
      ? getPanchayatsForMandal(selectedMandal)
      : [];

  const facilities: HealthcareFacility[] = [
    // Paderu Revenue Division
    {
      id: 'hosp-001',
      name: 'District Hospital, Paderu',
      nameTe: 'జిల్లా ఆసుపత్రి, పాడేరు',
      type: 'District Hospital & Specialist Referral Centre',
      typeTe: 'జిల్లా ఆసుపత్రి & స్పెషలిస్ట్ రిఫరల్ కేంద్రం',
      mandal: 'Paderu',
      address: 'Main Road, Paderu Headquarter, Alluri Sitharama Raju District - 531024',
      phone: '08935-250100',
      timings: '24/7 Emergency • Specialist OPD: 9:00 AM - 2:00 PM',
      services: ['Oral Medicine & Dental Clinic', 'Biopsy & Histopathology', 'Specialist Review', 'Telemedicine Hub', 'Free Inpatient Care'],
      isTertiary: true,
    },
    {
      id: 'hosp-002',
      name: 'Primary Health Centre (PHC), G. Madugula',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, జి. మాడుగుల',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం (పైలట్ సెంటర్)',
      mandal: 'G. Madugula',
      address: 'Near Mandal Revenue Office, G. Madugula - 531027',
      phone: '08935-254220',
      timings: 'Daily 9:00 AM - 4:00 PM • 24/7 Emergency',
      services: ['Doorstep Screening Review', 'Doctor Clinical Assessment', 'Tobacco Cessation Counseling', 'Specialist Referral Creation'],
    },
    {
      id: 'hosp-003',
      name: 'Community Health Centre (CHC), Araku Valley',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం (CHC), అరకు లోయ',
      type: 'Community Health Centre (30 Beds)',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం',
      mandal: 'Araku Valley',
      address: 'Opposite Tribal Museum Road, Araku - 531149',
      phone: '08936-249230',
      timings: 'Daily 9:00 AM - 5:00 PM • 24/7 Emergency',
      services: ['Dental Checkups', 'Oral Lesion Examination', 'Patient Navigation Desk', 'Routine Secondary Care'],
    },
    {
      id: 'hosp-004',
      name: 'Community Health Centre (CHC), Chintapalli',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, చింతపల్లి',
      type: 'Community Health Centre',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం',
      mandal: 'Chintapalli',
      address: 'Hospital Road, Chintapalli - 531111',
      phone: '08937-252110',
      timings: 'Daily 9:00 AM - 4:00 PM • 24/7 Emergency',
      services: ['Oral Examination', 'Habit Cessation Guidance', 'Teleconsultation Facility', 'Referral Dispatch'],
    },
    {
      id: 'hosp-007',
      name: 'Primary Health Centre (PHC), Dumbriguda',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, డుంబ్రిగుడ',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Dumbriguda',
      address: 'Main Road, Dumbriguda Mandal - 531151',
      phone: '08936-249112',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['ASHA Screening Verification', 'Oral Lesion Staging', 'Telemedicine Connect'],
    },
    {
      id: 'hosp-008',
      name: 'Primary Health Centre (PHC), Ananthagiri',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, అనంతగిరి',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Ananthagiri',
      address: 'Ghat Road Junction, Ananthagiri - 535145',
      phone: '08936-258012',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Oral Health Screening', 'Early Detection Clinic', 'Referral Assistance'],
    },
    {
      id: 'hosp-009',
      name: 'Primary Health Centre (PHC), Hukumpeta',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, హుకుంపేట',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Hukumpeta',
      address: 'Near ITDA Sub-Office, Hukumpeta - 531077',
      phone: '08935-256114',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Frontline Review', 'Doctor Consultation', 'Habit Counseling'],
    },
    {
      id: 'hosp-010',
      name: 'Primary Health Centre (PHC), Pedabayalu',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, పెదబయలు',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Pedabayalu',
      address: 'Hospital Street, Pedabayalu - 531040',
      phone: '08935-257002',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Frontline Oral Triage', 'Biopsy Referrals', 'Digital Health Record Sync'],
    },
    {
      id: 'hosp-011',
      name: 'Primary Health Centre (PHC), Munchingi Puttu',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, ముంచింగిపుట్టు',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Munchingi Puttu',
      address: 'Jolaput Road, Munchingi Puttu - 531041',
      phone: '08935-259101',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Border Screening Cell', 'Remote Habitation Outreach', 'Referral Transport'],
    },
    {
      id: 'hosp-012',
      name: 'Primary Health Centre (PHC), G.K. Veedhi',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, గూడెం కొత్త వీధి',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'G.K. Veedhi',
      address: 'Main Bazaar, Gudem Kotha Veedhi - 531133',
      phone: '08937-254005',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['High-Altitude Screening Camp', 'Clinical Follow-up', 'Palliative Advice'],
    },
    {
      id: 'hosp-013',
      name: 'Community Health Centre (CHC), Koyyuru',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, కొయ్యూరు',
      type: 'Community Health Centre',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం',
      mandal: 'Koyyuru',
      address: 'National Highway Road, Koyyuru - 531087',
      phone: '08937-251202',
      timings: 'Daily 9:00 AM - 5:00 PM • 24/7 Emergency',
      services: ['Dental OPD', 'Oral Cancer Screening Desk', 'Referral Ambulance Service'],
    },

    // Rampachodavaram Revenue Division
    {
      id: 'hosp-014',
      name: 'Area Hospital, Rampachodavaram',
      nameTe: 'ఏరియా ఆసుపత్రి, రంపచోడవరం',
      type: 'Area Hospital (100 Beds)',
      typeTe: 'ఏరియా ఆసుపత్రి & రెఫరల్ కేంద్రం',
      mandal: 'Rampachodavaram',
      address: 'ITDA Road, Rampachodavaram - 533288',
      phone: '08864-243555',
      timings: '24/7 Emergency • Specialist OPD: 9:00 AM - 2:00 PM',
      services: ['Surgical Oncology Consultation', 'Oral Lesion Biopsy', 'Dental Suite', 'Patient Navigation'],
      isTertiary: true,
    },
    {
      id: 'hosp-015',
      name: 'Primary Health Centre (PHC), Maredumilli',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, మారేడుమిల్లి',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Maredumilli',
      address: 'Forest Range Road, Maredumilli - 533295',
      phone: '08864-244100',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Forest Hamlets Mobile Outreach', 'Oral Visual Exam', 'Tobacco Cessation Guidance'],
    },
    {
      id: 'hosp-016',
      name: 'Community Health Centre (CHC), Addateegala',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, అడ్డతీగల',
      type: 'Community Health Centre (30 Beds)',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం',
      mandal: 'Addateegala',
      address: 'Hospital Street, Addateegala - 533428',
      phone: '08864-241022',
      timings: 'Daily 9:00 AM - 5:00 PM • 24/7 Emergency',
      services: ['Dental Assessment', 'Pre-Cancer Surveillance', 'Fast-Track Hospital Referral'],
    },
    {
      id: 'hosp-017',
      name: 'Primary Health Centre (PHC), Devipatnam',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, దేవీపట్నం',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Devipatnam',
      address: 'Godavari Riverbank Road, Devipatnam - 533354',
      phone: '08864-248100',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Riparian Habitation Screening', 'Doctor Review', 'Referral Transport Desk'],
    },
    {
      id: 'hosp-018',
      name: 'Primary Health Centre (PHC), Y. Ramavaram',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, వై. రామవరం',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Y. Ramavaram',
      address: 'Gurthedu Access Road, Y. Ramavaram - 533483',
      phone: '08864-245150',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Deep Remote Tribal Outreach', 'Oral Mucosa Exams', 'Emergency Triage'],
    },
    {
      id: 'hosp-019',
      name: 'Primary Health Centre (PHC), Gangavaram',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, గంగవరం',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Gangavaram',
      address: 'Panchayat Road, Gangavaram - 533285',
      phone: '08864-247011',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Frontline Screening Sync', 'Tobacco De-addiction', 'Specialist Booking'],
    },
    {
      id: 'hosp-020',
      name: 'Primary Health Centre (PHC), Rajavommangi',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, రాజవొమ్మంగి',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Rajavommangi',
      address: 'Main Bazaar Road, Rajavommangi - 533436',
      phone: '08864-242005',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Frontline Dental Review', 'Oral Pre-cancer Triage', 'Referral Follow-up'],
    },

    // Chintoor Revenue Division
    {
      id: 'hosp-021',
      name: 'Community Health Centre (CHC), Chintoor',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, చింతూరు',
      type: 'Community Health Centre (30 Beds)',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం',
      mandal: 'Chintoor',
      address: 'NH-326 Junction, Chintoor - 507126',
      phone: '08748-285220',
      timings: 'Daily 9:00 AM - 5:00 PM • 24/7 Emergency',
      services: ['Inter-State Border Clinic', 'Oral Oncology Triage', 'Specialist Referral Coordination'],
    },
    {
      id: 'hosp-022',
      name: 'Primary Health Centre (PHC), Kunavaram',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, కూనవరం',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Kunavaram',
      address: 'Sabari Confluence Road, Kunavaram - 507121',
      phone: '08748-283100',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Confluence Tribal Screening Desk', 'Doctor Evaluation', 'Tobacco Awareness'],
    },
    {
      id: 'hosp-023',
      name: 'Primary Health Centre (PHC), Vararamachandrapuram',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, వరరామచంద్రపురం (VR Puram)',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'VR Puram',
      address: 'Main Road, VR Puram - 507135',
      phone: '08748-286015',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Tribal Hamlets Oral Clinic', 'High-Risk Lesion Staging', 'Referral Vehicle Booking'],
    },
    {
      id: 'hosp-024',
      name: 'Primary Health Centre (PHC), Etapaka',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, ఎటపాక',
      type: 'Primary Health Centre (PHC)',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
      mandal: 'Etapaka',
      address: 'Near Bhadrachalam Border, Etapaka - 507111',
      phone: '08748-288001',
      timings: 'Daily 9:00 AM - 4:00 PM',
      services: ['Border Area Screening', 'Clinical Photo Review', 'Referral Transit Assistance'],
    },

    // Tertiary and District Coordination
    {
      id: 'hosp-005',
      name: 'King George Hospital (KGH) & AMC, Visakhapatnam',
      nameTe: 'కింగ్ జార్జ్ హాస్పిటల్ (KGH), విశాఖపట్నం',
      type: 'Tertiary Teaching Hospital & Oncology Centre',
      typeTe: 'బోధనా ఆసుపత్రి & క్యాన్సర్ చికిత్సా కేంద్రం',
      mandal: 'Visakhapatnam (Tertiary)',
      address: 'Collector Office Road, Maharanipeta, Visakhapatnam - 530002',
      phone: '0891-2564891',
      timings: '24/7 Comprehensive Healthcare & Emergency',
      services: ['Advanced Oral Oncology', 'Head & Neck Surgery', 'Radiotherapy & Chemotherapy', 'Definitive Histopathology'],
      isTertiary: true,
    },
    {
      id: 'hosp-006',
      name: 'ITDA Paderu Healthcare Coordination Cell',
      nameTe: 'ఐటీడీఏ పాడేరు గిరిజన ఆరోగ్య సమన్వయ విభాగం',
      type: 'Tribal Patient Support & Welfare Office',
      typeTe: 'గిరిజన రోగుల సహాయక కేంద్రం',
      mandal: 'Paderu',
      address: 'ITDA Complex, Paderu - 531024',
      phone: '08935-250000 (Helpline)',
      timings: 'Monday - Saturday: 9:00 AM - 6:00 PM',
      services: ['Tribal Travel Assistance', 'Free Patient Navigation', 'Language Interpretation', 'Emergency Coordination'],
    },
  ];

  const filtered = facilities.filter((fac) => {
    const matchesSearch = 
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.nameTe.includes(searchTerm) ||
      fac.mandal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMandal = selectedMandal === 'all' || fac.mandal.toLowerCase() === selectedMandal.toLowerCase();

    return matchesSearch && matchesMandal;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Go to Previous Navigation */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/" label="Go to Previous" labelTe="మునుపటి పేజీకి" variant="outline" size="sm" />
      </div>

      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
          Healthcare Directory
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          {t('facilitiesTitle')}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold font-telugu text-forest-900">
          {t('facilitiesSubtitle')}
        </h2>
        <p className="text-xs sm:text-base text-ink-muted leading-relaxed">
          Find accredited public clinics, primary health centres, and district hospitals equipped with oral screening, clinical review, and specialist referral facilities under ITDA Paderu.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="flat" padding="md">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <Input
              label="Search by facility name or location"
              labelTe="ఆసుపత్రి లేదా ప్రదేశం పేరుతో వెతకండి"
              placeholder="e.g. Paderu, G. Madugula, Araku..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-80">
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Filter by Mandal (మండలం ద్వారా ఫిల్టర్ చేయండి)
            </label>
            <select
              value={selectedMandal}
              onChange={(e) => setSelectedMandal(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink min-h-[48px] focus:outline-none focus:ring-2 focus:ring-forest-700/30 font-medium"
            >
              <option value="all">All 22 Mandals (అన్ని 22 మండలాలు - ASR జిల్లా)</option>
              {ASR_DIVISIONS.map((div) => {
                const mandalsInDiv = getMandalsByDivision(div.id);
                return (
                  <optgroup key={div.id} label={`${div.nameEn} / ${div.nameTe} (${div.mandalCount} Mandals)`}>
                    {mandalsInDiv.map((m) => (
                      <option key={m.id} value={m.nameEn}>
                        {m.nameEn} ({m.nameTe})
                      </option>
                    ))}
                  </optgroup>
                );
              })}
              <optgroup label="Tertiary Oncology / Referral (బాహ్య కేన్సర్ కేంద్రం)">
                <option value="Visakhapatnam (Tertiary)">Visakhapatnam Tertiary (కేజీహెచ్ - KGH AMC)</option>
              </optgroup>
            </select>
          </div>
        </div>
      </Card>

      {/* Mandal Gram Panchayats Catchment Area Overview */}
      {mandalPanchayats.length > 0 && (
        <Card padding="md" className="bg-gradient-to-r from-forest-50/70 via-emerald-50/40 to-white border-forest-200 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-forest-100 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest-700 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold text-forest-950">
                Official Gram Panchayats in {selectedMandal} Mandal ({mandalPanchayats.length} GPs in Order)
              </h3>
            </div>
            <span className="text-xs font-mono text-forest-800 font-semibold bg-white px-2.5 py-1 rounded-md border border-forest-200">
              Frontline Catchment Area
            </span>
          </div>
          <p className="text-xs text-ink-muted mb-2.5">
            Frontline screening and referral services connect remote tribal hamlets across all {mandalPanchayats.length} officially gazetted Gram Panchayats to the primary health centres below:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-52 overflow-y-auto p-1 scrollbar-thin">
            {mandalPanchayats.map((gp, idx) => (
              <div
                key={gp.nameEn}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-forest-200/90 text-xs text-forest-950 shadow-2xs"
              >
                <span className="font-mono text-[10px] text-forest-700 font-bold shrink-0">{idx + 1}.</span>
                <div className="truncate">
                  <span className="font-semibold text-ink block truncate">{gp.nameEn} GP</span>
                  <span className="text-forest-700 font-telugu text-[10px] block truncate">{gp.nameTe}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((fac) => (
          <Card
            key={fac.id}
            padding="lg"
            variant={fac.isTertiary ? 'accent' : 'default'}
            className="space-y-4 hover:shadow-nature-lg transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 text-forest-900 font-mono">
                  {fac.type}
                </span>
                <h3 className="text-xl font-bold text-ink mt-2">
                  {fac.name}
                </h3>
                <p className="text-sm font-telugu text-forest-800 font-bold mt-0.5">
                  {fac.nameTe}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-forest-50 text-forest-900 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-ink-muted border-t border-b border-forest-100 py-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                <span>{fac.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-forest-700 shrink-0" />
                <span className="font-semibold text-ink">{fac.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                <span>{fac.timings}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink block mb-2">
                Available Services (అందుబాటులో ఉన్న సేవలు):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fac.services.map((srv, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-forest-50 text-forest-900 text-xs font-medium border border-forest-100"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{srv}</span>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
