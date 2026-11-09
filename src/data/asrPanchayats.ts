/**
 * Official Gram Panchayats (GPs) of Alluri Sitharama Raju (ASR) District, Andhra Pradesh
 * 
 * Authoritative complete list of 423 Gram Panchayats arranged mandal-by-mandal in order,
 * covering all 22 Mandals across the 3 Revenue Divisions:
 * 1. Paderu Division (11 Mandals - 244 GPs)
 * 2. Rampachodavaram Division (7 Mandals - 120 GPs)
 * 3. Chintoor Division (4 Mandals - 59 GPs)
 * 
 * Provides bilingual English and Telugu script for every Gram Panchayat.
 */

import type { RevenueDivision } from './asrMandals';

export interface PanchayatItem {
  id: string;
  nameEn: string;
  nameTe: string;
  mandalId: string;
  mandalNameEn: string;
  division: RevenueDivision;
  orderNumber: number;
}

export const ASR_PANCHAYATS_BY_MANDAL: Record<string, { nameEn: string; nameTe: string }[]> = {
  // =========================================================================
  // PADERU REVENUE DIVISION (11 Mandals)
  // =========================================================================

  // 1. Paderu Mandal (26 Gram Panchayats)
  paderu: [
    { nameEn: 'Ayinada', nameTe: 'ఆయినాడ' },
    { nameEn: 'Badimela', nameTe: 'బడిమెల' },
    { nameEn: 'Barisingi', nameTe: 'బారిసింగి' },
    { nameEn: 'Chinthalaveedhi', nameTe: 'చింతలవీధి' },
    { nameEn: 'Devapuram', nameTe: 'దేవపురం' },
    { nameEn: 'Dokuluru', nameTe: 'డోకులూరు' },
    { nameEn: 'Gabbangi', nameTe: 'గబ్బంగి' },
    { nameEn: 'Gondili', nameTe: 'గొందిలి' },
    { nameEn: 'Gonduvuru', nameTe: 'గొండువూరు' },
    { nameEn: 'Guttulaputtu', nameTe: 'గుట్టులపుట్టు' },
    { nameEn: 'Iradapalli', nameTe: 'ఇరడపల్లి' },
    { nameEn: 'Kadeli', nameTe: 'కడెలి' },
    { nameEn: 'Kinchuru', nameTe: 'కించూరు' },
    { nameEn: 'Kindangi', nameTe: 'కిందంగి' },
    { nameEn: 'Kujjali', nameTe: 'కుజ్జలి' },
    { nameEn: 'Lagisipalli', nameTe: 'లగిసిపల్లి' },
    { nameEn: 'Minumuluru', nameTe: 'మినుములూరు' },
    { nameEn: 'Modapalli', nameTe: 'మోడపల్లి' },
    { nameEn: 'Munchingiputtu', nameTe: 'ముంచింగిపుట్టు' },
    { nameEn: 'Paderu', nameTe: 'పాడేరు' },
    { nameEn: 'Salugu', nameTe: 'సలుగు' },
    { nameEn: 'Thumpada', nameTe: 'తుంపడ' },
    { nameEn: 'Vanajangi', nameTe: 'వనజంగి' },
    { nameEn: 'Vanthadapalli', nameTe: 'వంతడపల్లి' },
    { nameEn: 'Vanthalamamidi', nameTe: 'వంతలమామిడి' },
    { nameEn: 'Vanugupalli', nameTe: 'వనుగుపల్లి' },
  ],

  // 2. G. Madugula Mandal (17 Gram Panchayats)
  g_madugula: [
    { nameEn: 'Bheeram', nameTe: 'భీరం' },
    { nameEn: 'Boithala', nameTe: 'బోయితాల' },
    { nameEn: 'G. Madugula', nameTe: 'జి. మాడుగుల' },
    { nameEn: 'Gaduthuru', nameTe: 'గడుతురు' },
    { nameEn: 'Gemmeli', nameTe: 'గెమ్మెలి' },
    { nameEn: 'K. Kodapalli', nameTe: 'కె. కోడపల్లి' },
    { nameEn: 'Killamkota', nameTe: 'కిల్లంకోట' },
    { nameEn: 'Korapalli', nameTe: 'కొరపల్లి' },
    { nameEn: 'Kumbidisingi', nameTe: 'కుంబిడిసింగి' },
    { nameEn: 'Nurmathi', nameTe: 'నూర్మతి' },
    { nameEn: 'Palamamidi', nameTe: 'పాలమామిడి' },
    { nameEn: 'Pedalochili', nameTe: 'పెదలోచిలి' },
    { nameEn: 'Pedaluvvasingi', nameTe: 'పెదలువ్వసింగి' },
    { nameEn: 'Singarbha', nameTe: 'సింగర్భ' },
    { nameEn: 'Solabham', nameTe: 'సొలభం' },
    { nameEn: 'Vanjari', nameTe: 'వంజరి' },
    { nameEn: 'Vanthala', nameTe: 'వంతల' },
  ],

  // 3. Araku Valley Mandal (14 Gram Panchayats)
  araku_valley: [
    { nameEn: 'Baski', nameTe: 'బాస్కి' },
    { nameEn: 'Bondam', nameTe: 'బొండం' },
    { nameEn: 'Chinalabudu', nameTe: 'చినలబుడు' },
    { nameEn: 'Chompi', nameTe: 'చొంపి' },
    { nameEn: 'Gannela', nameTe: 'గన్నెల' },
    { nameEn: 'Iragai', nameTe: 'ఇరగై' },
    { nameEn: 'Kothabhalluguda', nameTe: 'కొత్తభల్లుగూడ' },
    { nameEn: 'Lotheru', nameTe: 'లోతేరు' },
    { nameEn: 'Madagada', nameTe: 'మడగడ' },
    { nameEn: 'Madala', nameTe: 'మదల' },
    { nameEn: 'Padmapuram', nameTe: 'పద్మాపురం' },
    { nameEn: 'Pedalabudu', nameTe: 'పెదలబుడు' },
    { nameEn: 'Siragam', nameTe: 'సిరగం' },
    { nameEn: 'Sunkarametta', nameTe: 'సుంకరమెట్ట' },
  ],

  // 4. Chintapalli Mandal (17 Gram Panchayats)
  chintapalli: [
    { nameEn: 'Annavaram', nameTe: 'అన్నవరం' },
    { nameEn: 'Balapam', nameTe: 'బలపం' },
    { nameEn: 'Bennavaram', nameTe: 'బెన్నవరం' },
    { nameEn: 'Chintapalli', nameTe: 'చింతపల్లి' },
    { nameEn: 'Chowdupalle', nameTe: 'చౌడుపల్లె' },
    { nameEn: 'Gondipakalu', nameTe: 'గొండిపాకాలు' },
    { nameEn: 'Kitumula', nameTe: 'కిటుముల' },
    { nameEn: 'Kommangi', nameTe: 'కొమ్మంగి' },
    { nameEn: 'Kothapalem', nameTe: 'కొత్తపాలెం' },
    { nameEn: 'Kudumsarai', nameTe: 'కుడుంసరై' },
    { nameEn: 'Lothugedda', nameTe: 'లోతుగెడ్డ' },
    { nameEn: 'Lovasingi', nameTe: 'లవసింగి' },
    { nameEn: 'Pedabarada', nameTe: 'పెదబారద' },
    { nameEn: 'Senivaram', nameTe: 'శనివారం' },
    { nameEn: 'Tajangi', nameTe: 'తాజంగి' },
    { nameEn: 'Tammingulavalsa', nameTe: 'తమ్మింగులవలస' },
    { nameEn: 'Yerrabommalu', nameTe: 'ఎర్రబొమ్మలు' },
  ],

  // 5. Dumbriguda Mandal (18 Gram Panchayats)
  dumbriguda: [
    { nameEn: 'Araku', nameTe: 'అరకు' },
    { nameEn: 'Arma', nameTe: 'అర్మ' },
    { nameEn: 'Gasaba', nameTe: 'గసబ' },
    { nameEn: 'Guntagennela', nameTe: 'గుంటగన్నెల' },
    { nameEn: 'Guntaseema', nameTe: 'గుంటసీమ' },
    { nameEn: 'Kandrum', nameTe: 'కండ్రుం' },
    { nameEn: 'Kinchumanda', nameTe: 'కించుమండ' },
    { nameEn: 'Kithalangi', nameTe: 'కితలాంగి' },
    { nameEn: 'Kollaputtu', nameTe: 'కొల్లాపుట్టు' },
    { nameEn: 'Korra', nameTe: 'కొర్ర' },
    { nameEn: 'Korrai', nameTe: 'కొర్రాయి' },
    { nameEn: 'Kuridi', nameTe: 'కురిడి' },
    { nameEn: 'Lygonda', nameTe: 'లైగొండ' },
    { nameEn: 'Pothangi', nameTe: 'పోతంగి' },
    { nameEn: 'Rangilisingi', nameTe: 'రంగిలిసింగి' },
    { nameEn: 'Sagara', nameTe: 'సాగర' },
    { nameEn: 'Sovva', nameTe: 'సొవ్వ' },
    { nameEn: 'Thutangi', nameTe: 'తుటాంగి' },
  ],

  // 6. Ananthagiri Mandal (24 Gram Panchayats)
  ananthagiri: [
    { nameEn: 'Ananthagiri', nameTe: 'అనంతగిరి' },
    { nameEn: 'Bheemapolu', nameTe: 'భీమపోలు' },
    { nameEn: 'Borra', nameTe: 'బొర్రా' },
    { nameEn: 'Chilakalagedda', nameTe: 'చిలకలగెడ్డ' },
    { nameEn: 'Garugubilli', nameTe: 'గరుగుబిల్లి' },
    { nameEn: 'Gumma', nameTe: 'గుమ్మ' },
    { nameEn: 'Gummakota', nameTe: 'గుమ్మకోట' },
    { nameEn: 'Jeenabadu', nameTe: 'జీనబాడు' },
    { nameEn: 'Kasipatnam', nameTe: 'కాశీపట్నం' },
    { nameEn: 'Kivarla', nameTe: 'కివర్ల' },
    { nameEn: 'Kondiba', nameTe: 'కొండిబ' },
    { nameEn: 'Kotturu', nameTe: 'కొత్తూరు' },
    { nameEn: 'Kunapuram', nameTe: 'కూనపురం' },
    { nameEn: 'Lungaparti', nameTe: 'లుంగపర్తి' },
    { nameEn: 'Narasimharajupuram', nameTe: 'నరసింహరాజుపురం' },
    { nameEn: 'Pedabidda', nameTe: 'పెదబిడ్డ' },
    { nameEn: 'Pedakota', nameTe: 'పెదకోట' },
    { nameEn: 'Pinakota', nameTe: 'పినకోట' },
    { nameEn: 'Pynampadu', nameTe: 'పైనాంపాడు' },
    { nameEn: 'Rampalle', nameTe: 'రంపల్లె' },
    { nameEn: 'Tokuru', nameTe: 'తోకూరు' },
    { nameEn: 'Valasi', nameTe: 'వలసి' },
    { nameEn: 'Vengada', nameTe: 'వెంగడ' },
    { nameEn: 'Yeguvasoba', nameTe: 'ఎగువసోబ' },
  ],

  // 7. Hukumpeta Mandal (33 Gram Panchayats)
  hukumpeta: [
    { nameEn: 'Addumanda', nameTe: 'అద్దుమండ' },
    { nameEn: 'Andiba', nameTe: 'అండిబ' },
    { nameEn: 'Bakuru', nameTe: 'బాకూరు' },
    { nameEn: 'Baramasi', nameTe: 'బారమాసి' },
    { nameEn: 'Bheemavaram', nameTe: 'భీమవరం' },
    { nameEn: 'Boddaputtu', nameTe: 'బొడ్డపుట్టు' },
    { nameEn: 'Boorja', nameTe: 'బూర్జ' },
    { nameEn: 'Cheekumaddula', nameTe: 'చీకుమద్దుల' },
    { nameEn: 'Durgam', nameTe: 'దుర్గం' },
    { nameEn: 'Gadikinchumanda', nameTe: 'గడికించుమండ' },
    { nameEn: 'Ganneruputtu', nameTe: 'గన్నేరుపుట్టు' },
    { nameEn: 'Gattum', nameTe: 'గట్టుం' },
    { nameEn: 'Guda', nameTe: 'గూడ' },
    { nameEn: 'Hukumpeta', nameTe: 'హుకుంపేట' },
    { nameEn: 'Jarrakonda', nameTe: 'జర్రకొండ' },
    { nameEn: 'Konthili', nameTe: 'కొంతిలి' },
    { nameEn: 'Kotnapalli', nameTe: 'కొత్నాపల్లి' },
    { nameEn: 'Matsyapuram', nameTe: 'మత్స్యపురం' },
    { nameEn: 'Mattam', nameTe: 'మట్టం' },
    { nameEn: 'Merakachinta', nameTe: 'మెరకచింత' },
    { nameEn: 'Mettujoru', nameTe: 'మెట్టుజోరు' },
    { nameEn: 'Muliaputtu', nameTe: 'ములియపుట్టు' },
    { nameEn: 'Olda', nameTe: 'ఓల్డ' },
    { nameEn: 'Pathakota', nameTe: 'పాతకోట' },
    { nameEn: 'Pattam', nameTe: 'పట్టం' },
    { nameEn: 'Rangaseela', nameTe: 'రంగశీల' },
    { nameEn: 'Rapa', nameTe: 'రాప' },
    { nameEn: 'Santhari', nameTe: 'సంతరి' },
    { nameEn: 'Sobakota', nameTe: 'శోభకోట' },
    { nameEn: 'Sukuru', nameTe: 'సుకురు' },
    { nameEn: 'Tadigiri', nameTe: 'తాడిగిరి' },
    { nameEn: 'Teegalavalasa', nameTe: 'తీగలవలస' },
    { nameEn: 'Thadiputtu', nameTe: 'తాడిపుట్టు' },
  ],

  // 8. Pedabayalu Mandal (23 Gram Panchayats)
  pedabayalu: [
    { nameEn: 'Adugula Puttu', nameTe: 'అడుగుల పుట్టు' },
    { nameEn: 'Aradakota', nameTe: 'అరదకోట' },
    { nameEn: 'Bondapalli', nameTe: 'బొండపల్లి' },
    { nameEn: 'Bongaram', nameTe: 'బొంగరం' },
    { nameEn: 'Galagonda', nameTe: 'గలగొండ' },
    { nameEn: 'Gamparai', nameTe: 'గంపరాయి' },
    { nameEn: 'Ginnelakota', nameTe: 'గిన్నెలకోట' },
    { nameEn: 'Gomangi', nameTe: 'గోమంగి' },
    { nameEn: 'Gullelu', nameTe: 'గుల్లెలు' },
    { nameEn: 'Injari', nameTe: 'ఇంజరి' },
    { nameEn: 'Jamiguda', nameTe: 'జామిగూడ' },
    { nameEn: 'Kimudupalli', nameTe: 'కిముడుపల్లి' },
    { nameEn: 'Koravangi', nameTe: 'కొరవంగి' },
    { nameEn: 'Kuntharla', nameTe: 'కుంతర్ల' },
    { nameEn: 'Laxmipeta', nameTe: 'లక్ష్మీపేట' },
    { nameEn: 'Lingeti', nameTe: 'లింగేటి' },
    { nameEn: 'Parreda', nameTe: 'పర్రెడ' },
    { nameEn: 'Pedakodapalli', nameTe: 'పెదకోడపల్లి' },
    { nameEn: 'Poipalle', nameTe: 'పోయిపల్లె' },
    { nameEn: 'Rudakota', nameTe: 'రుదకోట' },
    { nameEn: 'Seekari', nameTe: 'సీకరి' },
    { nameEn: 'Seethagunta', nameTe: 'సీతగుంట' },
    { nameEn: 'Vanabangi', nameTe: 'వనబంగి' },
  ],

  // 9. Munchingi Puttu Mandal (23 Gram Panchayats)
  munchingi_puttu: [
    { nameEn: 'Babusala', nameTe: 'బాబుసాల' },
    { nameEn: 'Bangarumetta', nameTe: 'బంగారుమెట్ట' },
    { nameEn: 'Barada', nameTe: 'బారద' },
    { nameEn: 'Bungaput', nameTe: 'బుంగపుట్' },
    { nameEn: 'Busiputtu', nameTe: 'బుసిపుట్టు' },
    { nameEn: 'Darela', nameTe: 'దారెలా' },
    { nameEn: 'Doddiputtu', nameTe: 'దొడ్డిపుట్టు' },
    { nameEn: 'Jarjula', nameTe: 'జార్జుల' },
    { nameEn: 'Jerrala', nameTe: 'జెర్రల' },
    { nameEn: 'Jolaputtu', nameTe: 'జోలాపుట్టు' },
    { nameEn: 'Karimukhiputtu', nameTe: 'కరిముఖిపుట్టు' },
    { nameEn: 'Kilagada', nameTe: 'కిలగడ' },
    { nameEn: 'Kinchaiput', nameTe: 'కించాయిపుట్' },
    { nameEn: 'Kumada', nameTe: 'కుమడ' },
    { nameEn: 'Laxmipuram', nameTe: 'లక్ష్మీపురం' },
    { nameEn: 'Makavaram', nameTe: 'మాకవరం' },
    { nameEn: 'Panasaput', nameTe: 'పనసపుట్' },
    { nameEn: 'Pedaguda', nameTe: 'పెదగూడ' },
    { nameEn: 'Rangabayalu', nameTe: 'రంగబయలు' },
    { nameEn: 'Sujanakota', nameTe: 'సుజనకోట' },
    { nameEn: 'Vanabhasingi', nameTe: 'వనభసింగి' },
    { nameEn: 'Vanugumma', nameTe: 'వనుగుమ్మ' },
    { nameEn: 'Yenugurai', nameTe: 'ఏనుగురాయి' },
  ],

  // 10. G.K. Veedhi Mandal (16 Gram Panchayats)
  gk_veedhi: [
    { nameEn: 'Cheedipalem', nameTe: 'చీడిపాలెం' },
    { nameEn: 'Damanapalle', nameTe: 'దమనపల్లె' },
    { nameEn: 'Darakonda', nameTe: 'ధారకొండ' },
    { nameEn: 'Devarapalli', nameTe: 'దేవరపల్లి' },
    { nameEn: 'Duppalawada', nameTe: 'దుప్పలవాడ' },
    { nameEn: 'G.K. Veedhi', nameTe: 'గూడెం కొత్త వీధి' },
    { nameEn: 'Gummerevulu', nameTe: 'గుమ్మెరేవులు' },
    { nameEn: 'Jerrila', nameTe: 'జెర్రిల' },
    { nameEn: 'Lakkavarapupeta', nameTe: 'లక్కవరపుపేట' },
    { nameEn: 'Mondigedda', nameTe: 'మొండిగెడ్డ' },
    { nameEn: 'Peddavalasa', nameTe: 'పెద్దవలస' },
    { nameEn: 'Rinthada', nameTe: 'రింతడ' },
    { nameEn: 'Sapparla', nameTe: 'సప్పర్ల' },
    { nameEn: 'Sileru', nameTe: 'సీలేరు' },
    { nameEn: 'Vanchula', nameTe: 'వంచులా' },
    { nameEn: 'Vegalapadu', nameTe: 'వెగలపాడు' },
  ],

  // 11. Koyyuru Mandal (33 Gram Panchayats)
  koyyuru: [
    { nameEn: 'Adakula', nameTe: 'అడకుల' },
    { nameEn: 'Anthada', nameTe: 'అంతడ' },
    { nameEn: 'Bakuluru', nameTe: 'బాకులూరు' },
    { nameEn: 'Balaram', nameTe: 'బలరాం' },
    { nameEn: 'Bandalova', nameTe: 'బండలోవ' },
    { nameEn: 'Bangarammapeta', nameTe: 'బంగారమ్మపేట' },
    { nameEn: 'Battapanukulu', nameTe: 'బట్టపానుకులు' },
    { nameEn: 'Budaralla', nameTe: 'బుదరాళ్ళ' },
    { nameEn: 'Budidha', nameTe: 'బూడిద' },
    { nameEn: 'Cheedipalem', nameTe: 'చీడిపాలెం' },
    { nameEn: 'Chittempadu', nameTe: 'చిట్టెంపాడు' },
    { nameEn: 'Downuru', nameTe: 'డౌనూరు' },
    { nameEn: 'Gadabapalem', nameTe: 'గడబపాలెం' },
    { nameEn: 'Golugonda Peta', nameTe: 'గొలుగొండ పేట' },
    { nameEn: 'Guntapalli', nameTe: 'గుంటపల్లి' },
    { nameEn: 'Kannampeta', nameTe: 'కన్నంపేట' },
    { nameEn: 'Kinchuru', nameTe: 'కించూరు' },
    { nameEn: 'Komaravolu', nameTe: 'కొమరవోలు' },
    { nameEn: 'Koyyuru', nameTe: 'కొయ్యూరు' },
    { nameEn: 'Mampa', nameTe: 'మాంప' },
    { nameEn: 'Marriwada', nameTe: 'మర్రివాడ' },
    { nameEn: 'Mulapeta', nameTe: 'మూలపేట' },
    { nameEn: 'Nadimpalem', nameTe: 'నదింపాలెం' },
    { nameEn: 'Nallagonda', nameTe: 'నల్లగొండ' },
    { nameEn: 'Paderu Colony', nameTe: 'పాడేరు కాలనీ' },
    { nameEn: 'Peda Boddepalle', nameTe: 'పెద బొద్దేపల్లె' },
    { nameEn: 'Rajendrapalayam', nameTe: 'రాజేంద్రపాలెం' },
    { nameEn: 'Revallu', nameTe: 'రేవళ్ళు' },
    { nameEn: 'Sarabhanna Palem', nameTe: 'శరభన్నపాలెం' },
    { nameEn: 'Singavaram', nameTe: 'సింగవరం' },
    { nameEn: 'Somanadhapalem', nameTe: 'సోమనాథపాలెం' },
    { nameEn: 'Sunkarametta', nameTe: 'సుంకరమెట్ట' },
    { nameEn: 'Yellavaram', nameTe: 'ఎల్లవరం' },
  ],

  // =========================================================================
  // RAMPACHODAVARAM REVENUE DIVISION (7 Mandals)
  // =========================================================================

  // 12. Rampachodavaram Mandal (19 Gram Panchayats)
  rampachodavaram: [
    { nameEn: 'Akuru', nameTe: 'ఆకూరు' },
    { nameEn: 'B. Velamalakota', nameTe: 'బి. వెలమలకోట' },
    { nameEn: 'Bandapalle', nameTe: 'బండపల్లె' },
    { nameEn: 'Beerampalle', nameTe: 'బీరంపల్లె' },
    { nameEn: 'Bolagonda', nameTe: 'బోలగొండ' },
    { nameEn: 'Busigudem', nameTe: 'బుసిగూడెం' },
    { nameEn: 'Foulkspeta', nameTe: 'ఫౌల్క్స్‌పేట' },
    { nameEn: 'I. Polavaram', nameTe: 'ఐ. పోలవరం' },
    { nameEn: 'Madicherla', nameTe: 'మడిచెర్ల' },
    { nameEn: 'Marrivada', nameTe: 'మర్రివాడ' },
    { nameEn: 'Musurumilli', nameTe: 'ముసురుమిల్లి' },
    { nameEn: 'Pedageddada', nameTe: 'పెదగెడ్డడ' },
    { nameEn: 'Rampa', nameTe: 'రంప' },
    { nameEn: 'Rampachodavaram', nameTe: 'రంపచోడవరం' },
    { nameEn: 'Tamarapalle', nameTe: 'తామరపల్లె' },
    { nameEn: 'Thativada', nameTe: 'తాటివాడ' },
    { nameEn: 'Utla', nameTe: 'ఉట్ల' },
    { nameEn: 'Vadapalle', nameTe: 'వాడపల్లె' },
    { nameEn: 'Vemulakonda', nameTe: 'వేములకొండ' },
  ],

  // 13. Maredumilli Mandal (12 Gram Panchayats)
  maredumilli: [
    { nameEn: 'Bodlanka', nameTe: 'బోడ్లంక' },
    { nameEn: 'Chatlawada', nameTe: 'చట్లవాడ' },
    { nameEn: 'Chavidikota', nameTe: 'చవిడికోట' },
    { nameEn: 'D.Ch. Palem', nameTe: 'డి.సిహెచ్. పాలెం' },
    { nameEn: 'D.V. Kota', nameTe: 'డి.వి. కోట' },
    { nameEn: 'G.M. Valasa', nameTe: 'జి.ఎం. వలస' },
    { nameEn: 'Kundada', nameTe: 'కుండడ' },
    { nameEn: 'Maredumilli', nameTe: 'మారేడుమిల్లి' },
    { nameEn: 'Pamuleru', nameTe: 'పాములేరు' },
    { nameEn: 'Pullangi', nameTe: 'పుల్లంగి' },
    { nameEn: 'Sunnampadu', nameTe: 'సున్నంపాడు' },
    { nameEn: 'Vetukuru', nameTe: 'వేటుకూరు' },
  ],

  // 14. Devipatnam Mandal (14 Gram Panchayats)
  devipatnam: [
    { nameEn: 'Ch. Ramanayyapeta', nameTe: 'చిన రామనయ్యపేట' },
    { nameEn: 'Choppakonda', nameTe: 'చొప్పకొండ' },
    { nameEn: 'Devaram', nameTe: 'దేవరం' },
    { nameEn: 'Devipatnam', nameTe: 'దేవీపట్నం' },
    { nameEn: 'Indukuru', nameTe: 'ఇందుకూరు' },
    { nameEn: 'Indukurupeta', nameTe: 'ఇందుకూరుపేట' },
    { nameEn: 'Kachuluru', nameTe: 'కచులూరు' },
    { nameEn: 'Kondamodalu', nameTe: 'కొండమొదలు' },
    { nameEn: 'Manturu', nameTe: 'మంటూరి' },
    { nameEn: 'Palem', nameTe: 'పాలెం' },
    { nameEn: 'Pamugandi', nameTe: 'పాముగండి' },
    { nameEn: 'Posammagandi', nameTe: 'పోశమ్మగండి' },
    { nameEn: 'Pudipalli', nameTe: 'పూడిపల్లి' },
    { nameEn: 'Toyyeru', nameTe: 'తొయ్యేరు' },
  ],

  // 15. Y. Ramavaram Mandal (17 Gram Panchayats)
  y_ramavaram: [
    { nameEn: 'Boddagandi', nameTe: 'బొడ్డగండి' },
    { nameEn: 'Chavulakota', nameTe: 'చావులకోట' },
    { nameEn: 'Chintalapudi', nameTe: 'చింతలపూడి' },
    { nameEn: 'Dalipatiguda', nameTe: 'దాలిపాటిగూడ' },
    { nameEn: 'Dalipadu', nameTe: 'దాలిపాడు' },
    { nameEn: 'Donkarai', nameTe: 'దొంకరాయి' },
    { nameEn: 'Gurthedu', nameTe: 'గుర్తేడు' },
    { nameEn: 'Kota', nameTe: 'కోట' },
    { nameEn: 'Mangampadu', nameTe: 'మంగంపాడు' },
    { nameEn: 'Marripalem', nameTe: 'మర్రిపాలెం' },
    { nameEn: 'Nimmalapalem', nameTe: 'నిమ్మలపాలెం' },
    { nameEn: 'P. Yerragonda', nameTe: 'పి. ఎర్రగొండ' },
    { nameEn: 'Pathakota', nameTe: 'పాతకోట' },
    { nameEn: 'Pedagondi', nameTe: 'పెదగొంది' },
    { nameEn: 'Rampa Yerrampalem', nameTe: 'రంప ఎర్రంపాలెం' },
    { nameEn: 'Y. Ramavaram', nameTe: 'వై. రామవరం' },
    { nameEn: 'Yerramareddipalem', nameTe: 'ఎర్రమరెడ్డిపాలెం' },
  ],

  // 16. Addateegala Mandal (22 Gram Panchayats)
  addateegala: [
    { nameEn: 'Addateegala', nameTe: 'అడ్డతీగల' },
    { nameEn: 'Bheemudupakalu', nameTe: 'భీముడుపాకాలు' },
    { nameEn: 'Bodlanka', nameTe: 'బోడ్లంక' },
    { nameEn: 'D. Bheemavaram', nameTe: 'డి. భీమవరం' },
    { nameEn: 'D. Ramavaram', nameTe: 'డి. రామవరం' },
    { nameEn: 'Dakodu', nameTe: 'దాకోడు' },
    { nameEn: 'Dhanyampalem', nameTe: 'ధాన్యంపాలెం' },
    { nameEn: 'Doramamidi', nameTe: 'దొరమామిడి' },
    { nameEn: 'Ducherthi', nameTe: 'దుచర్తి' },
    { nameEn: 'Gondolu', nameTe: 'గొండోలు' },
    { nameEn: 'Gontuvanipalem', nameTe: 'గొంతువానిపాలెం' },
    { nameEn: 'Kimmuru', nameTe: 'కిమ్మురు' },
    { nameEn: 'Konalova', nameTe: 'కోనలోవ' },
    { nameEn: 'Matlapadu', nameTe: 'మట్లపాడు' },
    { nameEn: 'Puligogulapadu', nameTe: 'పులిగోగులపాడు' },
    { nameEn: 'Rayapalli', nameTe: 'రాయపల్లి' },
    { nameEn: 'Somannapalem', nameTe: 'సోమన్నపాలెం' },
    { nameEn: 'Thimmapuram', nameTe: 'తిమ్మాపురం' },
    { nameEn: 'Thungamadugula', nameTe: 'తుంగమాడుగుల' },
    { nameEn: 'Veeravaram', nameTe: 'వీరవరం' },
    { nameEn: 'Vetamamidi', nameTe: 'వేటమామిడి' },
    { nameEn: 'Yellavaram', nameTe: 'ఎల్లవరం' },
  ],

  // 17. Gangavaram Mandal (17 Gram Panchayats)
  gangavaram: [
    { nameEn: 'Amudalabanda', nameTe: 'ఆముదాలబండ' },
    { nameEn: 'Bayyanapalli', nameTe: 'బయ్యనపల్లి' },
    { nameEn: 'Doramamidi', nameTe: 'దొరమామిడి' },
    { nameEn: 'Gangavaram', nameTe: 'గంగవరం' },
    { nameEn: 'Jaggampalem', nameTe: 'జగ్గంపాలెం' },
    { nameEn: 'Jiyyampalem', nameTe: 'జియ్యంపాలెం' },
    { nameEn: 'Kondapalli', nameTe: 'కొండపల్లి' },
    { nameEn: 'Kothada', nameTe: 'కొత్తడ' },
    { nameEn: 'Lakkonda', nameTe: 'లక్కొండ' },
    { nameEn: 'Marripalem', nameTe: 'మర్రిపాలెం' },
    { nameEn: 'Mohanapuram', nameTe: 'మోహనపురం' },
    { nameEn: 'Molleru', nameTe: 'మొల్లేరు' },
    { nameEn: 'Nellipudi', nameTe: 'నెల్లిపూడి' },
    { nameEn: 'Pandraprolu', nameTe: 'పండ్రప్రోలు' },
    { nameEn: 'Pidathamamidi', nameTe: 'పిడతమామిడి' },
    { nameEn: 'Surampalem', nameTe: 'సూరంపాలెం' },
    { nameEn: 'Zaderu', nameTe: 'జాదేరు' },
  ],

  // 18. Rajavommangi Mandal (19 Gram Panchayats)
  rajavommangi: [
    { nameEn: 'Aminabada', nameTe: 'అమీనాబాద' },
    { nameEn: 'Badadanampalli', nameTe: 'బదదనంపల్లి' },
    { nameEn: 'Cheruvukommupalem', nameTe: 'చెరువుకొమ్ముపాలెం' },
    { nameEn: 'Chikilinta', nameTe: 'చికిలింత' },
    { nameEn: 'Dusaripamu', nameTe: 'దూసరిపాము' },
    { nameEn: 'Gaduvakurthi', nameTe: 'గడువకుర్తి' },
    { nameEn: 'Jaddangi', nameTe: 'జద్దంగి' },
    { nameEn: 'Kindra', nameTe: 'కింద్ర' },
    { nameEn: 'Kirrabu', nameTe: 'కిర్రబు' },
    { nameEn: 'Kondapalli', nameTe: 'కొండపల్లి' },
    { nameEn: 'Labbarthi', nameTe: 'లబ్బర్తి' },
    { nameEn: 'Lagarayi', nameTe: 'లగరాయి' },
    { nameEn: 'Lododdi', nameTe: 'లోదొడ్డి' },
    { nameEn: 'Maredubaka', nameTe: 'మారేడుబాక' },
    { nameEn: 'Rajavommangi', nameTe: 'రాజవొమ్మంగి' },
    { nameEn: 'Sarabhavaram', nameTe: 'శరభవరం' },
    { nameEn: 'Thantikonda', nameTe: 'తాంతికొండ' },
    { nameEn: 'Vanchangi', nameTe: 'వంచంగి' },
    { nameEn: 'Vatangi', nameTe: 'వాతంగి' },
  ],

  // =========================================================================
  // CHINTOOR REVENUE DIVISION (4 Mandals)
  // =========================================================================

  // 19. Chintoor Mandal (18 Gram Panchayats)
  chintoor: [
    { nameEn: 'A.G.Koderu', nameTe: 'ఎ.జి.కోడేరు' },
    { nameEn: 'Chadalavada', nameTe: 'చదలవాడ' },
    { nameEn: 'Chatti', nameTe: 'చట్టి' },
    { nameEn: 'Chidumuru', nameTe: 'చిడుమూరు' },
    { nameEn: 'Chintoor', nameTe: 'చింతూరు' },
    { nameEn: 'Edugurallapalli', nameTe: 'ఏడుగురాళ్ళపల్లి' },
    { nameEn: 'Gangannametta', nameTe: 'గంగన్నమెట్ట' },
    { nameEn: 'Guduru', nameTe: 'గూడూరు' },
    { nameEn: 'Kalleru', nameTe: 'కల్లేరు' },
    { nameEn: 'Kothapalli', nameTe: 'కొత్తపల్లి' },
    { nameEn: 'Kummuru', nameTe: 'కుమ్మురు' },
    { nameEn: 'Lachigudem', nameTe: 'లచ్చిగూడెం' },
    { nameEn: 'Mothugudem', nameTe: 'మోతుగూడెం' },
    { nameEn: 'Mukkunuru', nameTe: 'ముక్కునూరు' },
    { nameEn: 'Pedda Seetanapalle', nameTe: 'పెద్ద సీతనపల్లె' },
    { nameEn: 'Pega', nameTe: 'పెగ' },
    { nameEn: 'Ramannapalem', nameTe: 'రామన్నపాలెం' },
    { nameEn: 'Tummala', nameTe: 'తుమ్మల' },
  ],

  // 20. Kunavaram Mandal (16 Gram Panchayats)
  kunavaram: [
    { nameEn: 'Abhicherla', nameTe: 'అభిచెర్ల' },
    { nameEn: 'Chinarkur', nameTe: 'చినార్కూరు' },
    { nameEn: 'Chuchirevulagudem', nameTe: 'చుచిరేవులగూడెం' },
    { nameEn: 'Jaggavaram', nameTe: 'జగ్గవరం' },
    { nameEn: 'Kachavaram', nameTe: 'కచవరం' },
    { nameEn: 'Karakagudem', nameTe: 'కారకగూడెం' },
    { nameEn: 'Kondrajupeta', nameTe: 'కొండ్రాజుపేట' },
    { nameEn: 'Kunavaram', nameTe: 'కూనవరం' },
    { nameEn: 'Kuturu', nameTe: 'కూతురు' },
    { nameEn: 'Lingapuram', nameTe: 'లింగాపురం' },
    { nameEn: 'Marrigudem', nameTe: 'మర్రిగూడెం' },
    { nameEn: 'Pedarkuru', nameTe: 'పెదార్కూరు' },
    { nameEn: 'Pochavaram', nameTe: 'పోచవరం' },
    { nameEn: 'Regulapadu', nameTe: 'రేగులపాడు' },
    { nameEn: 'Tekubaka', nameTe: 'టేకుబాక' },
    { nameEn: 'Venkatayapalem', nameTe: 'వెంకటాయపాలెం' },
  ],

  // 21. VR Puram Mandal (13 Gram Panchayats)
  vr_puram: [
    { nameEn: 'Chinnamattapalle', nameTe: 'చినమట్టపల్లె' },
    { nameEn: 'Jediguppa', nameTe: 'జేడిగుప్ప' },
    { nameEn: 'Kunduluru', nameTe: 'కుందులూరు' },
    { nameEn: 'Mulkanapally', nameTe: 'ముల్కనపల్లి' },
    { nameEn: 'Pedda Mattapalle', nameTe: 'పెద్ద మట్టపల్లె' },
    { nameEn: 'Rajupeta', nameTe: 'రాజుపేట' },
    { nameEn: 'Ramavaram', nameTe: 'రామవరం' },
    { nameEn: 'Rekapalli', nameTe: 'రేఖపల్లె' },
    { nameEn: 'Sriramagiri', nameTe: 'శ్రీరామగిరి' },
    { nameEn: 'Sunnambattu', nameTe: 'సున్నంబట్టు' },
    { nameEn: 'Thummileru', nameTe: 'తుమ్మిలేరు' },
    { nameEn: 'Vaddegudem', nameTe: 'వద్దెగూడెం' },
    { nameEn: 'Vararamachandrapuram', nameTe: 'వరరామచంద్రపురం' },
  ],

  // 22. Etapaka Mandal (12 Gram Panchayats)
  etapaka: [
    { nameEn: 'Chandrampalem', nameTe: 'చంద్రంపాలెం' },
    { nameEn: 'Etapaka', nameTe: 'ఎటపాక' },
    { nameEn: 'G. Kothagudem', nameTe: 'జి. కొత్తగూడెం' },
    { nameEn: 'Gowridevipeta', nameTe: 'గౌరీదేవిపేట' },
    { nameEn: 'Kolanugudem', nameTe: 'కొలనుగూడెం' },
    { nameEn: 'Krishnavaram', nameTe: 'కృష్ణవరం' },
    { nameEn: 'Lakshmidevipeta', nameTe: 'లక్ష్మీదేవిపేట' },
    { nameEn: 'Laxmipuram', nameTe: 'లక్ష్మీపురం' },
    { nameEn: 'Nellipaka', nameTe: 'నెల్లిపాక' },
    { nameEn: 'Tothapalli', nameTe: 'తోటపల్లి' },
    { nameEn: 'Vissapuram', nameTe: 'విస్సాపురం' },
    { nameEn: 'Yetapaka Proper', nameTe: 'ఎటపాక ప్రొపర్' },
  ],
};

