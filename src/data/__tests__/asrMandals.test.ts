import { describe, it, expect } from 'vitest';
import {
  ASR_MANDALS,
  ASR_DIVISIONS,
  TOTAL_ASR_MANDALS_COUNT,
  getAllMandals,
  getMandalsByDivision,
  findMandal,
  getHabitationsForMandal,
  getPanchayatsForMandal,
  getPanchayatNamesForMandal,
  getMandalDropdownOptions,
  TOTAL_ASR_PANCHAYATS_COUNT,
  getAllDistrictPanchayats,
  ASR_PANCHAYATS_BY_MANDAL,
  TOTAL_ASR_VILLAGES_COUNT,
  getAllDistrictVillages,
  getVillagesForPanchayat,
  getVillagesForMandal,
  searchDistrictVillages,
} from '../asrMandals';

describe('ASR District Mandals & Gram Panchayats Dataset', () => {
  it('contains exactly 22 official mandals in Alluri Sitharama Raju (ASR) District', () => {
    expect(TOTAL_ASR_MANDALS_COUNT).toBe(22);
    expect(ASR_MANDALS.length).toBe(22);
    expect(getAllMandals().length).toBe(22);
  });

  it('correctly maps all 3 revenue divisions with official mandal distributions', () => {
    expect(ASR_DIVISIONS.length).toBe(3);

    const paderuMandals = getMandalsByDivision('Paderu');
    const rampaMandals = getMandalsByDivision('Rampachodavaram');
    const chintoorMandals = getMandalsByDivision('Chintoor');

    expect(paderuMandals.length).toBe(11);
    expect(rampaMandals.length).toBe(7);
    expect(chintoorMandals.length).toBe(4);
    expect(paderuMandals.length + rampaMandals.length + chintoorMandals.length).toBe(22);
  });

  it('contains all 423 officially gazetted Gram Panchayats across the 22 mandals', () => {
    expect(TOTAL_ASR_PANCHAYATS_COUNT).toBe(423);

    const allGPs = getAllDistrictPanchayats();
    expect(allGPs.length).toBe(423);

    // Verify all 22 keys in dictionary
    expect(Object.keys(ASR_PANCHAYATS_BY_MANDAL).length).toBe(22);
  });

  it('verifies exact Gram Panchayat counts for every mandal in official order', () => {
    // Paderu Division
    expect(getPanchayatsForMandal('paderu').length).toBe(26);
    expect(getPanchayatsForMandal('g_madugula').length).toBe(17);
    expect(getPanchayatsForMandal('araku_valley').length).toBe(14);
    expect(getPanchayatsForMandal('chintapalli').length).toBe(17);
    expect(getPanchayatsForMandal('dumbriguda').length).toBe(18);
    expect(getPanchayatsForMandal('ananthagiri').length).toBe(24);
    expect(getPanchayatsForMandal('hukumpeta').length).toBe(33);
    expect(getPanchayatsForMandal('pedabayalu').length).toBe(23);
    expect(getPanchayatsForMandal('munchingi_puttu').length).toBe(23);
    expect(getPanchayatsForMandal('gk_veedhi').length).toBe(16);
    expect(getPanchayatsForMandal('koyyuru').length).toBe(33);

    // Rampachodavaram Division
    expect(getPanchayatsForMandal('rampachodavaram').length).toBe(19);
    expect(getPanchayatsForMandal('maredumilli').length).toBe(12);
    expect(getPanchayatsForMandal('devipatnam').length).toBe(14);
    expect(getPanchayatsForMandal('y_ramavaram').length).toBe(17);
    expect(getPanchayatsForMandal('addateegala').length).toBe(22);
    expect(getPanchayatsForMandal('gangavaram').length).toBe(17);
    expect(getPanchayatsForMandal('rajavommangi').length).toBe(19);

    // Chintoor Division
    expect(getPanchayatsForMandal('chintoor').length).toBe(18);
    expect(getPanchayatsForMandal('kunavaram').length).toBe(16);
    expect(getPanchayatsForMandal('vr_puram').length).toBe(13);
    expect(getPanchayatsForMandal('etapaka').length).toBe(12);
  });

  it('verifies that every single Gram Panchayat has non-empty English name and authentic Telugu script', () => {
    const teluguRegex = /[\u0C00-\u0C7F]/;
    const allGPs = getAllDistrictPanchayats();

    allGPs.forEach((gp) => {
      expect(gp.nameEn.length).toBeGreaterThan(0);
      expect(gp.nameTe.length).toBeGreaterThan(0);
      expect(teluguRegex.test(gp.nameTe)).toBe(true);
      expect(gp.orderNumber).toBeGreaterThan(0);
      expect(['Paderu', 'Rampachodavaram', 'Chintoor']).toContain(gp.division);
    });
  });

  it('finds mandals by English name, Telugu name, and ID case-insensitively', () => {
    expect(findMandal('paderu')?.nameEn).toBe('Paderu');
    expect(findMandal('PADERU')?.nameEn).toBe('Paderu');
    expect(findMandal('పాడేరు')?.nameEn).toBe('Paderu');
    expect(findMandal('G. Madugula')?.id).toBe('g_madugula');
    expect(findMandal('Maredumilli')?.division).toBe('Rampachodavaram');
    expect(findMandal('Chintoor')?.division).toBe('Chintoor');
    expect(findMandal('UnknownMandal')).toBeUndefined();
  });

  it('retrieves habitations and gram panchayat string lists for a mandal', () => {
    const habitations = getHabitationsForMandal('G. Madugula');
    expect(habitations.length).toBeGreaterThan(0);
    expect(habitations.some((h) => h.nameEn === 'Kothapalli')).toBe(true);

    const panchayats = getPanchayatsForMandal('G. Madugula');
    expect(panchayats.length).toBe(17);
    expect(panchayats.some((p) => p.nameEn === 'Nurmathi')).toBe(true);

    const names = getPanchayatNamesForMandal('G. Madugula');
    expect(names.length).toBe(17);
    expect(names[0]).toContain('GP');
  });

  it('generates standardized dropdown options with bilingual labels for all 22 mandals', () => {
    const options = getMandalDropdownOptions();
    expect(options.length).toBe(22);
    options.forEach((opt) => {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toContain('(');
      expect(opt.labelTe).toContain('(');
      expect(['Paderu', 'Rampachodavaram', 'Chintoor']).toContain(opt.division);
    });
  });

  it('contains comprehensive villages across all 423 Gram Panchayats with bilingual Telugu names', () => {
    expect(TOTAL_ASR_VILLAGES_COUNT).toBeGreaterThanOrEqual(1694);

    const allVillages = getAllDistrictVillages();
    expect(allVillages.length).toBe(TOTAL_ASR_VILLAGES_COUNT);

    const teluguRegex = /[\u0C00-\u0C7F]/;
    allVillages.forEach((v) => {
      expect(v.nameEn.length).toBeGreaterThan(0);
      expect(v.nameTe.length).toBeGreaterThan(0);
      expect(teluguRegex.test(v.nameTe)).toBe(true);
      expect(v.mandalId.length).toBeGreaterThan(0);
      expect(v.panchayatNameEn.length).toBeGreaterThan(0);
      expect(v.type).toBeTruthy();
    });
  });

  it('retrieves constituent villages for specific Gram Panchayats and Mandals', () => {
    // Check specific panchayat in G. Madugula
    const kothapalliPanchayatVillages = getVillagesForPanchayat('Kothapalli', 'g_madugula');
    expect(kothapalliPanchayatVillages.length).toBeGreaterThanOrEqual(3);
    expect(kothapalliPanchayatVillages.some((v) => v.nameEn.includes('Kothapalli'))).toBe(true);

    // Check specific mandal villages
    const paderuVillages = getVillagesForMandal('paderu');
    expect(paderuVillages.length).toBeGreaterThanOrEqual(100);

    // Search district villages
    const searchResults = searchDistrictVillages('Tajangi');
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some((v) => v.nameEn.toLowerCase().includes('tajangi'))).toBe(true);
  });
});
