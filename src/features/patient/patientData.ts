import type { HealthCard, CareStep, Caregiver } from '../../types';

export const INITIAL_HEALTH_CARD: HealthCard = {
  cardSerial: 'ASR-CRD-2026-0842',
  patientId: 'ASR-PAT-2026-0842',
  patientName: 'Kondala Rao',
  patientNameTe: 'కొండల రావు',
  age: 46,
  gender: 'male',
  habitation: 'Kothapalli',
  mandal: 'G. Madugula',
  district: 'Alluri Sitharama Raju',
  issuedAt: '28 Oct 2026',
  issuedBy: 'Lakshmi Devi (ASHA Worker)',
  facility: 'G. Madugula Sub-Centre',
  status: 'ACTIVE',
  qrReferenceCode: 'AAROGYA-DRISHTI://CARD-REF/ASR-PAT-2026-0842/EMERGENCY-VERIFY',
};

export const INITIAL_CARE_STEPS: CareStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Doorstep Oral Screening & Risk Capture',
    titleTe: 'ఇంటి వద్దే ప్రాథమిక నోటి స్క్రీనింగ్',
    date: '28 Oct 2026',
    location: 'Kothapalli Habitation, G. Madugula',
    provider: 'Lakshmi Devi (ASHA Worker, HW-001)',
    status: 'COMPLETED',
    summary: 'Initial photographic screening and risk questionnaire completed. Informed bilingual consent recorded. 5 guided oral views captured without smartphone requirement for patient.',
    summaryTe: 'ప్రాథమిక నోటి స్క్రీనింగ్ పూర్తయింది. తెలుగులో సమ్మతి పొందబడింది. రోగికి స్మార్ట్‌ఫోన్ అవసరం లేకుండా 5 ఫోటోలు స్వీకరించబడ్డాయి.',
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Medical Officer Independent Clinical Review',
    titleTe: 'ప్రాథమిక ఆరోగ్య కేంద్ర వైద్యాధికారి పరిశీలన',
    date: '29 Oct 2026',
    location: 'G. Madugula Primary Health Centre',
    provider: 'Dr. K. Suresh, MBBS (Medical Officer)',
    status: 'COMPLETED',
    summary: 'Independent clinical evaluation completed. Persistent leukoplakic lesion noted on right buccal mucosa (> 3 weeks duration, 22-year gutkha exposure). High-resolution referral issued.',
    summaryTe: 'క్లినికల్ పరిశీలన పూర్తయింది. కుడి దవడ లోపల తెల్లటి మచ్చను గుర్తించి స్పెషలిస్ట్ రిఫరల్ ఇవ్వబడింది.',
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'District Hospital Specialist Oral OPD',
    titleTe: 'జిల్లా ఆసుపత్రి స్పెషలిస్ట్ ఓపీడీ పరీక్ష',
    date: '04 Nov 2026 (Scheduled)',
    location: 'District Hospital, Paderu',
    provider: 'Dr. M. Anand, MDS / Rajesh Varma (Patient Navigator)',
    status: 'IN_PROGRESS',
    summary: 'Inbound referral accepted. Dedicated OPD consultation reserved. Free tribal patient transport arrangement facilitated via ITDA ambulance desk.',
    summaryTe: 'రిఫరల్ స్వీకరించబడింది. జిల్లా ఆసుపత్రి పాడేరులో స్పెషలిస్ట్ పరీక్ష కేటాయించబడింది. ఉచిత రవాణా సదుపాయం కల్పించబడింది.',
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Diagnostic Biopsy & Histopathology',
    titleTe: 'కణజాల నిర్ధారణ పరీక్ష (బయాప్సీ)',
    date: '07 Nov 2026 (Projected)',
    location: 'Diagnostic Pathology Lab, District Hospital Paderu',
    provider: 'Department of Oral Pathology',
    status: 'PENDING',
    summary: 'Incisional tissue biopsy scheduled under local anesthesia for definitive histopathological confirmation and clinical staging.',
    summaryTe: 'ఖచ్చితమైన రోగ నిర్ధారణ కోసం బయాప్సీ పరీక్ష షెడ్యూల్ చేయబడింది.',
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Post-Diagnostic Support & Habit Cessation',
    titleTe: 'చికిత్సానంతర సంరక్షణ మరియు వ్యసన విముక్తి',
    date: 'Ongoing Continuum',
    location: 'G. Madugula Sub-Centre & Kothapalli',
    provider: 'Lakshmi Devi (ASHA) & Tribal Health Navigator',
    status: 'PENDING',
    summary: 'Longitudinal follow-up, gutkha cessation counseling, free nutritional guidance, and continuous monitoring at doorstep.',
    summaryTe: 'పొగాకు మానుకోవడానికి కౌన్సెలింగ్, పోషకాహార మార్గదర్శకత్వం మరియు నిరంతర గృహ పర్యవేక్షణ.',
  },
];