/** Normalize key for lookup */
function normalizeMandalKey(key: string): string {
  if (!key) return '';
  const clean = key.trim().toLowerCase().replace(/[\.\s\-]+/g, '_').replace(/^_+|_+$/g, '');
  if (clean === 'paderu' || clean === 'పాడేరు') return 'paderu';
  if (clean === 'g_madugula' || clean === 'జి_మాడుగుల' || clean === 'gudem_madugula' || clean === 'g_madugula') return 'g_madugula';
  if (clean === 'araku' || clean === 'araku_valley' || clean === 'అరకు_లోయ' || clean === 'అరకు') return 'araku_valley';
  if (clean === 'chintapalli' || clean === 'chinthapalli' || clean === 'chintapalle' || clean === 'చింతపల్లి') return 'chintapalli';
  if (clean === 'dumbriguda' || clean === 'డుంబ్రిగుడ') return 'dumbriguda';
  if (clean === 'ananthagiri' || clean === 'అనంతగిరి') return 'ananthagiri';
  if (clean === 'hukumpeta' || clean === 'హుకుంపేట') return 'hukumpeta';
  if (clean === 'pedabayalu' || clean === 'peda_bayalu' || clean === 'పెదబయలు') return 'pedabayalu';
  if (clean === 'munchingi_puttu' || clean === 'munchingput' || clean === 'munchingiputtu' || clean === 'ముంచింగిపుట్టు') return 'munchingi_puttu';
  if (clean === 'gk_veedhi' || clean === 'g_k_veedhi' || clean === 'gudem_kotha_veedhi' || clean === 'గూడెం_కొత్త_వీధి') return 'gk_veedhi';
  if (clean === 'koyyuru' || clean === 'కొయ్యూరు') return 'koyyuru';
  if (clean === 'rampachodavaram' || clean === 'రంపచోడవరం') return 'rampachodavaram';
  if (clean === 'maredumilli' || clean === 'మారేడుమిల్లి') return 'maredumilli';
  if (clean === 'devipatnam' || clean === 'దేవీపట్నం') return 'devipatnam';
  if (clean === 'y_ramavaram' || clean === 'yeleswaram_ramavaram' || clean === 'వై_రామవరం') return 'y_ramavaram';
  if (clean === 'addateegala' || clean === 'అడ్డతీగల') return 'addateegala';
  if (clean === 'gangavaram' || clean === 'గంగవరం') return 'gangavaram';
  if (clean === 'rajavommangi' || clean === 'రాజవొమ్మంగి') return 'rajavommangi';
  if (clean === 'chintoor' || clean === 'chintur' || clean === 'చింతూరు') return 'chintoor';
  if (clean === 'kunavaram' || clean === 'కూనవరం') return 'kunavaram';
  if (clean === 'vr_puram' || clean === 'vararamachandrapuram' || clean === 'వరరామచంద్రపురం') return 'vr_puram';
  if (clean === 'etapaka' || clean === 'yetapaka' || clean === 'ఎటపాక') return 'etapaka';
  return clean;
}

