import type { WorkflowStatus } from '../../types';

export interface InboundReferral {
  id: string;
  screeningId: string;
  patientId: string;
  patientName: string;
  patientNameTe: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  habitation: string;
  gramPanchayat?: string;
  mandal: string;
  referringFacility: string;
  referringDoctor: string;
  priority: 'URGENT_72H' | 'HIGH_2W' | 'ROUTINE';
  provisionalDiagnosis: string;
  assignedSpecialist: string;
  status: WorkflowStatus;
  dateReferred: string;
  transportAssistance: string;
  notes: string;
}

export interface SpecialistAppointment {
  id: string;
  referralId: string;
  patientId: string;
  patientName: string;
  patientNameTe: string;
  age: number;
  gender: 'male' | 'female';
  date: string;
  timeSlot: string;
  clinicRoom: string;
  specialist: string;
  specialistTitle: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'RESCHEDULED' | 'PENDING';
  navigatorName: string;
  transportStatus: 'ARRANGED' | 'SELF_TRANSIT' | 'DESK_PENDING';
}

export interface DiagnosticInvestigation {
  id: string;
  referralId: string;
  patientId: string;
  patientName: string;
  patientNameTe: string;
  investigationType: string;
  anatomicalSite: string;
  advisedBy: string;
  scheduledDate: string;
  status: 'ADVISED' | 'SAMPLE_COLLECTED' | 'LAB_PROCESSING' | 'REPORT_READY' | 'REVIEWED';
  pathologist: string;
  interimNotes: string;
  reportSummary?: string;
  turnaroundDays: number;
}

export interface NavigationLog {
  id: string;
  patientId: string;
  patientName: string;
  patientNameTe: string;
  navigatorName: string;
  contactMethod: string;
  transportType: string;
  counselingGiven: string;
  timestamp: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'FOLLOW_UP_DUE';
}

export const INITIAL_INBOUND_REFERRALS: InboundReferral[] = [
  {
    id: 'REF-2026-0019',
    screeningId: 'SCR-2026-0042',
    patientId: 'ASR-PAT-2026-0842',
    patientName: 'Kondala Rao',
    patientNameTe: 'కొండల రావు',
    age: 46,
    gender: 'male',
    habitation: 'Kothapalli',
    gramPanchayat: 'Kothapalli',
    mandal: 'G. Madugula',
    referringFacility: 'G. Madugula PHC',
    referringDoctor: 'Dr. K. Suresh, MBBS',
    priority: 'HIGH_2W',
    provisionalDiagnosis: 'Oral Leukoplakia (Right Buccal Mucosa) with Persistent Keratosis',
    assignedSpecialist: 'Dr. M. Anand, MDS (Oral & Maxillofacial Onco-Surgery)',
    status: 'IN_PROGRESS',
    dateReferred: '30 Oct 2026',
    transportAssistance: 'ITDA Free Tribal Patient Van (Desk 04)',
    notes: '22-year gutkha chewing history. Urgent diagnostic punch biopsy and histopathology recommended.',
  },
  {
    id: 'REF-2026-0020',
    screeningId: 'SCR-2026-0043',
    patientId: 'ASR-PAT-2026-0855',
    patientName: 'B. Sanyasamma',
    patientNameTe: 'బి. సన్యాసమ్మ',
    age: 52,
    gender: 'female',
    habitation: 'Nurmati',
    gramPanchayat: 'Nurmathi',
    mandal: 'G. Madugula',
    referringFacility: 'G. Madugula PHC',
    referringDoctor: 'Dr. K. Suresh, MBBS',
    priority: 'URGENT_72H',
    provisionalDiagnosis: 'Reverse Smoking Palatal Stomatitis with Erythroplakic Speckling',
    assignedSpecialist: 'Dr. S. V. Rao, MS (ENT / Head & Neck Oncology)',
    status: 'NEW',
    dateReferred: '29 Oct 2026',
    transportAssistance: '108 Tribal Emergency Feeder Route',
    notes: '30-year reverse chutta smoking. Marked erythematous mucosal changes on hard palate.',
  },
  {
    id: 'REF-2026-0017',
    screeningId: 'SCR-2026-0041',
    patientId: 'ASR-PAT-2026-0810',
    patientName: 'M. Demudu',
    patientNameTe: 'ఎం. దేముడు',
    age: 60,
    gender: 'male',
    habitation: 'G. Madugula',
    gramPanchayat: 'G. Madugula',
    mandal: 'G. Madugula',
    referringFacility: 'G. Madugula PHC',
    referringDoctor: 'Dr. K. Suresh, MBBS',
    priority: 'URGENT_72H',
    provisionalDiagnosis: 'Suspicious Malignant Ulcer, Left Lateral Tongue Margin',
    assignedSpecialist: 'Dr. M. Anand, MDS (Oral Onco-Surgery)',
    status: 'COMPLETED',
    dateReferred: '25 Oct 2026',
    transportAssistance: 'ITDA Assisted Transport Desk',
    notes: 'Incisional biopsy completed on 27 Oct 2026. Histopathology report reviewed by tumor board.',
  },
  {
    id: 'REF-2026-0018',
    screeningId: 'SCR-2026-0038',
    patientId: 'ASR-PAT-2026-0792',
    patientName: 'K. Somanna',
    patientNameTe: 'కె. సోమన్న',
    age: 55,
    gender: 'male',
    habitation: 'Chintapalli',
    gramPanchayat: 'Chintapalli',
    mandal: 'Chintapalli',
    referringFacility: 'Chintapalli Area Hospital',
    referringDoctor: 'Dr. P. Venkatesh, MBBS',
    priority: 'HIGH_2W',
    provisionalDiagnosis: 'Severe Oral Submucous Fibrosis with Grade III Trismus',
    assignedSpecialist: 'Dr. M. Anand, MDS',
    status: 'IN_PROGRESS',
    dateReferred: '28 Oct 2026',
    transportAssistance: 'Tribal Welfare Shuttle',
    notes: 'Severe mouth opening limitation (< 1.5 fingers). Physiotherapy and intralesional therapy advised.',
  },
  {
    id: 'REF-2026-0021',
    screeningId: 'SCR-2026-0046',
    patientId: 'ASR-PAT-2026-0899',
    patientName: 'P. Sitamma',
    patientNameTe: 'పి. సీతమ్మ',
    age: 48,
    gender: 'female',
    habitation: 'Hukumpeta',
    gramPanchayat: 'Hukumpeta',
    mandal: 'Hukumpeta',
    referringFacility: 'Hukumpeta PHC',
    referringDoctor: 'Dr. G. Lavanya, MBBS',
    priority: 'ROUTINE',
    provisionalDiagnosis: 'Chronic Traumatic Keratosis due to Sharp Lingual Cusp',
    assignedSpecialist: 'Dr. R. Madhavi, BDS (Dental Surgeon)',
    status: 'NEW',
    dateReferred: '30 Oct 2026',
    transportAssistance: 'Self / Local Bus (Assistance available)',
    notes: 'Enameloplasty and conservative review advised.',
  },
];