export const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: 'CG-001',
    patientId: 'ASR-PAT-2026-0842',
    fullName: 'Somulu Rao',
    fullNameTe: 'సోములు రావు',
    relationship: 'Son (కుమారుడు)',
    relationshipTe: 'కుమారుడు',
    phoneNumber: '+91 98480 12345',
    canViewRecords: true,
    canReceiveSms: true,
    canAssistHospital: true,
    authorizedAt: '28 Oct 2026',
    status: 'ACTIVE',
  },
  {
    id: 'CG-002',
    patientId: 'ASR-PAT-2026-0842',
    fullName: 'Parvathi Devi',
    fullNameTe: 'పార్వతి దేవి',
    relationship: 'Spouse (భార్య)',
    relationshipTe: 'భార్య',
    phoneNumber: '+91 98480 54321',
    canViewRecords: false,
    canReceiveSms: true,
    canAssistHospital: true,
    authorizedAt: '28 Oct 2026',
    status: 'ACTIVE',
  },
];

export interface ScreeningHistoryItem {
  id: string;
  date: string;
  location: string;
  workerName: string;
  status: 'PENDING' | 'COMPLETED' | 'NEEDS_ATTENTION';
  symptoms: string[];
  findingsSummary: string;
  findingsSummaryTe: string;
  moReviewer?: string;
  referralId?: string;
}

export const INITIAL_SCREENINGS: ScreeningHistoryItem[] = [
  {
    id: 'SCR-2026-0842-1',
    date: '28 Oct 2026',
    location: 'Kothapalli Habitation, G. Madugula',
    workerName: 'Lakshmi Devi (ASHA)',
    status: 'PENDING',
    symptoms: ['Persistent white patch (> 3 weeks)', 'Mild burning with chili', '22y gutkha chewing'],
    findingsSummary: 'Suspicious white patch on right buccal mucosa; referral initiated by Dr. K. Suresh to District Hospital Paderu.',
    findingsSummaryTe: 'కుడి దవడ లోపల తెల్లటి మచ్చ; పాడేరు జిల్లా ఆసుపత్రికి డాక్టర్ కె. సురేష్ గారిచే రిఫరల్ పంపబడింది.',
    moReviewer: 'Dr. K. Suresh, MBBS (G. Madugula PHC)',
    referralId: 'REF-2026-0189',
  },
  {
    id: 'SCR-2026-0312-0',
    date: '12 Mar 2026',
    location: 'G. Madugula Sub-Centre',
    workerName: 'Lakshmi Devi (ASHA)',
    status: 'COMPLETED',
    symptoms: ['Mild gum bleeding', 'Teeth staining'],
    findingsSummary: 'Routine periodic checkup. No suspicious lesions observed. Salt water gargle and tobacco reduction advised.',
    findingsSummaryTe: 'సాధారణ తనిఖీ. ఎటువంటి ప్రమాదకర మచ్చలు లేవు. ఉప్పునీటి పుక్కిలింత మరియు పొగాకు తగ్గించాలని సూచించబడింది.',
    moReviewer: 'Dr. K. Suresh, MBBS',
  },
];
