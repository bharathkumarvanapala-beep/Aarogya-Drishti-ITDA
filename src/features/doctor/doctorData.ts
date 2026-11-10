import type { WorkflowStatus } from '../../types';

export interface OralCaseImage {
  id: string;
  viewKey: 'right_cheek' | 'left_cheek' | 'tongue' | 'palate' | 'gums_floor';
  viewName: string;
  viewNameTe: string;
  url: string;
  quality: 'acceptable' | 'recapture';
  sharpnessScore: number;
  lightingScore: number;
  resolution: string;
}

export interface DoctorCase {
  id: string;
  patientId: string;
  patientName: string;
  patientNameTe: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  habitation: string;
  gramPanchayat?: string;
  mandal: string;
  healthWorkerName: string;
  screeningDate: string;
  status: WorkflowStatus;
  triagePriority: 'HIGH_PRIORITY' | 'MODERATE' | 'ROUTINE';
  complaint: string;
  complaintTe: string;
  duration: string;
  tobaccoHistory: string;
  reverseSmoking: boolean;
  trismusFingers: string;
  burningSensation: boolean;
  images: OralCaseImage[];
  aiDemoOutput: {
    modelVersion: string;
    provider: string;
    researchLabel: 'suspicious_example' | 'benign_example';
    score: null;
    isClinical: false;
    disclaimer: string;
    medgemmaReport?: any;
  };
  review?: {
    doctorName: string;
    doctorRegNo: string;
    observations: string;
    cardinalSigns: string[];
    provisionalCategory: 'POTENTIALLY_MALIGNANT_DISORDER' | 'SUSPICIOUS_MALIGNANCY' | 'BENIGN_ORAL_LESION' | 'NORMAL_MUCOSA';
    decision: 'REFER_TO_SPECIALIST_HOSPITAL' | 'SCHEDULE_PHC_TELECONSULTATION' | 'CONSERVATIVE_CARE_AND_RECALL';
    recommendedSpecialty: string;
    targetFacility: string;
    priority: 'URGENT_72H' | 'HIGH_2W' | 'ROUTINE';
    referralNotes: string;
    signedAt: string;
  };
}

