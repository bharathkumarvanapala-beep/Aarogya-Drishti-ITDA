import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveRegisteredPatient,
  getCustomPatients,
  saveActiveScreening,
  getActiveScreening,
  saveDoctorCase,
  getCustomDoctorCases,
  saveInboundReferral,
  getCustomInboundReferrals,
} from '../clinicalDataService';
import type { Patient } from '../../types';
import type { DoctorCase } from '../../features/doctor/doctorData';
import type { InboundReferral } from '../../features/hospital/hospitalData';

describe('Clinical Data Service End-to-End Persistence', () => {
  it('does not carry photographs or symptoms into a different patient screening', () => {
    const patient = { id: 'one', name: 'First', age: 46, gender: 'male', habitation: 'Village', mandal: 'Mandal' };
    saveActiveScreening({ patient, workerNotes: 'First patient only', capturedImages: { cheek: { url: 'first-photo' } } });
    saveActiveScreening({ patient: { ...patient, id: 'two', name: 'Second' } });
    expect(getActiveScreening()?.patient.id).toBe('two');
    expect(getActiveScreening()?.capturedImages).toBeUndefined();
    expect(getActiveScreening()?.workerNotes).toBeUndefined();
  });
  let mockLocal: Record<string, string> = {};
  let mockSession: Record<string, string> = {};

  beforeEach(() => {
    mockLocal = {};
    mockSession = {};

    globalThis.localStorage = {
      getItem: (key: string) => mockLocal[key] || null,
      setItem: (key: string, val: string) => {
        mockLocal[key] = val;
      },
      removeItem: (key: string) => {
        delete mockLocal[key];
      },
      clear: () => {
        mockLocal = {};
      },
      length: 0,
      key: () => null,
    };

    globalThis.sessionStorage = {
      getItem: (key: string) => mockSession[key] || null,
      setItem: (key: string, val: string) => {
        mockSession[key] = val;
      },
      removeItem: (key: string) => {
        delete mockSession[key];
      },
      clear: () => {
        mockSession = {};
      },
      length: 0,
      key: () => null,
    };
  });

  it('saves and retrieves newly registered patients in local and session storage', () => {
    const testPatient: Patient = {
      id: 'ASR-PAT-2026-3907',
      uniquePatientId: 'ASR-PAT-2026-3907',
      cardReferenceToken: 'CARD-TOK-3907',
      firstName: 'Rama Rao',
      lastName: 'Korra',
      firstNameTe: 'రామారావు',
      lastNameTe: 'కొర్ర',
      age: 23,
      gender: 'male',
      district: 'Alluri Sitharama Raju',
      mandal: 'G. Madugula',
      gramPanchayat: 'Kothapalli',
      village: 'Kothapalli',
      contactPhone: '9849012345',
      hasSmartphone: true,
      preferredLanguage: 'te',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      healthWorkerId: 'ASHA-GMAD-01',
    };

    saveRegisteredPatient(testPatient);

    const customPatients = getCustomPatients();
    expect(customPatients).toHaveLength(1);
    expect(customPatients[0].firstName).toBe('Rama Rao');
    expect(customPatients[0].uniquePatientId).toBe('ASR-PAT-2026-3907');

    const sessionPatient = JSON.parse(sessionStorage.getItem('active_screening_patient') || '{}');
    expect(sessionPatient.firstName).toBe('Rama Rao');
  });

  it('persists active screening intake and uploaded oral photographs', () => {
    const intakePayload = {
      patient: {
        id: 'ASR-PAT-2026-3907',
        name: 'Rama Rao Korra',
        age: 23,
        gender: 'Male',
        habitation: 'Kothapalli',
        mandal: 'G. Madugula',
      },
      habits: {
        chewingTobacco: true,
        chewingFrequency: '3 packets/day',
        chewingYears: '5',
        smoking: false,
        reverseSmoking: false,
        alcohol: false,
      },
      symptoms: {
        persistentPatch: true,
        nonHealingUlcer: false,
        burningSensation: true,
        restrictedMouthOpening: false,
        swellingLump: false,
      },
      activeImageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
      capturedImages: {
        tongue: {
          url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
          quality: { overall: 'acceptable', sharpness: 92 },
        },
      },
    };

    saveActiveScreening(intakePayload);

    const active = getActiveScreening();
    expect(active).not.toBeNull();
    expect(active?.patient.name).toBe('Rama Rao Korra');
    expect(active?.habits?.chewingTobacco).toBe(true);
    expect(active?.activeImageUrl).toContain('data:image/jpeg');
    expect(active?.capturedImages?.tongue).toBeDefined();
  });

  it('saves and retrieves escalated doctor cases for doctor workstation queue', () => {
    const testCase: DoctorCase = {
      id: 'SCR-2026-3907',
      patientId: 'ASR-PAT-2026-3907',
      patientName: 'Rama Rao Korra',
      patientNameTe: 'రామారావు కొర్ర',
      age: 23,
      gender: 'male',
      habitation: 'Kothapalli',
      mandal: 'G. Madugula',
      healthWorkerName: 'Lakshmi Devi (ASHA Worker)',
      screeningDate: '2026-11-04',
      status: 'NEW',
      triagePriority: 'HIGH_PRIORITY',
      complaint: 'Non-healing lesion on tongue',
      complaintTe: 'నాలుకపై తగ్గని పుండు',
      duration: '3 weeks',
      tobaccoHistory: 'Daily gutkha chewing',
      reverseSmoking: false,
      trismusFingers: '3.0',
      burningSensation: true,
      images: [
        {
          id: 'img-1',
          viewKey: 'tongue',
          viewName: 'Tongue (Dorsum & Lateral)',
          viewNameTe: 'నాలుక ఉపరితలం & ప్రక్క భాగాలు',
          url: 'data:image/jpeg;base64,mockImageData',
          quality: 'acceptable',
          sharpnessScore: 92,
          lightingScore: 88,
          resolution: '1920x1440',
        },
      ],
      aiDemoOutput: {
        modelVersion: 'mock-v1',
        provider: 'mock',
        researchLabel: 'suspicious_example',
        score: null,
        isClinical: false,
        disclaimer: 'RESEARCH ONLY',
      },
    };

    saveDoctorCase(testCase);

    const customCases = getCustomDoctorCases();
    expect(customCases).toHaveLength(1);
    expect(customCases[0].patientName).toBe('Rama Rao Korra');
    expect(customCases[0].images[0].url).toBe('data:image/jpeg;base64,mockImageData');
  });

  it('saves and retrieves hospital inbound referrals for specialist coordinator queue', () => {
    const testReferral: InboundReferral = {
      id: 'REF-2026-8812',
      screeningId: 'SCR-2026-3907',
      patientId: 'ASR-PAT-2026-3907',
      patientName: 'Rama Rao Korra',
      patientNameTe: 'రామారావు కొర్ర',
      age: 23,
      gender: 'male',
      habitation: 'Kothapalli',
      gramPanchayat: 'Kothapalli',
      mandal: 'G. Madugula',
      referringFacility: 'PHC G. Madugula',
      referringDoctor: 'Dr. K. Suresh, MBBS',
      priority: 'URGENT_72H',
      provisionalDiagnosis: 'Oral Potentially Malignant Disorder (OPMD)',
      assignedSpecialist: 'Dr. M. Anand, MDS (Oral Onco-Surgery)',
      status: 'NEW',
      dateReferred: '2026-11-04',
      transportAssistance: 'ITDA 108 Ambulance Requested',
      notes: 'Urgent diagnostic punch biopsy recommended.',
    };

    saveInboundReferral(testReferral);

    const customReferrals = getCustomInboundReferrals();
    expect(customReferrals).toHaveLength(1);
    expect(customReferrals[0].patientName).toBe('Rama Rao Korra');
    expect(customReferrals[0].priority).toBe('URGENT_72H');
  });
});
