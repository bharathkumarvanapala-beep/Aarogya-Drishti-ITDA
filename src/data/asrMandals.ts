/**
 * Alluri Sitharama Raju (ASR) District - Mandals & Administrative Dataset
 * 
 * Official Structure: 22 Mandals across 3 Revenue Divisions:
 * 1. Paderu Division (11 Mandals - 244 Gram Panchayats)
 * 2. Rampachodavaram Division (7 Mandals - 120 Gram Panchayats)
 * 3. Chintoor Division (4 Mandals - 59 Gram Panchayats)
 * 
 * Total: 22 Mandals, 423 Gram Panchayats.
 * Supports bilingual display (English and Telugu) for frontend dropdowns,
 * filters, patient intake, clinic directories, and administrative dashboards.
 */

import {
  ASR_PANCHAYATS_BY_MANDAL,
  getOfficialPanchayats,
  TOTAL_ASR_PANCHAYATS_COUNT,
  getAllDistrictPanchayats,
  type PanchayatItem,
} from './asrPanchayats';
import {
  ASR_VILLAGES_BY_PANCHAYAT,
  getVillagesForPanchayat,
  getVillagesForMandal,
  getAllDistrictVillages,
  searchDistrictVillages,
  TOTAL_ASR_VILLAGES_COUNT,
  type VillageInfo,
  type VillageItem,
} from './asrVillages';

export type RevenueDivision = 'Paderu' | 'Rampachodavaram' | 'Chintoor';

export interface MandalInfo {
  id: string;
  nameEn: string;
  nameTe: string;
  division: RevenueDivision;
  divisionTe: string;
  headquarters: string;
  headquartersTe: string;
  isPilot?: boolean;
  panchayatCount: number;
  primaryFacility: {
    nameEn: string;
    nameTe: string;
    type: 'District Hospital' | 'Area Hospital' | 'Community Health Centre' | 'Primary Health Centre';
    typeTe: string;
  };
  sampleHabitations: {
    nameEn: string;
    nameTe: string;
  }[];
  panchayats: {
    nameEn: string;
    nameTe: string;
  }[];
  samplePanchayats: string[];
}

export const ASR_DIVISIONS: { id: RevenueDivision; nameEn: string; nameTe: string; mandalCount: number }[] = [
  { id: 'Paderu', nameEn: 'Paderu Division', nameTe: 'పాడేరు డివిజన్', mandalCount: 11 },
  { id: 'Rampachodavaram', nameEn: 'Rampachodavaram Division', nameTe: 'రంపచోడవరం డివిజన్', mandalCount: 7 },
  { id: 'Chintoor', nameEn: 'Chintoor Division', nameTe: 'చింతూరు డివిజన్', mandalCount: 4 },
];