export const INITIAL_APPOINTMENTS: SpecialistAppointment[] = [
  {
    id: 'APT-2026-0112',
    referralId: 'REF-2026-0019',
    patientId: 'ASR-PAT-2026-0842',
    patientName: 'Kondala Rao',
    patientNameTe: 'కొండల రావు',
    age: 46,
    gender: 'male',
    date: '04 Nov 2026',
    timeSlot: '10:30 AM - 11:00 AM',
    clinicRoom: 'Room 14 (Oral Oncology & Maxillofacial OPD)',
    specialist: 'Dr. M. Anand, MDS',
    specialistTitle: 'Consultant Oral & Maxillofacial Onco-Surgeon',
    status: 'CONFIRMED',
    navigatorName: 'Rajesh Varma (Lead Navigator)',
    transportStatus: 'ARRANGED',
  },
  {
    id: 'APT-2026-0113',
    referralId: 'REF-2026-0020',
    patientId: 'ASR-PAT-2026-0855',
    patientName: 'B. Sanyasamma',
    patientNameTe: 'బి. సన్యాసమ్మ',
    age: 52,
    gender: 'female',
    date: '02 Nov 2026',
    timeSlot: '09:30 AM - 10:00 AM',
    clinicRoom: 'Room 12 (ENT / Head & Neck Clinic)',
    specialist: 'Dr. S. V. Rao, MS',
    specialistTitle: 'Senior ENT Surgeon',
    status: 'CONFIRMED',
    navigatorName: 'Rajesh Varma',
    transportStatus: 'ARRANGED',
  },
  {
    id: 'APT-2026-0110',
    referralId: 'REF-2026-0017',
    patientId: 'ASR-PAT-2026-0810',
    patientName: 'M. Demudu',
    patientNameTe: 'ఎం. దేముడు',
    age: 60,
    gender: 'male',
    date: '27 Oct 2026',
    timeSlot: '11:00 AM - 11:30 AM',
    clinicRoom: 'Minor Procedure Theatre 2',
    specialist: 'Dr. M. Anand, MDS',
    specialistTitle: 'Oral Onco-Surgeon',
    status: 'COMPLETED',
    navigatorName: 'Rajesh Varma',
    transportStatus: 'ARRANGED',
  },
  {
    id: 'APT-2026-0111',
    referralId: 'REF-2026-0018',
    patientId: 'ASR-PAT-2026-0792',
    patientName: 'K. Somanna',
    patientNameTe: 'కె. సోమన్న',
    age: 55,
    gender: 'male',
    date: '04 Nov 2026',
    timeSlot: '11:30 AM - 12:00 PM',
    clinicRoom: 'Room 14 (Oral Oncology OPD)',
    specialist: 'Dr. M. Anand, MDS',
    specialistTitle: 'Consultant Oral Surgeon',
    status: 'CONFIRMED',
    navigatorName: 'Rajesh Varma',
    transportStatus: 'ARRANGED',
  },
];

