import type { Patient } from '../types';
import type { DoctorCase } from '../features/doctor/doctorData';
import type { InboundReferral } from '../features/hospital/hospitalData';

export interface ActiveScreeningData {
  patient: {
    id: string;
    uniquePatientId?: string;
    name: string;
    nameTe?: string;
    age: number;
    gender: string;
    habitation: string;
    mandal: string;
    gramPanchayat?: string;
    phone?: string | null;
  };
  habits?: {
    chewingTobacco: boolean;
    chewingFrequency?: string;
    chewingYears?: string;
    smoking: boolean;
    reverseSmoking: boolean;
    alcohol: boolean;
  };
  symptoms?: {
    persistentPatch: boolean;
    patchType?: string;
    patchLocation?: string;
    nonHealingUlcer: boolean;
    burningSensation: boolean;
    restrictedMouthOpening: boolean;
    mouthFingers?: number;
    swellingLump: boolean;
    symptomDurationWeeks?: string;
  };
  workerNotes?: string;
  consentType?: string;
  witnessName?: string;
  capturedImages?: Record<string, { url: string; quality?: any }>;
  activeImageUrl?: string;
  updatedAt: string;
}

const STORAGE_CUSTOM_PATIENTS = 'aarogya_custom_patients';
const STORAGE_DOCTOR_CASES = 'aarogya_custom_doctor_cases';
const STORAGE_HOSPITAL_REFERRALS = 'aarogya_custom_inbound_referrals';
const STORAGE_ACTIVE_SCREENING = 'active_screening_intake';

// ==========================================
// 1. PATIENT REGISTRATION PERSISTENCE
// ==========================================
export const saveRegisteredPatient = (patient: Patient): void => {
  try {
    const existing = getCustomPatients();
    const filtered = existing.filter((p) => p.id !== patient.id && (!patient.uniquePatientId || p.uniquePatientId !== patient.uniquePatientId));
    const updated = [patient, ...filtered];
    localStorage.setItem(STORAGE_CUSTOM_PATIENTS, JSON.stringify(updated));
    sessionStorage.setItem('active_screening_patient', JSON.stringify(patient));
  } catch (e) {
    console.warn('Failed to save custom patient to storage', e);
  }
};

export const getCustomPatients = (): Patient[] => {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PATIENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ==========================================
// 2. ACTIVE SCREENING INTAKE & CAMERA PERSISTENCE
// ==========================================
export const saveActiveScreening = (data: Partial<ActiveScreeningData>): void => {
  try {
    const current = getActiveScreening() || {
      patient: {
        id: 'ASR-PAT-2026-0842',
        name: 'Kondala Rao',
        age: 46,
        gender: 'Male',
        habitation: 'Kothapalli, G. Madugula',
        mandal: 'G. Madugula',
      },
      updatedAt: new Date().toISOString(),
    };

    const merged: ActiveScreeningData = {
      ...(data.patient && data.patient.id !== current.patient.id ? {} : current),
      ...data,
      patient: data.patient || current.patient,
      updatedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(STORAGE_ACTIVE_SCREENING, JSON.stringify(merged));
    localStorage.setItem('aarogya_active_screening_record', JSON.stringify(merged));
  } catch (e) {
    console.warn('Failed to save active screening intake', e);
  }
};

export const getActiveScreening = (): ActiveScreeningData | null => {
  try {
    const rawSession = sessionStorage.getItem(STORAGE_ACTIVE_SCREENING);
    if (rawSession) {
      return JSON.parse(rawSession);
    }
    const rawLocal = localStorage.getItem('aarogya_active_screening_record');
    if (rawLocal) {
      return JSON.parse(rawLocal);
    }
  } catch {
    // ignore
  }
  return null;
};

// ==========================================
// 3. DOCTOR CASES PERSISTENCE & ESCALATION
// ==========================================
export const saveDoctorCase = (doctorCase: DoctorCase): void => {
  try {
    const existing = getCustomDoctorCases();
    const filtered = existing.filter((c) => c.id !== doctorCase.id);
    const updated = [doctorCase, ...filtered];
    localStorage.setItem(STORAGE_DOCTOR_CASES, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save doctor case', e);
  }
};

export const getCustomDoctorCases = (): DoctorCase[] => {
  try {
    const raw = localStorage.getItem(STORAGE_DOCTOR_CASES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ==========================================
// 4. HOSPITAL INBOUND REFERRALS PERSISTENCE
// ==========================================
export const saveInboundReferral = (referral: InboundReferral): void => {
  try {
    const existing = getCustomInboundReferrals();
    const filtered = existing.filter((r) => r.id !== referral.id);
    const updated = [referral, ...filtered];
    localStorage.setItem(STORAGE_HOSPITAL_REFERRALS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save inbound referral', e);
  }
};

export const getCustomInboundReferrals = (): InboundReferral[] => {
  try {
    const raw = localStorage.getItem(STORAGE_HOSPITAL_REFERRALS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