/**
 * Retrieve the complete Gram Panchayats for a specific mandal in order.
 */
export function getOfficialPanchayats(mandalNameOrId: string): { nameEn: string; nameTe: string }[] {
  const normKey = normalizeMandalKey(mandalNameOrId);
  return ASR_PANCHAYATS_BY_MANDAL[normKey] || [];
}

/** Total official Gram Panchayats count across all 22 Mandals in ASR District */
export const TOTAL_ASR_PANCHAYATS_COUNT = Object.values(ASR_PANCHAYATS_BY_MANDAL).reduce(
  (sum, list) => sum + list.length,
  0
); // 423 Gram Panchayats

/**
 * Get all Gram Panchayats across the entire district flattened with full metadata.
 */
export function getAllDistrictPanchayats(): PanchayatItem[] {
  const items: PanchayatItem[] = [];

  const mandalMeta: Record<string, { nameEn: string; division: RevenueDivision }> = {
    paderu: { nameEn: 'Paderu', division: 'Paderu' },
    g_madugula: { nameEn: 'G. Madugula', division: 'Paderu' },
    araku_valley: { nameEn: 'Araku Valley', division: 'Paderu' },
    chintapalli: { nameEn: 'Chintapalli', division: 'Paderu' },
    dumbriguda: { nameEn: 'Dumbriguda', division: 'Paderu' },
    ananthagiri: { nameEn: 'Ananthagiri', division: 'Paderu' },
    hukumpeta: { nameEn: 'Hukumpeta', division: 'Paderu' },
    pedabayalu: { nameEn: 'Pedabayalu', division: 'Paderu' },
    munchingi_puttu: { nameEn: 'Munchingi Puttu', division: 'Paderu' },
    gk_veedhi: { nameEn: 'G.K. Veedhi', division: 'Paderu' },
    koyyuru: { nameEn: 'Koyyuru', division: 'Paderu' },
    rampachodavaram: { nameEn: 'Rampachodavaram', division: 'Rampachodavaram' },
    maredumilli: { nameEn: 'Maredumilli', division: 'Rampachodavaram' },
    devipatnam: { nameEn: 'Devipatnam', division: 'Rampachodavaram' },
    y_ramavaram: { nameEn: 'Y. Ramavaram', division: 'Rampachodavaram' },
    addateegala: { nameEn: 'Addateegala', division: 'Rampachodavaram' },
    gangavaram: { nameEn: 'Gangavaram', division: 'Rampachodavaram' },
    rajavommangi: { nameEn: 'Rajavommangi', division: 'Rampachodavaram' },
    chintoor: { nameEn: 'Chintoor', division: 'Chintoor' },
    kunavaram: { nameEn: 'Kunavaram', division: 'Chintoor' },
    vr_puram: { nameEn: 'VR Puram', division: 'Chintoor' },
    etapaka: { nameEn: 'Etapaka', division: 'Chintoor' },
  };

  Object.entries(ASR_PANCHAYATS_BY_MANDAL).forEach(([mId, gpList]) => {
    const meta = mandalMeta[mId] || { nameEn: mId, division: 'Paderu' as RevenueDivision };
    gpList.forEach((gp, idx) => {
      items.push({
        id: `${mId}-gp-${idx + 1}`,
        nameEn: gp.nameEn,
        nameTe: gp.nameTe,
        mandalId: mId,
        mandalNameEn: meta.nameEn,
        division: meta.division,
        orderNumber: idx + 1,
      });
    });
  });

  return items;
}