export const INITIAL_INVESTIGATIONS: DiagnosticInvestigation[] = [
  {
    id: 'BIO-2026-0028',
    referralId: 'REF-2026-0019',
    patientId: 'ASR-PAT-2026-0842',
    patientName: 'Kondala Rao',
    patientNameTe: 'కొండల రావు',
    investigationType: 'Diagnostic Punch Biopsy & Histopathological Examination',
    anatomicalSite: 'Right Buccal Mucosa (adjacent to 47 region)',
    advisedBy: 'Dr. K. Suresh, MBBS (Endorsed by Dr. M. Anand, MDS)',
    scheduledDate: '04 Nov 2026',
    status: 'ADVISED',
    pathologist: 'Dr. S. Radhika, MD (Pathology, District Hospital Lab)',
    interimNotes: 'Punch biopsy scheduled during OPD visit. Formalin specimen container reserved.',
    turnaroundDays: 3,
  },
  {
    id: 'BIO-2026-0027',
    referralId: 'REF-2026-0017',
    patientId: 'ASR-PAT-2026-0810',
    patientName: 'M. Demudu',
    patientNameTe: 'ఎం. దేముడు',
    investigationType: 'Wedge Biopsy of Left Lateral Tongue Lesion',
    anatomicalSite: 'Left lateral tongue (mid-third)',
    advisedBy: 'Dr. M. Anand, MDS',
    scheduledDate: '27 Oct 2026',
    status: 'REVIEWED',
    pathologist: 'Dr. S. Radhika, MD',
    interimNotes: 'Specimen processed. Microscopic examination confirmed Squamous Cell Carcinoma (Well Differentiated, T2N1M0).',
    reportSummary: 'Well-differentiated invasive squamous cell carcinoma with keratin pearls. Surgical margin clearance advised. Forwarded to State Cancer Centre / KGH Visakhapatnam.',
    turnaroundDays: 3,
  },
  {
    id: 'BIO-2026-0029',
    referralId: 'REF-2026-0020',
    patientId: 'ASR-PAT-2026-0855',
    patientName: 'B. Sanyasamma',
    patientNameTe: 'బి. సన్యాసమ్మ',
    investigationType: 'Mucosal Exfoliative Cytology & Toluidine Blue Staining',
    anatomicalSite: 'Hard palate mucosal surface',
    advisedBy: 'Dr. S. V. Rao, MS',
    scheduledDate: '02 Nov 2026',
    status: 'ADVISED',
    pathologist: 'Dr. S. Radhika, MD',
    interimNotes: 'Initial in-clinic vital staining to identify optimal punch biopsy sites.',
    turnaroundDays: 2,
  },
];

export const INITIAL_NAVIGATION_LOGS: NavigationLog[] = [
  {
    id: 'NAV-2026-0301',
    patientId: 'ASR-PAT-2026-0842',
    patientName: 'Kondala Rao',
    patientNameTe: 'కొండల రావు',
    navigatorName: 'Rajesh Varma (Patient Navigator, DH Paderu)',
    contactMethod: 'Phone call with ASHA Worker Lakshmi Devi (Kothapalli)',
    transportType: 'ITDA Tribal Patient Van Desk 04 (Free Pickup at G. Madugula)',
    counselingGiven: 'Telugu counseling completed with patient and wife. Addressed procedural fear regarding biopsy. Confirmed free stay and meals at Paderu ITDA Ashram.',
    timestamp: '30 Oct 2026, 12:45 PM',
    status: 'CONFIRMED',
  },
  {
    id: 'NAV-2026-0302',
    patientId: 'ASR-PAT-2026-0855',
    patientName: 'B. Sanyasamma',
    patientNameTe: 'బి. సన్యాసమ్మ',
    navigatorName: 'Rajesh Varma',
    contactMethod: 'ANM Parvati K. (Nurmati Village)',
    transportType: 'ITDA Ambulance Feeder Bus',
    counselingGiven: 'Reverse smoking cessation motivation provided. Son informed of appointment on 02 Nov 2026.',
    timestamp: '29 Oct 2026, 03:15 PM',
    status: 'CONFIRMED',
  },
  {
    id: 'NAV-2026-0298',
    patientId: 'ASR-PAT-2026-0810',
    patientName: 'M. Demudu',
    patientNameTe: 'ఎం. దేముడు',
    navigatorName: 'Rajesh Varma',
    contactMethod: 'Direct Escort at District Hospital Paderu',
    transportType: 'ITDA Inter-District Medical Transport',
    counselingGiven: 'Facilitated Dr. YSR Aarogyasri pre-authorization at KGH Visakhapatnam. Attendant travel allowance sanctioned.',
    timestamp: '28 Oct 2026, 04:00 PM',
    status: 'CONFIRMED',
  },
];