export const ASR_MANDALS: MandalInfo[] = [
  // ==================== PADERU REVENUE DIVISION (11 Mandals) ====================
  {
    id: 'paderu',
    nameEn: 'Paderu',
    nameTe: 'పాడేరు',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Paderu',
    headquartersTe: 'పాడేరు',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.paderu.length,
    primaryFacility: {
      nameEn: 'District Hospital, Paderu',
      nameTe: 'జిల్లా ఆసుపత్రి, పాడేరు',
      type: 'District Hospital',
      typeTe: 'జిల్లా ఆసుపత్రి & స్పెషలిస్ట్ రిఫరల్ కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Paderu Town', nameTe: 'పాడేరు టౌన్' },
      { nameEn: 'Minumuluru', nameTe: 'మినుములూరు' },
      { nameEn: 'Kinchumanda', nameTe: 'కించుమండ' },
      { nameEn: 'Talari Singi', nameTe: 'తలారి సింగి' },
      { nameEn: 'Gondi', nameTe: 'గొండి' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.paderu,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.paderu.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'g_madugula',
    nameEn: 'G. Madugula',
    nameTe: 'జి. మాడుగుల',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'G. Madugula',
    headquartersTe: 'జి. మాడుగుల',
    isPilot: true,
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.g_madugula.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), G. Madugula',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, జి. మాడుగుల',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Kothapalli', nameTe: 'కొత్తపల్లి' },
      { nameEn: 'Nurmati', nameTe: 'నూర్మతి' },
      { nameEn: 'Solabham', nameTe: 'సొలభం' },
      { nameEn: 'G. Madugula Proper', nameTe: 'జి. మాడుగుల ప్రొపర్' },
      { nameEn: 'Boddaputtu', nameTe: 'బొడ్డపుట్టు' },
      { nameEn: 'Vanjari', nameTe: 'వంజరి' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.g_madugula,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.g_madugula.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'araku_valley',
    nameEn: 'Araku Valley',
    nameTe: 'అరకు లోయ',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Araku Valley',
    headquartersTe: 'అరకు లోయ',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.araku_valley.length,
    primaryFacility: {
      nameEn: 'Community Health Centre (CHC), Araku Valley',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, అరకు లోయ',
      type: 'Community Health Centre',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం (30 బెడ్లు)',
    },
    sampleHabitations: [
      { nameEn: 'Araku Town', nameTe: 'అరకు టౌన్' },
      { nameEn: 'Padmapuram', nameTe: 'పద్మాపురం' },
      { nameEn: 'Chompi', nameTe: 'చొంపి' },
      { nameEn: 'Madagada', nameTe: 'మడగడ' },
      { nameEn: 'Sunkarametta', nameTe: 'సుంకరమెట్ట' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.araku_valley,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.araku_valley.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'chintapalli',
    nameEn: 'Chintapalli',
    nameTe: 'చింతపల్లి',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Chintapalli',
    headquartersTe: 'చింతపల్లి',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.chintapalli.length,
    primaryFacility: {
      nameEn: 'Community Health Centre (CHC), Chintapalli',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, చింతపల్లి',
      type: 'Community Health Centre',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Chintapalli Proper', nameTe: 'చింతపల్లి ప్రొపర్' },
      { nameEn: 'Lambasingi', nameTe: 'లంబసింగి' },
      { nameEn: 'Tajangi', nameTe: 'తాజంగి' },
      { nameEn: 'Kudumulu', nameTe: 'కుడుములు' },
      { nameEn: 'Lothugedda', nameTe: 'లోతుగెడ్డ' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.chintapalli,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.chintapalli.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'dumbriguda',
    nameEn: 'Dumbriguda',
    nameTe: 'డుంబ్రిగుడ',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Dumbriguda',
    headquartersTe: 'డుంబ్రిగుడ',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.dumbriguda.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Dumbriguda',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, డుంబ్రిగుడ',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Dumbriguda Proper', nameTe: 'డుంబ్రిగుడ ప్రొపర్' },
      { nameEn: 'Araku RS', nameTe: 'అరకు ఆర్.ఎస్' },
      { nameEn: 'Kandrum', nameTe: 'కండ్రుం' },
      { nameEn: 'Gojangi', nameTe: 'గొజాంగి' },
      { nameEn: 'Chaparai', nameTe: 'చాపరాయి' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.dumbriguda,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.dumbriguda.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'ananthagiri',
    nameEn: 'Ananthagiri',
    nameTe: 'అనంతగిరి',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Ananthagiri',
    headquartersTe: 'అనంతగిరి',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.ananthagiri.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Ananthagiri',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, అనంతగిరి',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Ananthagiri Proper', nameTe: 'అనంతగిరి ప్రొపర్' },
      { nameEn: 'Tyda', nameTe: 'టైడా' },
      { nameEn: 'Borra Caves Village', nameTe: 'బొర్రా గుహల గ్రామం' },
      { nameEn: 'Gummakota', nameTe: 'గుమ్మకోట' },
      { nameEn: 'Bhimpolu', nameTe: 'భీంపొలు' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.ananthagiri,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.ananthagiri.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'hukumpeta',
    nameEn: 'Hukumpeta',
    nameTe: 'హుకుంపేట',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Hukumpeta',
    headquartersTe: 'హుకుంపేట',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.hukumpeta.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Hukumpeta',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, హుకుంపేట',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Hukumpeta Proper', nameTe: 'హుకుంపేట ప్రొపర్' },
      { nameEn: 'Bakuru', nameTe: 'బాకూరు' },
      { nameEn: 'Mattam', nameTe: 'మట్టం' },
      { nameEn: 'Ganthaguda', nameTe: 'గంతగూడ' },
      { nameEn: 'Tadivalasa', nameTe: 'తాడివలస' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.hukumpeta,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.hukumpeta.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'pedabayalu',
    nameEn: 'Pedabayalu',
    nameTe: 'పెదబయలు',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Pedabayalu',
    headquartersTe: 'పెదబయలు',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.pedabayalu.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Pedabayalu',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, పెదబయలు',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Pedabayalu Proper', nameTe: 'పెదబయలు ప్రొపర్' },
      { nameEn: 'Kinchuru', nameTe: 'కించూరు' },
      { nameEn: 'Gimparai', nameTe: 'గింపరాయి' },
      { nameEn: 'Rudavalasa', nameTe: 'రుదవాలస' },
      { nameEn: 'Jamiguda', nameTe: 'జామిగూడ' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.pedabayalu,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.pedabayalu.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'munchingi_puttu',
    nameEn: 'Munchingi Puttu',
    nameTe: 'ముంచింగిపుట్టు',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Munchingi Puttu',
    headquartersTe: 'ముంచింగిపుట్టు',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.munchingi_puttu.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Munchingi Puttu',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, ముంచింగిపుట్టు',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Munchingi Puttu Proper', nameTe: 'ముంచింగిపుట్టు ప్రొపర్' },
      { nameEn: 'Suputuru', nameTe: 'సుపుటూరు' },
      { nameEn: 'Jolaput Border', nameTe: 'జోలాపుట్ సరిహద్దు' },
      { nameEn: 'Bungaput', nameTe: 'బుంగపుట్' },
      { nameEn: 'Kumada', nameTe: 'కుమడ' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.munchingi_puttu,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.munchingi_puttu.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'gk_veedhi',
    nameEn: 'G.K. Veedhi',
    nameTe: 'గూడెం కొత్త వీధి',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'G.K. Veedhi',
    headquartersTe: 'గూడెం కొత్త వీధి',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.gk_veedhi.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), G.K. Veedhi',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, గూడెం కొత్త వీధి',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'G.K. Veedhi Proper', nameTe: 'గూడెం కొత్త వీధి ప్రొపర్' },
      { nameEn: 'Sileru', nameTe: 'సీలేరు' },
      { nameEn: 'Dharakonda', nameTe: 'ధారకొండ' },
      { nameEn: 'Rintada', nameTe: 'రింతడ' },
      { nameEn: 'Saputla', nameTe: 'సాపుట్ల' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.gk_veedhi,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.gk_veedhi.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'koyyuru',
    nameEn: 'Koyyuru',
    nameTe: 'కొయ్యూరు',
    division: 'Paderu',
    divisionTe: 'పాడేరు డివిజన్',
    headquarters: 'Koyyuru',
    headquartersTe: 'కొయ్యూరు',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.koyyuru.length,
    primaryFacility: {
      nameEn: 'Community Health Centre (CHC), Koyyuru',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, కొయ్యూరు',
      type: 'Community Health Centre',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Koyyuru Proper', nameTe: 'కొయ్యూరు ప్రొపర్' },
      { nameEn: 'Mampa', nameTe: 'మాంప' },
      { nameEn: 'Downuru', nameTe: 'డౌనూరు' },
      { nameEn: 'Budidha', nameTe: 'బూడిద' },
      { nameEn: 'Rajendrapalayam', nameTe: 'రాజేంద్రపాలెం' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.koyyuru,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.koyyuru.map((p) => `${p.nameEn} GP`),
  },

  // ==================== RAMPACHODAVARAM REVENUE DIVISION (7 Mandals) ====================
  {
    id: 'rampachodavaram',
    nameEn: 'Rampachodavaram',
    nameTe: 'రంపచోడవరం',
    division: 'Rampachodavaram',
    divisionTe: 'రంపచోడవరం డివిజన్',
    headquarters: 'Rampachodavaram',
    headquartersTe: 'రంపచోడవరం',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.rampachodavaram.length,
    primaryFacility: {
      nameEn: 'Area Hospital, Rampachodavaram',
      nameTe: 'ఏరియా ఆసుపత్రి, రంపచోడవరం',
      type: 'Area Hospital',
      typeTe: 'ఏరియా ఆసుపత్రి & రెఫరల్ కేంద్రం (100 బెడ్లు)',
    },
    sampleHabitations: [
      { nameEn: 'Rampachodavaram Town', nameTe: 'రంపచోడవరం టౌన్' },
      { nameEn: 'Bandapalli', nameTe: 'బండపల్లి' },
      { nameEn: 'Fouzdarpeta', nameTe: 'ఫౌజ్దార్‌పేట' },
      { nameEn: 'Irlapalle', nameTe: 'ఇర్లపల్లె' },
      { nameEn: 'Vadigere', nameTe: 'వాడిగెరె' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.rampachodavaram,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.rampachodavaram.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'maredumilli',
    nameEn: 'Maredumilli',
    nameTe: 'మారేడుమిల్లి',
    division: 'Rampachodavaram',
    divisionTe: 'రంపచోడవరం డివిజన్',
    headquarters: 'Maredumilli',
    headquartersTe: 'మారేడుమిల్లి',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.maredumilli.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Maredumilli',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, మారేడుమిల్లి',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Maredumilli Proper', nameTe: 'మారేడుమిల్లి ప్రొపర్' },
      { nameEn: 'Valamuru', nameTe: 'వలమూరు' },
      { nameEn: 'Bodlanka', nameTe: 'బోడ్లంక' },
      { nameEn: 'Kutravada', nameTe: 'కుత్రవాడ' },
      { nameEn: 'Gudisa', nameTe: 'గుడిస' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.maredumilli,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.maredumilli.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'devipatnam',
    nameEn: 'Devipatnam',
    nameTe: 'దేవీపట్నం',
    division: 'Rampachodavaram',
    divisionTe: 'రంపచోడవరం డివిజన్',
    headquarters: 'Devipatnam',
    headquartersTe: 'దేవీపట్నం',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.devipatnam.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Devipatnam',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, దేవీపట్నం',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Devipatnam Proper', nameTe: 'దేవీపట్నం ప్రొపర్' },
      { nameEn: 'Posammagandi', nameTe: 'పోచమ్మగండి' },
      { nameEn: 'Dandangi', nameTe: 'దండంగి' },
      { nameEn: 'Toyyeru', nameTe: 'తొయ్యేరు' },
      { nameEn: 'Kachuluru', nameTe: 'కచులూరు' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.devipatnam,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.devipatnam.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'y_ramavaram',
    nameEn: 'Y. Ramavaram',
    nameTe: 'వై. రామవరం',
    division: 'Rampachodavaram',
    divisionTe: 'రంపచోడవరం డివిజన్',
    headquarters: 'Y. Ramavaram',
    headquartersTe: 'వై. రామవరం',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.y_ramavaram.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Y. Ramavaram',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, వై. రామవరం',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Y. Ramavaram Proper', nameTe: 'వై. రామవరం ప్రొపర్' },
      { nameEn: 'Gurthedu', nameTe: 'గుర్తేడు' },
      { nameEn: 'Chavulakota', nameTe: 'చావులకోట' },
      { nameEn: 'Dalipatiguda', nameTe: 'దాలిపాటిగూడ' },
      { nameEn: 'Kota', nameTe: 'కోట' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.y_ramavaram,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.y_ramavaram.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'addateegala',
    nameEn: 'Addateegala',
    nameTe: 'అడ్డతీగల',
    division: 'Rampachodavaram',
    divisionTe: 'రంపచోడవరం డివిజన్',
    headquarters: 'Addateegala',
    headquartersTe: 'అడ్డతీగల',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.addateegala.length,
    primaryFacility: {
      nameEn: 'Community Health Centre (CHC), Addateegala',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, అడ్డతీగల',
      type: 'Community Health Centre',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Addateegala Proper', nameTe: 'అడ్డతీగల ప్రొపర్' },
      { nameEn: 'D. Bhimavaram', nameTe: 'డి. భీమవరం' },
      { nameEn: 'Ellavaram', nameTe: 'ఎల్లవరం' },
      { nameEn: 'Veti Mamidi', nameTe: 'వేటి మామిడి' },
      { nameEn: 'Rayapalli', nameTe: 'రాయపల్లి' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.addateegala,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.addateegala.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'gangavaram',
    nameEn: 'Gangavaram',
    nameTe: 'గంగవరం',
    division: 'Rampachodavaram',
    divisionTe: 'రంపచోడవరం డివిజన్',
    headquarters: 'Gangavaram',
    headquartersTe: 'గంగవరం',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.gangavaram.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Gangavaram',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, గంగవరం',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Gangavaram Proper', nameTe: 'గంగవరం ప్రొపర్' },
      { nameEn: 'Jeediguppa', nameTe: 'జీడిగుప్ప' },
      { nameEn: 'Surampalem', nameTe: 'సూరంపాలెం' },
      { nameEn: 'Kothada', nameTe: 'కొత్తడ' },
      { nameEn: 'Kondapalli', nameTe: 'కొండపల్లి' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.gangavaram,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.gangavaram.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'rajavommangi',
    nameEn: 'Rajavommangi',
    nameTe: 'రాజవొమ్మంగి',
    division: 'Rampachodavaram',
    divisionTe: 'రంపచోడవరం డివిజన్',
    headquarters: 'Rajavommangi',
    headquartersTe: 'రాజవొమ్మంగి',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.rajavommangi.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Rajavommangi',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, రాజవొమ్మంగి',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Rajavommangi Proper', nameTe: 'రాజవొమ్మంగి ప్రొపర్' },
      { nameEn: 'Labbarthi', nameTe: 'లబ్బర్తి' },
      { nameEn: 'Jaddangi', nameTe: 'జద్దంగి' },
      { nameEn: 'Vathangi', nameTe: 'వాతంగి' },
      { nameEn: 'Amalapuram Tribal', nameTe: 'అమలాపురం గిరిజన గ్రామం' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.rajavommangi,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.rajavommangi.map((p) => `${p.nameEn} GP`),
  },

  // ==================== CHINTOOR REVENUE DIVISION (4 Mandals) ====================
  {
    id: 'chintoor',
    nameEn: 'Chintoor',
    nameTe: 'చింతూరు',
    division: 'Chintoor',
    divisionTe: 'చింతూరు డివిజన్',
    headquarters: 'Chintoor',
    headquartersTe: 'చింతూరు',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.chintoor.length,
    primaryFacility: {
      nameEn: 'Community Health Centre (CHC), Chintoor',
      nameTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం, చింతూరు',
      type: 'Community Health Centre',
      typeTe: 'కమ్యూనిటీ ఆరోగ్య కేంద్రం (30 బెడ్లు)',
    },
    sampleHabitations: [
      { nameEn: 'Chintoor Proper', nameTe: 'చింతూరు ప్రొపర్' },
      { nameEn: 'Mothe', nameTe: 'మోతే' },
      { nameEn: 'Chattisgarh Gate', nameTe: 'ఛత్తీస్‌గఢ్ సరిహద్దు గేట్' },
      { nameEn: 'Kolluru', nameTe: 'కొల్లూరు' },
      { nameEn: 'Kummurugudem', nameTe: 'కుమ్మురుగూడెం' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.chintoor,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.chintoor.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'kunavaram',
    nameEn: 'Kunavaram',
    nameTe: 'కూనవరం',
    division: 'Chintoor',
    divisionTe: 'చింతూరు డివిజన్',
    headquarters: 'Kunavaram',
    headquartersTe: 'కూనవరం',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.kunavaram.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Kunavaram',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, కూనవరం',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Kunavaram Proper', nameTe: 'కూనవరం ప్రొపర్' },
      { nameEn: 'Godavari Sangam', nameTe: 'గోదావరి-శబరి సంగమం' },
      { nameEn: 'Kondrajupeta', nameTe: 'కొండ్రాజుపేట' },
      { nameEn: 'Tekulaboru', nameTe: 'టేకులబోరు' },
      { nameEn: 'Peda Arkuru', nameTe: 'పెద ఆర్కూరు' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.kunavaram,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.kunavaram.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'vr_puram',
    nameEn: 'VR Puram',
    nameTe: 'వరరామచంద్రపురం',
    division: 'Chintoor',
    divisionTe: 'చింతూరు డివిజన్',
    headquarters: 'Vararamachandrapuram',
    headquartersTe: 'వరరామచంద్రపురం',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.vr_puram.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Vararamachandrapuram',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, వరరామచంద్రపురం (VR పురం)',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'VR Puram Proper', nameTe: 'వి.ఆర్. పురం ప్రొపర్' },
      { nameEn: 'Rekhapalle', nameTe: 'రేఖపల్లె' },
      { nameEn: 'Jeedi Guppa', nameTe: 'జీడి గుప్ప' },
      { nameEn: 'Waddigudem', nameTe: 'వడ్డిగూడెం' },
      { nameEn: 'Sunnambattu', nameTe: 'సున్నంబట్టు' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.vr_puram,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.vr_puram.map((p) => `${p.nameEn} GP`),
  },
  {
    id: 'etapaka',
    nameEn: 'Etapaka',
    nameTe: 'ఎటపాక',
    division: 'Chintoor',
    divisionTe: 'చింతూరు డివిజన్',
    headquarters: 'Etapaka',
    headquartersTe: 'ఎటపాక',
    panchayatCount: ASR_PANCHAYATS_BY_MANDAL.etapaka.length,
    primaryFacility: {
      nameEn: 'Primary Health Centre (PHC), Etapaka',
      nameTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం, ఎటపాక',
      type: 'Primary Health Centre',
      typeTe: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    },
    sampleHabitations: [
      { nameEn: 'Etapaka Proper', nameTe: 'ఎటపాక ప్రొపర్' },
      { nameEn: 'Nellipaka', nameTe: 'నెల్లిపాక' },
      { nameEn: 'Gowridevipeta', nameTe: 'గౌరీదేవిపేట' },
      { nameEn: 'Gannavaram Tribal', nameTe: 'గన్నవరం గిరిజన ప్రాంతం' },
      { nameEn: 'Tothapalli', nameTe: 'తోటపల్లి' },
    ],
    panchayats: ASR_PANCHAYATS_BY_MANDAL.etapaka,
    samplePanchayats: ASR_PANCHAYATS_BY_MANDAL.etapaka.map((p) => `${p.nameEn} GP`),
  },
];

/** Total count of officially recognized mandals in ASR District */
export const TOTAL_ASR_MANDALS_COUNT = ASR_MANDALS.length; // 22

/** Helper: Get all mandals sorted by revenue division and name */
export function getAllMandals(): MandalInfo[] {
  return [...ASR_MANDALS];
}

/** Helper: Filter mandals by revenue division */
export function getMandalsByDivision(division: RevenueDivision): MandalInfo[] {
  return ASR_MANDALS.filter((m) => m.division === division);
}

/** Helper: Find mandal by ID or Name (case-insensitive) */
export function findMandal(query: string): MandalInfo | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  return ASR_MANDALS.find(
    (m) =>
      m.id.toLowerCase() === q ||
      m.nameEn.toLowerCase() === q ||
      m.nameTe === query.trim() ||
      m.headquarters.toLowerCase() === q
  );
}

/** Helper: Get list of Habitations / Villages for a specific Mandal */
export function getHabitationsForMandal(mandalNameOrId: string): { nameEn: string; nameTe: string }[] {
  const villages = getVillagesForMandal(mandalNameOrId);
  if (villages && villages.length > 0) {
    return villages.map((v) => ({ nameEn: v.nameEn, nameTe: v.nameTe }));
  }
  const m = findMandal(mandalNameOrId);
  return m ? m.sampleHabitations : [];
}

/** Helper: Get list of Gram Panchayats for a specific Mandal in order (bilingual) */
export function getPanchayatsForMandal(mandalNameOrId: string): { nameEn: string; nameTe: string }[] {
  return getOfficialPanchayats(mandalNameOrId);
}

/** Helper: Get string list of Gram Panchayats for a specific Mandal */
export function getPanchayatNamesForMandal(mandalNameOrId: string): string[] {
  const m = findMandal(mandalNameOrId);
  if (m) {
    return m.samplePanchayats;
  }
  return getOfficialPanchayats(mandalNameOrId).map((p) => `${p.nameEn} GP`);
}

/** Dropdown Option format for standard select elements */
export interface MandalDropdownOption {
  value: string;
  label: string;
  labelTe: string;
  division: RevenueDivision;
}

/** Generate standardized dropdown options with bilingual labels */
export function getMandalDropdownOptions(): MandalDropdownOption[] {
  return ASR_MANDALS.map((m) => ({
    value: m.nameEn,
    label: `${m.nameEn} (${m.nameTe})`,
    labelTe: `${m.nameTe} (${m.nameEn})`,
    division: m.division,
  }));
}

// Re-export Panchayats and Villages datasets and helpers
export {
  ASR_PANCHAYATS_BY_MANDAL,
  getOfficialPanchayats,
  TOTAL_ASR_PANCHAYATS_COUNT,
  getAllDistrictPanchayats,
  ASR_VILLAGES_BY_PANCHAYAT,
  getVillagesForPanchayat,
  getVillagesForMandal,
  getAllDistrictVillages,
  searchDistrictVillages,
  TOTAL_ASR_VILLAGES_COUNT,
};
export type { PanchayatItem, VillageInfo, VillageItem };
