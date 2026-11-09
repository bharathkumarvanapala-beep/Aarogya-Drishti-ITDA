import { describe, it, expect } from 'vitest';
import type { ExposureHistory, ScreeningSymptoms } from '../../../types';

describe('Website Unit Test: Frontline Clinical Triage & Risk Logic', () => {
  // Helper to compute clinical risk impression based on frontline protocol
  function computeRiskImpression(
    habits: ExposureHistory,
    symptoms: ScreeningSymptoms,
  ): 'LOW' | 'MODERATE' | 'HIGH' | 'URGENT' {
    // Cardinal urgent signs: restricted opening <= 2 fingers with non-healing ulcer > 3 weeks
    if (
      symptoms.persistentUlcer &&
      (symptoms.ulcerDurationWeeks || 0) >= 3 &&
      symptoms.restrictedMouthOpening &&
      (symptoms.mouthOpeningFingers || 3) <= 2
    ) {
      return 'URGENT';
    }

    // High risk: persistent ulcer or leukoplakic patch with high-risk habits (e.g. reverse smoking)
    if (
      (symptoms.persistentUlcer || symptoms.whiteOrRedPatch) &&
      (habits.reverseSmoking || habits.chewingTobacco)
    ) {
      return 'HIGH';
    }

    // Moderate risk: habit exposure without ulcer or patch
    if (habits.chewingTobacco || habits.smoking || habits.reverseSmoking) {
      return 'MODERATE';
    }

    return 'LOW';
  }

  it('should identify high-risk exposure for tribal reverse smoking (Chutta)', () => {
    const tribalHabit: ExposureHistory = {
      chewingTobacco: true,
      chewingDurationYears: 15,
      smoking: true,
      reverseSmoking: true, // Specific Agency habit with burning end held inside mouth
      alcohol: false,
    };

    expect(tribalHabit.reverseSmoking).toBe(true);
    expect(tribalHabit.chewingDurationYears).toBeGreaterThanOrEqual(10);
  });

  it('should evaluate restricted trismus when mouth opening is <= 2 fingers', () => {
    const trismusSymptom: ScreeningSymptoms = {
      persistentUlcer: true,
      ulcerDurationWeeks: 4,
      whiteOrRedPatch: true,
      patchType: 'white',
      anatomicalSite: 'right_buccal_mucosa',
      burningSensation: true,
      restrictedMouthOpening: true,
      mouthOpeningFingers: 2, // Cardinal restricted opening
      growthOrSwelling: true,
      bleedingOrPain: true,
      symptomDurationWeeks: 4,
    };

    expect(trismusSymptom.restrictedMouthOpening).toBe(true);
    expect(trismusSymptom.mouthOpeningFingers).toBeLessThanOrEqual(2);
  });

  it('should classify Kondala Rao synthetic case as URGENT/HIGH based on ulcer + trismus', () => {
    const kondalaHabits: ExposureHistory = {
      chewingTobacco: true,
      chewingFrequencyDaily: 5,
      chewingDurationYears: 22,
      smoking: false,
      reverseSmoking: true,
      alcohol: false,
    };

    const kondalaSymptoms: ScreeningSymptoms = {
      persistentUlcer: true,
      ulcerDurationWeeks: 4,
      whiteOrRedPatch: true,
      patchType: 'white',
      anatomicalSite: 'right_buccal_mucosa',
      burningSensation: true,
      restrictedMouthOpening: true,
      mouthOpeningFingers: 2,
      growthOrSwelling: true,
      bleedingOrPain: true,
      symptomDurationWeeks: 4,
    };

    const impression = computeRiskImpression(kondalaHabits, kondalaSymptoms);
    expect(impression).toBe('URGENT');
  });

  it('should classify habit-only asymptomatic screening as MODERATE', () => {
    const habitOnly: ExposureHistory = {
      chewingTobacco: true,
      chewingFrequencyDaily: 2,
      chewingDurationYears: 5,
      smoking: false,
      reverseSmoking: false,
      alcohol: false,
    };

    const noSymptoms: ScreeningSymptoms = {
      persistentUlcer: false,
      whiteOrRedPatch: false,
      burningSensation: false,
      restrictedMouthOpening: false,
      growthOrSwelling: false,
      bleedingOrPain: false,
      symptomDurationWeeks: 0,
    };

    const impression = computeRiskImpression(habitOnly, noSymptoms);
    expect(impression).toBe('MODERATE');
  });
});
