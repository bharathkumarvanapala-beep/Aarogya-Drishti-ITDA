// AAROGYA DRISHTI — Core TypeScript Definitions

export type Language = 'en' | 'te';

export type UserRole = 
  | 'health_worker' 
  | 'asha'
  | 'anm'
  | 'doctor' 
  | 'specialist' 
  | 'hospital_coordinator' 
  | 'admin' 
  | 'patient';

export type AccountStatus = 
  | 'PENDING_VERIFICATION' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'SUSPENDED';

export type WorkflowStatus = 
  | 'NEW' 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'NEEDS_ATTENTION' 
  | 'NOT_AVAILABLE';

export type SyncStatus = 
  | 'SAVED_LOCAL' 
  | 'WAITING_NETWORK' 
  | 'SYNCING' 
  | 'SYNCED' 
  | 'CONFLICT' 
  | 'FAILED';

export type ImageQualityStatus = 
  | 'acceptable' 
  | 'recapture' 
  | 'invalid_format' 
  | 'processing_failed';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  nameTe: string;
  fullName?: string;
  role: UserRole;
  roleTitle: string;
  roleTitleTe: string;
  facility: string;
  facilityName?: string;
  assignedHealthCentre?: string;
  district: string;
  mandal?: string;
  village?: string;
  assignedVillages?: string[];
  avatarUrl?: string;
  // Designation-specific registration fields
  designation?: string;
  designationTe?: string;
  employeeId?: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  subCentre?: string;
  department?: string;
  relationship?: string;
  healthCardToken?: string;
  password?: string;
  registeredAt?: string;
  accountStatus?: AccountStatus;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  qualification?: string;
  specialization?: string;
  ashaId?: string;
  anmId?: string;
  doctorId?: string;
}

export interface Patient {
  id: string;
  uniquePatientId: string;
  cardReferenceToken: string;
  firstName: string;
  lastName: string;
  firstNameTe?: string;
  lastNameTe?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  district: string;
  mandal: string;
  gramPanchayat: string;
  village: string;
  contactPhone?: string | null;
  hasSmartphone: boolean;
  preferredLanguage: Language;
  createdAt: string;
  updatedAt: string;
  healthWorkerId: string;
}

export interface ScreeningConsent {
  id: string;
  patientId: string;
  purpose: string[];
  language: Language;
  isVerbalConfirmed: boolean;
  witnessName: string;
  recordedByWorkerId: string;
  timestamp: string;
}

export interface ExposureHistory {
  chewingTobacco: boolean;
  chewingFrequencyDaily?: number;
  chewingDurationYears?: number;
  smoking: boolean;
  smokingFrequencyDaily?: number;
  reverseSmoking: boolean; // Relevant tribal habit (Chutta)
  alcohol: boolean;
  relevantHabitsNotes?: string;
}

export interface ScreeningSymptoms {
  persistentUlcer: boolean;
  ulcerDurationWeeks?: number;
  whiteOrRedPatch: boolean;
  patchType?: 'white' | 'red' | 'mixed';
  anatomicalSite?: string;
  burningSensation: boolean;
  restrictedMouthOpening: boolean;
  mouthOpeningFingers?: number;
  growthOrSwelling: boolean;
  bleedingOrPain: boolean;
  symptomDurationWeeks: number;
  notes?: string;
}

export interface OralPhotoRecord {
  id: string;
  viewName: 'right_cheek' | 'left_cheek' | 'tongue' | 'palate' | 'gums_floor';
  viewLabel: string;
  viewLabelTe: string;
  dataUrl: string;
  quality: ImageQualityStatus;
  qualityNotes?: string;
  capturedAt: string;
}

export interface AIResearchDemonstrationResult {
  analysisId: string;
  screeningId: string;
  imageQuality: 'acceptable' | 'insufficient';
  provider: 'mock';
  modelVersion: string;
  researchLabel: 'suspicious_example' | 'no_suspicious_finding_identified' | 'image_insufficient';
  score: null; // Strictly null to reject fabricated cancer probabilities
  clinicalUse: false; // Non-negotiable safety guard
  requiresClinicianReview: true;
  warning: string;
  analyzedAt: string;
}

export interface ClinicalReviewRecord {
  id: string;
  screeningId: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  independentObservations: string;
  clinicalAssessment: 
    | 'NORMAL' 
    | 'BENIGN_LESION' 
    | 'SUSPICIOUS_POTENTIALLY_MALIGNANT' 
    | 'URGENT_SUSPICION_MALIGNANCY' 
    | 'MORE_INFORMATION_REQUIRED';
  decision: 'ROUTINE_FOLLOWUP' | 'RECHECK_IN_4_WEEKS' | 'REFER_SPECIALIST' | 'TELEMEDICINE_REQUESTED';
  referralRequired: boolean;
  recommendedSpecialty?: string;
  recommendedFacility?: string;
  urgencyPriority?: 'ROUTINE' | 'PRIORITY' | 'URGENT';
  signedAt: string;
}

export interface HealthCard {
  cardSerial: string;
  patientId: string;
  patientName: string;
  patientNameTe: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  habitation: string;
  mandal: string;
  district: string;
  issuedAt: string;
  issuedBy: string;
  facility: string;
  status: 'ACTIVE' | 'REPLACED' | 'INVALIDATED';
  qrReferenceCode: string;
}

export interface Caregiver {
  id: string;
  patientId: string;
  fullName: string;
  fullNameTe: string;
  relationship: string;
  relationshipTe: string;
  phoneNumber: string;
  canViewRecords: boolean;
  canReceiveSms: boolean;
  canAssistHospital: boolean;
  authorizedAt: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface CareStep {
  id: string;
  stepNumber: number;
  title: string;
  titleTe: string;
  date: string;
  location: string;
  provider: string;
  status: WorkflowStatus;
  summary: string;
  summaryTe: string;
  notes?: string;
}