export const INITIAL_DOCTOR_CASES: DoctorCase[] = [
  {
    id: 'SCR-2026-0042',
    patientId: 'ASR-PAT-2026-0842',
    patientName: 'Kondala Rao',
    patientNameTe: 'కొండల రావు',
    age: 46,
    gender: 'male',
    habitation: 'Kothapalli',
    gramPanchayat: 'Kothapalli',
    mandal: 'G. Madugula',
    healthWorkerName: 'Lakshmi Devi (ASHA Worker, HW-001)',
    screeningDate: '30 Oct 2026',
    status: 'PENDING',
    triagePriority: 'HIGH_PRIORITY',
    complaint: 'Non-healing thick white patch on inner right cheek, burning sensation when eating spicy foods.',
    complaintTe: 'కుడి దవడ లోపల మానని తెల్లటి మచ్చ, కారమైన ఆహారం తిన్నప్పుడు మంట.',
    duration: '> 3 weeks (approx. 2 months)',
    tobaccoHistory: 'Daily chewing gutkha and raw tobacco for 22 years (4-5 packets/day)',
    reverseSmoking: false,
    trismusFingers: '2.5 fingers (< 35 mm inter-incisal distance)',
    burningSensation: true,
    images: [
      {
        id: 'img-1',
        viewKey: 'right_cheek',
        viewName: 'Right Buccal Mucosa (Primary Lesion)',
        viewNameTe: 'కుడి దవడ లోపలి భాగం',
        url: '/images/sample_oral_patch.jpg',
        quality: 'acceptable',
        sharpnessScore: 94,
        lightingScore: 88,
        resolution: '1920 x 1440',
      },
      {
        id: 'img-2',
        viewKey: 'tongue',
        viewName: 'Dorsum & Lateral Tongue',
        viewNameTe: 'నాలుక ఉపరితలం & అంచులు',
        url: '/images/sample_oral_tongue.jpg',
        quality: 'acceptable',
        sharpnessScore: 91,
        lightingScore: 90,
        resolution: '1920 x 1440',
      },
      {
        id: 'img-3',
        viewKey: 'left_cheek',
        viewName: 'Left Buccal Mucosa',
        viewNameTe: 'ఎడమ దవడ లోపలి భాగం',
        url: '/images/sample_oral_patch.jpg',
        quality: 'acceptable',
        sharpnessScore: 89,
        lightingScore: 85,
        resolution: '1920 x 1440',
      },
      {
        id: 'img-4',
        viewKey: 'palate',
        viewName: 'Hard & Soft Palate',
        viewNameTe: 'అంగిలి భాగం',
        url: '/images/sample_oral_tongue.jpg',
        quality: 'acceptable',
        sharpnessScore: 87,
        lightingScore: 84,
        resolution: '1920 x 1440',
      },
      {
        id: 'img-5',
        viewKey: 'gums_floor',
        viewName: 'Gums & Floor of Mouth',
        viewNameTe: 'చిగుళ్ళు & నోటి అడుగు భాగం',
        url: '/images/sample_oral_patch.jpg',
        quality: 'acceptable',
        sharpnessScore: 88,
        lightingScore: 86,
        resolution: '1920 x 1440',
      },
    ],
    aiDemoOutput: {
      modelVersion: 'mock-v1-efficientnet-b0',
      provider: 'mock',
      researchLabel: 'suspicious_example',
      score: null,
      isClinical: false,
      disclaimer: 'NOT FOR CLINICAL USE — RESEARCH PROTOTYPE DEMONSTRATION ONLY',
    },
  },
  {
    id: 'SCR-2026-0043',
    patientId: 'ASR-PAT-2026-0855',
    patientName: 'B. Sanyasamma',
    patientNameTe: 'బి. సన్యాసమ్మ',
    age: 52,
    gender: 'female',
    habitation: 'Nurmati',
    gramPanchayat: 'Nurmathi',
    mandal: 'G. Madugula',
    healthWorkerName: 'Parvati K. (ANM)',
    screeningDate: '29 Oct 2026',
    status: 'PENDING',
    triagePriority: 'HIGH_PRIORITY',
    complaint: 'Red and white speckled discoloration on hard palate, mild soreness.',
    complaintTe: 'అంగిలిపై ఎరుపు మరియు తెలుపు రంగు మచ్చలు, కొద్దిగా నొప్పి.',
    duration: '4-5 weeks',
    tobaccoHistory: 'Reverse smoking (chutta with ignited end inside oral cavity) for 30 years',
    reverseSmoking: true,
    trismusFingers: '3.0 fingers (Normal)',
    burningSensation: true,
    images: [
      {
        id: 'img-11',
        viewKey: 'palate',
        viewName: 'Hard Palate (Reverse Smoking Stomatitis)',
        viewNameTe: 'అంగిలి భాగం (రివర్స్ స్మోకింగ్)',
        url: '/images/sample_oral_patch.jpg',
        quality: 'acceptable',
        sharpnessScore: 92,
        lightingScore: 87,
        resolution: '1920 x 1440',
      },
    ],
    aiDemoOutput: {
      modelVersion: 'mock-v1-efficientnet-b0',
      provider: 'mock',
      researchLabel: 'suspicious_example',
      score: null,
      isClinical: false,
      disclaimer: 'NOT FOR CLINICAL USE — RESEARCH PROTOTYPE DEMONSTRATION ONLY',
    },
  },
  {
    id: 'SCR-2026-0044',
    patientId: 'ASR-PAT-2026-0861',
    patientName: 'K. Appala Raju',
    patientNameTe: 'కె. అప్పలరాజు',
    age: 38,
    gender: 'male',
    habitation: 'Solabham',
    gramPanchayat: 'Solabham',
    mandal: 'G. Madugula',
    healthWorkerName: 'Lakshmi Devi (ASHA Worker, HW-001)',
    screeningDate: '30 Oct 2026',
    status: 'NEW',
    triagePriority: 'ROUTINE',
    complaint: 'Small superficial ulcer on lower lip margin, painful on touch, duration 4 days.',
    complaintTe: 'క్రింది పెదవిపై చిన్న పుండు, తాకితే నొప్పి, 4 రోజుల నుండి.',
    duration: '4 days (acute)',
    tobaccoHistory: 'Occasional bidi smoking (1-2 bidis/day), no gutkha',
    reverseSmoking: false,
    trismusFingers: '4.0 fingers (Full opening)',
    burningSensation: false,
    images: [
      {
        id: 'img-21',
        viewKey: 'tongue',
        viewName: 'Lower Lip & Ventral Tongue',
        viewNameTe: 'క్రింది పెదవి & నాలుక అడుగు భాగం',
        url: '/images/sample_oral_tongue.jpg',
        quality: 'acceptable',
        sharpnessScore: 90,
        lightingScore: 89,
        resolution: '1920 x 1440',
      },
    ],
    aiDemoOutput: {
      modelVersion: 'mock-v1-efficientnet-b0',
      provider: 'mock',
      researchLabel: 'benign_example',
      score: null,
      isClinical: false,
      disclaimer: 'NOT FOR CLINICAL USE — RESEARCH PROTOTYPE DEMONSTRATION ONLY',
    },
  },
  {
    id: 'SCR-2026-0045',
    patientId: 'ASR-PAT-2026-0870',
    patientName: 'V. Gangadhar',
    patientNameTe: 'వి. గంగాధర్',
    age: 41,
    gender: 'male',
    habitation: 'Kothapalli',
    gramPanchayat: 'Kothapalli',
    mandal: 'G. Madugula',
    healthWorkerName: 'Lakshmi Devi (ASHA Worker, HW-001)',
    screeningDate: '29 Oct 2026',
    status: 'IN_PROGRESS',
    triagePriority: 'MODERATE',
    complaint: 'Difficulty opening mouth wide, blanched pale oral mucosa on both sides.',
    complaintTe: 'నోరు పూర్తిగా తెరవలేకపోవడం, దవడల లోపల పాలిపోయిన చర్మం.',
    duration: '6 months progressive',
    tobaccoHistory: 'Areca nut and khaini chewing for 14 years',
    reverseSmoking: false,
    trismusFingers: '2.0 fingers (< 28 mm, restricted opening)',
    burningSensation: true,
    images: [
      {
        id: 'img-31',
        viewKey: 'right_cheek',
        viewName: 'Right Buccal Mucosa (Fibrous Bands)',
        viewNameTe: 'కుడి దవడ లోపలి భాగం',
        url: '/images/sample_oral_patch.jpg',
        quality: 'acceptable',
        sharpnessScore: 93,
        lightingScore: 86,
        resolution: '1920 x 1440',
      },
    ],
    aiDemoOutput: {
      modelVersion: 'mock-v1-efficientnet-b0',
      provider: 'mock',
      researchLabel: 'suspicious_example',
      score: null,
      isClinical: false,
      disclaimer: 'NOT FOR CLINICAL USE — RESEARCH PROTOTYPE DEMONSTRATION ONLY',
    },
  },
  {
    id: 'SCR-2026-0041',
    patientId: 'ASR-PAT-2026-0810',
    patientName: 'M. Demudu',
    patientNameTe: 'ఎం. దేముడు',
    age: 60,
    gender: 'male',
    habitation: 'G. Madugula',
    gramPanchayat: 'G. Madugula',
    mandal: 'G. Madugula',
    healthWorkerName: 'Parvati K. (ANM)',
    screeningDate: '24 Oct 2026',
    status: 'COMPLETED',
    triagePriority: 'HIGH_PRIORITY',
    complaint: 'Non-scrapable ulcerated plaque with rolled margins on left lateral tongue.',
    complaintTe: 'ఎడమ వైపు నాలుకపై పుండు, గట్టిగా మారిన అంచులు.',
    duration: '2 months',
    tobaccoHistory: 'Chewing tobacco and chutta smoking for 35 years',
    reverseSmoking: false,
    trismusFingers: '3.0 fingers',
    burningSensation: true,
    images: [
      {
        id: 'img-41',
        viewKey: 'tongue',
        viewName: 'Left Lateral Border of Tongue',
        viewNameTe: 'నాలుక ఎడమ అంచు భాగం',
        url: '/images/sample_oral_tongue.jpg',
        quality: 'acceptable',
        sharpnessScore: 95,
        lightingScore: 92,
        resolution: '1920 x 1440',
      },
    ],
    aiDemoOutput: {
      modelVersion: 'mock-v1-efficientnet-b0',
      provider: 'mock',
      researchLabel: 'suspicious_example',
      score: null,
      isClinical: false,
      disclaimer: 'NOT FOR CLINICAL USE — RESEARCH PROTOTYPE DEMONSTRATION ONLY',
    },
    review: {
      doctorName: 'Dr. K. Suresh, MBBS',
      doctorRegNo: 'APMC-48291',
      observations: 'Indurated ulcerated lesion on left lateral tongue margin, approx 2.0 x 1.5 cm. Firm to palpation, tender. Regional submandibular lymphadenopathy present.',
      cardinalSigns: ['Induration / Firmness', 'Non-scrapable', 'Spontaneous bleeding', 'Lymph node enlargement'],
      provisionalCategory: 'SUSPICIOUS_MALIGNANCY',
      decision: 'REFER_TO_SPECIALIST_HOSPITAL',
      recommendedSpecialty: 'Oral Onco-Surgery / Specialist ENT',
      targetFacility: 'District Hospital Paderu / KGH Visakhapatnam',
      priority: 'URGENT_72H',
      referralNotes: 'Urgent diagnostic punch biopsy required. Patient advised against delayed care. Transport coordination initiated with tribal navigator.',
      signedAt: '25 Oct 2026, 11:30 AM IST',
    },
  },
];
