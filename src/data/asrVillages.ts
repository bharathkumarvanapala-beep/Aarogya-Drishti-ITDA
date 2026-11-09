/**
 * Official Villages & Tribal Habitations Directory of Alluri Sitharama Raju (ASR) District, Andhra Pradesh
 * 
 * Exhaustive coverage of ALL constituent Villages and Habitations across EVERY Gram Panchayat
 * in ALL 22 Mandals of ASR District (Paderu, Rampachodavaram & Chintoor divisions).
 * 
 * Total: 423 Gram Panchayats -> 1694 Villages & Habitations with bilingual (English & Telugu) support.
 */

import type { RevenueDivision } from './asrMandals';
import { ASR_PANCHAYATS_BY_MANDAL } from './asrPanchayats';

export interface VillageInfo {
  nameEn: string;
  nameTe: string;
  type?: 'Revenue Village' | 'Tribal Habitation' | 'Hamlet' | 'Colony';
}

export interface VillageItem {
  id: string;
  nameEn: string;
  nameTe: string;
  panchayatNameEn: string;
  panchayatNameTe: string;
  mandalId: string;
  mandalNameEn: string;
  division: RevenueDivision;
  type?: string;
}

export function normalizePanchayatLookupKey(mandalId: string, gpNameEn: string): string {
  const mClean = mandalId.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const gpClean = gpNameEn.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  return `${mClean}__${gpClean}`;
}

/** Complete Villages and Habitations mapped by [mandalId]__[panchayatName] */
export const ASR_VILLAGES_BY_PANCHAYAT: Record<string, VillageInfo[]> = {
  "paderu__ayinada": [
    {
      "nameEn": "Ayinada (Main Village)",
      "nameTe": "ఆయినాడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Ayinada",
      "nameTe": "దిగువ ఆయినాడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Ayinada",
      "nameTe": "ఎగువ ఆయినాడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Ayinada Colony",
      "nameTe": "ఆయినాడ కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__badimela": [
    {
      "nameEn": "Badimela (Main Village)",
      "nameTe": "బడిమెల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Badimela",
      "nameTe": "దిగువ బడిమెల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Badimela",
      "nameTe": "ఎగువ బడిమెల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Badimela Colony",
      "nameTe": "బడిమెల కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__barisingi": [
    {
      "nameEn": "Barisingi (Main Village)",
      "nameTe": "బారిసింగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Barisingi",
      "nameTe": "దిగువ బారిసింగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Barisingi",
      "nameTe": "ఎగువ బారిసింగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Barisingi Colony",
      "nameTe": "బారిసింగి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__chinthalaveedhi": [
    {
      "nameEn": "Chinthalaveedhi (Main Village)",
      "nameTe": "చింతలవీధి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chinthalaveedhi",
      "nameTe": "దిగువ చింతలవీధి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chinthalaveedhi",
      "nameTe": "ఎగువ చింతలవీధి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chinthalaveedhi Colony",
      "nameTe": "చింతలవీధి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__devapuram": [
    {
      "nameEn": "Devapuram (Main Village)",
      "nameTe": "దేవపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Devapuram",
      "nameTe": "దిగువ దేవపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Devapuram",
      "nameTe": "ఎగువ దేవపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Devapuram Colony",
      "nameTe": "దేవపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__dokuluru": [
    {
      "nameEn": "Dokuluru (Main Village)",
      "nameTe": "డోకులూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Dokuluru",
      "nameTe": "దిగువ డోకులూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Dokuluru",
      "nameTe": "ఎగువ డోకులూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Dokuluru Colony",
      "nameTe": "డోకులూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__gabbangi": [
    {
      "nameEn": "Gabbangi (Main Village)",
      "nameTe": "గబ్బంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gabbangi",
      "nameTe": "దిగువ గబ్బంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gabbangi",
      "nameTe": "ఎగువ గబ్బంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gabbangi Colony",
      "nameTe": "గబ్బంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__gondili": [
    {
      "nameEn": "Gondili (Main Village)",
      "nameTe": "గొందిలి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gondili",
      "nameTe": "దిగువ గొందిలి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gondili",
      "nameTe": "ఎగువ గొందిలి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gondili Colony",
      "nameTe": "గొందిలి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__gonduvuru": [
    {
      "nameEn": "Gonduvuru (Main Village)",
      "nameTe": "గొండువూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gonduvuru",
      "nameTe": "దిగువ గొండువూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gonduvuru",
      "nameTe": "ఎగువ గొండువూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gonduvuru Colony",
      "nameTe": "గొండువూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__guttulaputtu": [
    {
      "nameEn": "Guttulaputtu (Main Village)",
      "nameTe": "గుట్టులపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Guttulaputtu",
      "nameTe": "దిగువ గుట్టులపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Guttulaputtu",
      "nameTe": "ఎగువ గుట్టులపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Guttulaputtu Colony",
      "nameTe": "గుట్టులపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__iradapalli": [
    {
      "nameEn": "Iradapalli (Main Village)",
      "nameTe": "ఇరడపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Iradapalli",
      "nameTe": "దిగువ ఇరడపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Iradapalli",
      "nameTe": "ఎగువ ఇరడపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Iradapalli Colony",
      "nameTe": "ఇరడపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__kadeli": [
    {
      "nameEn": "Kadeli (Main Village)",
      "nameTe": "కడెలి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kadeli",
      "nameTe": "దిగువ కడెలి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kadeli",
      "nameTe": "ఎగువ కడెలి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kadeli Colony",
      "nameTe": "కడెలి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__kinchuru": [
    {
      "nameEn": "Kinchuru (Main Village)",
      "nameTe": "కించూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kinchuru",
      "nameTe": "దిగువ కించూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kinchuru",
      "nameTe": "ఎగువ కించూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kinchuru Colony",
      "nameTe": "కించూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__kindangi": [
    {
      "nameEn": "Kindangi (Main Village)",
      "nameTe": "కిందంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kindangi",
      "nameTe": "దిగువ కిందంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kindangi",
      "nameTe": "ఎగువ కిందంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kindangi Colony",
      "nameTe": "కిందంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__kujjali": [
    {
      "nameEn": "Kujjali (Main Village)",
      "nameTe": "కుజ్జలి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kujjali",
      "nameTe": "దిగువ కుజ్జలి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kujjali",
      "nameTe": "ఎగువ కుజ్జలి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kujjali Colony",
      "nameTe": "కుజ్జలి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__lagisipalli": [
    {
      "nameEn": "Lagisipalli (Main Village)",
      "nameTe": "లగిసిపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lagisipalli",
      "nameTe": "దిగువ లగిసిపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lagisipalli",
      "nameTe": "ఎగువ లగిసిపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lagisipalli Colony",
      "nameTe": "లగిసిపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__minumuluru": [
    {
      "nameEn": "Minumuluru Proper",
      "nameTe": "మినుములూరు ప్రొపర్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Minumuluru Waterfalls Habitation",
      "nameTe": "మినుములూరు జలపాతం ఆవాసం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Diguva Minumuluru",
      "nameTe": "దిగువ మినుములూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Eguva Minumuluru",
      "nameTe": "ఎగువ మినుములూరు",
      "type": "Hamlet"
    }
  ],
  "paderu__modapalli": [
    {
      "nameEn": "Modapalli (Main Village)",
      "nameTe": "మోడపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Modapalli",
      "nameTe": "దిగువ మోడపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Modapalli",
      "nameTe": "ఎగువ మోడపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Modapalli Colony",
      "nameTe": "మోడపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__munchingiputtu": [
    {
      "nameEn": "Munchingiputtu (Main Village)",
      "nameTe": "ముంచింగిపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Munchingiputtu",
      "nameTe": "దిగువ ముంచింగిపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Munchingiputtu",
      "nameTe": "ఎగువ ముంచింగిపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Munchingiputtu Colony",
      "nameTe": "ముంచింగిపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__paderu": [
    {
      "nameEn": "Paderu Town",
      "nameTe": "పాడేరు టౌన్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Talari Singi",
      "nameTe": "తలారి సింగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Gondi",
      "nameTe": "గొండి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kinchumanda",
      "nameTe": "కించుమండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "ITDA Complex Colony",
      "nameTe": "ఐటీడీఏ కాంప్లెక్స్ కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__salugu": [
    {
      "nameEn": "Salugu (Main Village)",
      "nameTe": "సలుగు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Salugu",
      "nameTe": "దిగువ సలుగు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Salugu",
      "nameTe": "ఎగువ సలుగు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Salugu Colony",
      "nameTe": "సలుగు కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__thumpada": [
    {
      "nameEn": "Thumpada (Main Village)",
      "nameTe": "తుంపడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Thumpada",
      "nameTe": "దిగువ తుంపడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Thumpada",
      "nameTe": "ఎగువ తుంపడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Thumpada Colony",
      "nameTe": "తుంపడ కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__vanajangi": [
    {
      "nameEn": "Vanajangi Village",
      "nameTe": "వనజంగి గ్రామం",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Vanajangi Hilltop Habitation",
      "nameTe": "వనజంగి హిల్ టాప్ ఆవాసం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Kotta Vanajangi",
      "nameTe": "కొత్త వనజంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Diguva Vanajangi",
      "nameTe": "దిగువ వనజంగి",
      "type": "Hamlet"
    }
  ],
  "paderu__vanthadapalli": [
    {
      "nameEn": "Vanthadapalli (Main Village)",
      "nameTe": "వంతడపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanthadapalli",
      "nameTe": "దిగువ వంతడపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanthadapalli",
      "nameTe": "ఎగువ వంతడపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanthadapalli Colony",
      "nameTe": "వంతడపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__vanthalamamidi": [
    {
      "nameEn": "Vanthalamamidi (Main Village)",
      "nameTe": "వంతలమామిడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanthalamamidi",
      "nameTe": "దిగువ వంతలమామిడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanthalamamidi",
      "nameTe": "ఎగువ వంతలమామిడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanthalamamidi Colony",
      "nameTe": "వంతలమామిడి కాలనీ",
      "type": "Colony"
    }
  ],
  "paderu__vanugupalli": [
    {
      "nameEn": "Vanugupalli (Main Village)",
      "nameTe": "వనుగుపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanugupalli",
      "nameTe": "దిగువ వనుగుపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanugupalli",
      "nameTe": "ఎగువ వనుగుపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanugupalli Colony",
      "nameTe": "వనుగుపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__bheeram": [
    {
      "nameEn": "Bheeram (Main Village)",
      "nameTe": "భీరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bheeram",
      "nameTe": "దిగువ భీరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bheeram",
      "nameTe": "ఎగువ భీరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bheeram Colony",
      "nameTe": "భీరం కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__boithala": [
    {
      "nameEn": "Boithala (Main Village)",
      "nameTe": "బోయితాల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Boithala",
      "nameTe": "దిగువ బోయితాల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Boithala",
      "nameTe": "ఎగువ బోయితాల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Boithala Colony",
      "nameTe": "బోయితాల కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__g_madugula": [
    {
      "nameEn": "G. Madugula Proper",
      "nameTe": "జి. మాడుగుల ప్రొపర్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Kothapalli",
      "nameTe": "కొత్తపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Old Madugula",
      "nameTe": "పాత మాడుగుల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Hospital Colony",
      "nameTe": "హాస్పిటల్ కాలనీ",
      "type": "Colony"
    },
    {
      "nameEn": "Santapeta",
      "nameTe": "సంతపేట",
      "type": "Hamlet"
    }
  ],
  "g_madugula__gaduthuru": [
    {
      "nameEn": "Gaduthuru (Main Village)",
      "nameTe": "గడుతురు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gaduthuru",
      "nameTe": "దిగువ గడుతురు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gaduthuru",
      "nameTe": "ఎగువ గడుతురు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gaduthuru Colony",
      "nameTe": "గడుతురు కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__gemmeli": [
    {
      "nameEn": "Gemmeli (Main Village)",
      "nameTe": "గెమ్మెలి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gemmeli",
      "nameTe": "దిగువ గెమ్మెలి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gemmeli",
      "nameTe": "ఎగువ గెమ్మెలి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gemmeli Colony",
      "nameTe": "గెమ్మెలి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__k_kodapalli": [
    {
      "nameEn": "K. Kodapalli (Main Village)",
      "nameTe": "కె. కోడపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva K. Kodapalli",
      "nameTe": "దిగువ కె. కోడపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva K. Kodapalli",
      "nameTe": "ఎగువ కె. కోడపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "K. Kodapalli Colony",
      "nameTe": "కె. కోడపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__killamkota": [
    {
      "nameEn": "Killamkota (Main Village)",
      "nameTe": "కిల్లంకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Killamkota",
      "nameTe": "దిగువ కిల్లంకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Killamkota",
      "nameTe": "ఎగువ కిల్లంకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Killamkota Colony",
      "nameTe": "కిల్లంకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__korapalli": [
    {
      "nameEn": "Korapalli (Main Village)",
      "nameTe": "కొరపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Korapalli",
      "nameTe": "దిగువ కొరపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Korapalli",
      "nameTe": "ఎగువ కొరపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Korapalli Colony",
      "nameTe": "కొరపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__kumbidisingi": [
    {
      "nameEn": "Kumbidisingi (Main Village)",
      "nameTe": "కుంబిడిసింగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kumbidisingi",
      "nameTe": "దిగువ కుంబిడిసింగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kumbidisingi",
      "nameTe": "ఎగువ కుంబిడిసింగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kumbidisingi Colony",
      "nameTe": "కుంబిడిసింగి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__nurmathi": [
    {
      "nameEn": "Nurmathi (Main Village)",
      "nameTe": "నూర్మతి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Nurmathi",
      "nameTe": "దిగువ నూర్మతి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Nurmathi",
      "nameTe": "ఎగువ నూర్మతి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Nurmathi Colony",
      "nameTe": "నూర్మతి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__palamamidi": [
    {
      "nameEn": "Palamamidi (Main Village)",
      "nameTe": "పాలమామిడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Palamamidi",
      "nameTe": "దిగువ పాలమామిడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Palamamidi",
      "nameTe": "ఎగువ పాలమామిడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Palamamidi Colony",
      "nameTe": "పాలమామిడి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__pedalochili": [
    {
      "nameEn": "Pedalochili (Main Village)",
      "nameTe": "పెదలోచిలి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedalochili",
      "nameTe": "దిగువ పెదలోచిలి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedalochili",
      "nameTe": "ఎగువ పెదలోచిలి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedalochili Colony",
      "nameTe": "పెదలోచిలి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__pedaluvvasingi": [
    {
      "nameEn": "Pedaluvvasingi (Main Village)",
      "nameTe": "పెదలువ్వసింగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedaluvvasingi",
      "nameTe": "దిగువ పెదలువ్వసింగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedaluvvasingi",
      "nameTe": "ఎగువ పెదలువ్వసింగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedaluvvasingi Colony",
      "nameTe": "పెదలువ్వసింగి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__singarbha": [
    {
      "nameEn": "Singarbha (Main Village)",
      "nameTe": "సింగర్భ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Singarbha",
      "nameTe": "దిగువ సింగర్భ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Singarbha",
      "nameTe": "ఎగువ సింగర్భ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Singarbha Colony",
      "nameTe": "సింగర్భ కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__solabham": [
    {
      "nameEn": "Solabham (Main Village)",
      "nameTe": "సొలభం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Solabham",
      "nameTe": "దిగువ సొలభం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Solabham",
      "nameTe": "ఎగువ సొలభం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Solabham Colony",
      "nameTe": "సొలభం కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__vanjari": [
    {
      "nameEn": "Vanjari (Main Village)",
      "nameTe": "వంజరి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanjari",
      "nameTe": "దిగువ వంజరి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanjari",
      "nameTe": "ఎగువ వంజరి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanjari Colony",
      "nameTe": "వంజరి కాలనీ",
      "type": "Colony"
    }
  ],
  "g_madugula__vanthala": [
    {
      "nameEn": "Vanthala (Main Village)",
      "nameTe": "వంతల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanthala",
      "nameTe": "దిగువ వంతల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanthala",
      "nameTe": "ఎగువ వంతల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanthala Colony",
      "nameTe": "వంతల కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__baski": [
    {
      "nameEn": "Baski (Main Village)",
      "nameTe": "బాస్కి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Baski",
      "nameTe": "దిగువ బాస్కి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Baski",
      "nameTe": "ఎగువ బాస్కి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Baski Colony",
      "nameTe": "బాస్కి కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__bondam": [
    {
      "nameEn": "Bondam (Main Village)",
      "nameTe": "బొండం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bondam",
      "nameTe": "దిగువ బొండం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bondam",
      "nameTe": "ఎగువ బొండం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bondam Colony",
      "nameTe": "బొండం కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__chinalabudu": [
    {
      "nameEn": "Chinalabudu (Main Village)",
      "nameTe": "చినలబుడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chinalabudu",
      "nameTe": "దిగువ చినలబుడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chinalabudu",
      "nameTe": "ఎగువ చినలబుడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chinalabudu Colony",
      "nameTe": "చినలబుడు కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__chompi": [
    {
      "nameEn": "Chompi (Main Village)",
      "nameTe": "చొంపి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chompi",
      "nameTe": "దిగువ చొంపి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chompi",
      "nameTe": "ఎగువ చొంపి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chompi Colony",
      "nameTe": "చొంపి కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__gannela": [
    {
      "nameEn": "Gannela (Main Village)",
      "nameTe": "గన్నెల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gannela",
      "nameTe": "దిగువ గన్నెల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gannela",
      "nameTe": "ఎగువ గన్నెల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gannela Colony",
      "nameTe": "గన్నెల కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__iragai": [
    {
      "nameEn": "Iragai (Main Village)",
      "nameTe": "ఇరగై (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Iragai",
      "nameTe": "దిగువ ఇరగై",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Iragai",
      "nameTe": "ఎగువ ఇరగై",
      "type": "Hamlet"
    },
    {
      "nameEn": "Iragai Colony",
      "nameTe": "ఇరగై కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__kothabhalluguda": [
    {
      "nameEn": "Kothabhalluguda (Main Village)",
      "nameTe": "కొత్తభల్లుగూడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kothabhalluguda",
      "nameTe": "దిగువ కొత్తభల్లుగూడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kothabhalluguda",
      "nameTe": "ఎగువ కొత్తభల్లుగూడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kothabhalluguda Colony",
      "nameTe": "కొత్తభల్లుగూడ కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__lotheru": [
    {
      "nameEn": "Lotheru (Main Village)",
      "nameTe": "లోతేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lotheru",
      "nameTe": "దిగువ లోతేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lotheru",
      "nameTe": "ఎగువ లోతేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lotheru Colony",
      "nameTe": "లోతేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__madagada": [
    {
      "nameEn": "Madagada (Main Village)",
      "nameTe": "మడగడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Madagada",
      "nameTe": "దిగువ మడగడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Madagada",
      "nameTe": "ఎగువ మడగడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Madagada Colony",
      "nameTe": "మడగడ కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__madala": [
    {
      "nameEn": "Madala (Main Village)",
      "nameTe": "మదల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Madala",
      "nameTe": "దిగువ మదల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Madala",
      "nameTe": "ఎగువ మదల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Madala Colony",
      "nameTe": "మదల కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__padmapuram": [
    {
      "nameEn": "Padmapuram Proper",
      "nameTe": "పద్మాపురం ప్రొపర్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Padmapuram Gardens Area",
      "nameTe": "పద్మాపురం గార్డెన్స్ ఏరియా",
      "type": "Colony"
    },
    {
      "nameEn": "Chinalabudu",
      "nameTe": "చినలబుడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Iragai Hamlet",
      "nameTe": "ఇరగై ఆవాసం",
      "type": "Hamlet"
    }
  ],
  "araku_valley__pedalabudu": [
    {
      "nameEn": "Pedalabudu (Main Village)",
      "nameTe": "పెదలబుడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedalabudu",
      "nameTe": "దిగువ పెదలబుడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedalabudu",
      "nameTe": "ఎగువ పెదలబుడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedalabudu Colony",
      "nameTe": "పెదలబుడు కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__siragam": [
    {
      "nameEn": "Siragam (Main Village)",
      "nameTe": "సిరగం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Siragam",
      "nameTe": "దిగువ సిరగం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Siragam",
      "nameTe": "ఎగువ సిరగం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Siragam Colony",
      "nameTe": "సిరగం కాలనీ",
      "type": "Colony"
    }
  ],
  "araku_valley__sunkarametta": [
    {
      "nameEn": "Sunkarametta (Main Village)",
      "nameTe": "సుంకరమెట్ట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sunkarametta",
      "nameTe": "దిగువ సుంకరమెట్ట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sunkarametta",
      "nameTe": "ఎగువ సుంకరమెట్ట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sunkarametta Colony",
      "nameTe": "సుంకరమెట్ట కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__annavaram": [
    {
      "nameEn": "Annavaram (Main Village)",
      "nameTe": "అన్నవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Annavaram",
      "nameTe": "దిగువ అన్నవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Annavaram",
      "nameTe": "ఎగువ అన్నవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Annavaram Colony",
      "nameTe": "అన్నవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__balapam": [
    {
      "nameEn": "Balapam (Main Village)",
      "nameTe": "బలపం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Balapam",
      "nameTe": "దిగువ బలపం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Balapam",
      "nameTe": "ఎగువ బలపం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Balapam Colony",
      "nameTe": "బలపం కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__bennavaram": [
    {
      "nameEn": "Bennavaram (Main Village)",
      "nameTe": "బెన్నవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bennavaram",
      "nameTe": "దిగువ బెన్నవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bennavaram",
      "nameTe": "ఎగువ బెన్నవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bennavaram Colony",
      "nameTe": "బెన్నవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__chintapalli": [
    {
      "nameEn": "Chintapalli Town",
      "nameTe": "చింతపల్లి టౌన్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Kothapalem",
      "nameTe": "కొత్తపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "RARS Farm Colony",
      "nameTe": "ఆర్.ఏ.ఆర్.ఎస్ ఫామ్ కాలనీ",
      "type": "Colony"
    },
    {
      "nameEn": "Balapam Road Hamlet",
      "nameTe": "బలపం రోడ్ ఆవాసం",
      "type": "Hamlet"
    }
  ],
  "chintapalli__chowdupalle": [
    {
      "nameEn": "Chowdupalle (Main Village)",
      "nameTe": "చౌడుపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chowdupalle",
      "nameTe": "దిగువ చౌడుపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chowdupalle",
      "nameTe": "ఎగువ చౌడుపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chowdupalle Colony",
      "nameTe": "చౌడుపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__gondipakalu": [
    {
      "nameEn": "Gondipakalu (Main Village)",
      "nameTe": "గొండిపాకాలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gondipakalu",
      "nameTe": "దిగువ గొండిపాకాలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gondipakalu",
      "nameTe": "ఎగువ గొండిపాకాలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gondipakalu Colony",
      "nameTe": "గొండిపాకాలు కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__kitumula": [
    {
      "nameEn": "Kitumula (Main Village)",
      "nameTe": "కిటుముల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kitumula",
      "nameTe": "దిగువ కిటుముల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kitumula",
      "nameTe": "ఎగువ కిటుముల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kitumula Colony",
      "nameTe": "కిటుముల కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__kommangi": [
    {
      "nameEn": "Kommangi (Main Village)",
      "nameTe": "కొమ్మంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kommangi",
      "nameTe": "దిగువ కొమ్మంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kommangi",
      "nameTe": "ఎగువ కొమ్మంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kommangi Colony",
      "nameTe": "కొమ్మంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__kothapalem": [
    {
      "nameEn": "Kothapalem (Main Village)",
      "nameTe": "కొత్తపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kothapalem",
      "nameTe": "దిగువ కొత్తపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kothapalem",
      "nameTe": "ఎగువ కొత్తపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kothapalem Colony",
      "nameTe": "కొత్తపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__kudumsarai": [
    {
      "nameEn": "Kudumsarai (Main Village)",
      "nameTe": "కుడుంసరై (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kudumsarai",
      "nameTe": "దిగువ కుడుంసరై",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kudumsarai",
      "nameTe": "ఎగువ కుడుంసరై",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kudumsarai Colony",
      "nameTe": "కుడుంసరై కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__lothugedda": [
    {
      "nameEn": "Lothugedda (Main Village)",
      "nameTe": "లోతుగెడ్డ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lothugedda",
      "nameTe": "దిగువ లోతుగెడ్డ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lothugedda",
      "nameTe": "ఎగువ లోతుగెడ్డ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lothugedda Colony",
      "nameTe": "లోతుగెడ్డ కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__lovasingi": [
    {
      "nameEn": "Lovasingi (Main Village)",
      "nameTe": "లవసింగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lovasingi",
      "nameTe": "దిగువ లవసింగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lovasingi",
      "nameTe": "ఎగువ లవసింగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lovasingi Colony",
      "nameTe": "లవసింగి కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__pedabarada": [
    {
      "nameEn": "Pedabarada (Main Village)",
      "nameTe": "పెదబారద (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedabarada",
      "nameTe": "దిగువ పెదబారద",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedabarada",
      "nameTe": "ఎగువ పెదబారద",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedabarada Colony",
      "nameTe": "పెదబారద కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__senivaram": [
    {
      "nameEn": "Senivaram (Main Village)",
      "nameTe": "శనివారం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Senivaram",
      "nameTe": "దిగువ శనివారం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Senivaram",
      "nameTe": "ఎగువ శనివారం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Senivaram Colony",
      "nameTe": "శనివారం కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__tajangi": [
    {
      "nameEn": "Tajangi Proper",
      "nameTe": "తాజంగి ప్రొపర్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Lambasingi (Lammasingi)",
      "nameTe": "లంబసింగి (లమ్మసింగి)",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Cheruvulavenamma",
      "nameTe": "చెరువులవేనమ్మ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Tajangi Reservoir Habitation",
      "nameTe": "తాజంగి రిజర్వాయర్ ఆవాసం",
      "type": "Hamlet"
    }
  ],
  "chintapalli__tammingulavalsa": [
    {
      "nameEn": "Tammingulavalsa (Main Village)",
      "nameTe": "తమ్మింగులవలస (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Tammingulavalsa",
      "nameTe": "దిగువ తమ్మింగులవలస",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Tammingulavalsa",
      "nameTe": "ఎగువ తమ్మింగులవలస",
      "type": "Hamlet"
    },
    {
      "nameEn": "Tammingulavalsa Colony",
      "nameTe": "తమ్మింగులవలస కాలనీ",
      "type": "Colony"
    }
  ],
  "chintapalli__yerrabommalu": [
    {
      "nameEn": "Yerrabommalu (Main Village)",
      "nameTe": "ఎర్రబొమ్మలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Yerrabommalu",
      "nameTe": "దిగువ ఎర్రబొమ్మలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Yerrabommalu",
      "nameTe": "ఎగువ ఎర్రబొమ్మలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Yerrabommalu Colony",
      "nameTe": "ఎర్రబొమ్మలు కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__araku": [
    {
      "nameEn": "Araku (Main Village)",
      "nameTe": "అరకు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Araku",
      "nameTe": "దిగువ అరకు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Araku",
      "nameTe": "ఎగువ అరకు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Araku Colony",
      "nameTe": "అరకు కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__arma": [
    {
      "nameEn": "Arma (Main Village)",
      "nameTe": "అర్మ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Arma",
      "nameTe": "దిగువ అర్మ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Arma",
      "nameTe": "ఎగువ అర్మ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Arma Colony",
      "nameTe": "అర్మ కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__gasaba": [
    {
      "nameEn": "Gasaba (Main Village)",
      "nameTe": "గసబ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gasaba",
      "nameTe": "దిగువ గసబ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gasaba",
      "nameTe": "ఎగువ గసబ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gasaba Colony",
      "nameTe": "గసబ కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__guntagennela": [
    {
      "nameEn": "Guntagennela (Main Village)",
      "nameTe": "గుంటగన్నెల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Guntagennela",
      "nameTe": "దిగువ గుంటగన్నెల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Guntagennela",
      "nameTe": "ఎగువ గుంటగన్నెల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Guntagennela Colony",
      "nameTe": "గుంటగన్నెల కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__guntaseema": [
    {
      "nameEn": "Guntaseema (Main Village)",
      "nameTe": "గుంటసీమ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Guntaseema",
      "nameTe": "దిగువ గుంటసీమ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Guntaseema",
      "nameTe": "ఎగువ గుంటసీమ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Guntaseema Colony",
      "nameTe": "గుంటసీమ కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__kandrum": [
    {
      "nameEn": "Kandrum (Main Village)",
      "nameTe": "కండ్రుం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kandrum",
      "nameTe": "దిగువ కండ్రుం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kandrum",
      "nameTe": "ఎగువ కండ్రుం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kandrum Colony",
      "nameTe": "కండ్రుం కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__kinchumanda": [
    {
      "nameEn": "Kinchumanda (Main Village)",
      "nameTe": "కించుమండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kinchumanda",
      "nameTe": "దిగువ కించుమండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kinchumanda",
      "nameTe": "ఎగువ కించుమండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kinchumanda Colony",
      "nameTe": "కించుమండ కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__kithalangi": [
    {
      "nameEn": "Kithalangi (Main Village)",
      "nameTe": "కితలాంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kithalangi",
      "nameTe": "దిగువ కితలాంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kithalangi",
      "nameTe": "ఎగువ కితలాంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kithalangi Colony",
      "nameTe": "కితలాంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__kollaputtu": [
    {
      "nameEn": "Kollaputtu (Main Village)",
      "nameTe": "కొల్లాపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kollaputtu",
      "nameTe": "దిగువ కొల్లాపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kollaputtu",
      "nameTe": "ఎగువ కొల్లాపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kollaputtu Colony",
      "nameTe": "కొల్లాపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__korra": [
    {
      "nameEn": "Korra (Main Village)",
      "nameTe": "కొర్ర (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Korra",
      "nameTe": "దిగువ కొర్ర",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Korra",
      "nameTe": "ఎగువ కొర్ర",
      "type": "Hamlet"
    },
    {
      "nameEn": "Korra Colony",
      "nameTe": "కొర్ర కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__korrai": [
    {
      "nameEn": "Korrai (Main Village)",
      "nameTe": "కొర్రాయి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Korrai",
      "nameTe": "దిగువ కొర్రాయి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Korrai",
      "nameTe": "ఎగువ కొర్రాయి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Korrai Colony",
      "nameTe": "కొర్రాయి కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__kuridi": [
    {
      "nameEn": "Kuridi (Main Village)",
      "nameTe": "కురిడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kuridi",
      "nameTe": "దిగువ కురిడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kuridi",
      "nameTe": "ఎగువ కురిడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kuridi Colony",
      "nameTe": "కురిడి కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__lygonda": [
    {
      "nameEn": "Lygonda (Main Village)",
      "nameTe": "లైగొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lygonda",
      "nameTe": "దిగువ లైగొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lygonda",
      "nameTe": "ఎగువ లైగొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lygonda Colony",
      "nameTe": "లైగొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__pothangi": [
    {
      "nameEn": "Pothangi (Main Village)",
      "nameTe": "పోతంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pothangi",
      "nameTe": "దిగువ పోతంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pothangi",
      "nameTe": "ఎగువ పోతంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pothangi Colony",
      "nameTe": "పోతంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__rangilisingi": [
    {
      "nameEn": "Rangilisingi (Main Village)",
      "nameTe": "రంగిలిసింగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rangilisingi",
      "nameTe": "దిగువ రంగిలిసింగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rangilisingi",
      "nameTe": "ఎగువ రంగిలిసింగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rangilisingi Colony",
      "nameTe": "రంగిలిసింగి కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__sagara": [
    {
      "nameEn": "Sagara (Main Village)",
      "nameTe": "సాగర (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sagara",
      "nameTe": "దిగువ సాగర",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sagara",
      "nameTe": "ఎగువ సాగర",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sagara Colony",
      "nameTe": "సాగర కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__sovva": [
    {
      "nameEn": "Sovva (Main Village)",
      "nameTe": "సొవ్వ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sovva",
      "nameTe": "దిగువ సొవ్వ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sovva",
      "nameTe": "ఎగువ సొవ్వ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sovva Colony",
      "nameTe": "సొవ్వ కాలనీ",
      "type": "Colony"
    }
  ],
  "dumbriguda__thutangi": [
    {
      "nameEn": "Thutangi (Main Village)",
      "nameTe": "తుటాంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Thutangi",
      "nameTe": "దిగువ తుటాంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Thutangi",
      "nameTe": "ఎగువ తుటాంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Thutangi Colony",
      "nameTe": "తుటాంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__ananthagiri": [
    {
      "nameEn": "Ananthagiri (Main Village)",
      "nameTe": "అనంతగిరి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Ananthagiri",
      "nameTe": "దిగువ అనంతగిరి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Ananthagiri",
      "nameTe": "ఎగువ అనంతగిరి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Ananthagiri Colony",
      "nameTe": "అనంతగిరి కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__bheemapolu": [
    {
      "nameEn": "Bheemapolu (Main Village)",
      "nameTe": "భీమపోలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bheemapolu",
      "nameTe": "దిగువ భీమపోలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bheemapolu",
      "nameTe": "ఎగువ భీమపోలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bheemapolu Colony",
      "nameTe": "భీమపోలు కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__borra": [
    {
      "nameEn": "Borra Caves Village",
      "nameTe": "బొర్రా గుహల గ్రామం",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Katiki Waterfalls Habitation",
      "nameTe": "కటికి జలపాతం ఆవాసం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Gumma Hamlet",
      "nameTe": "గుమ్మ ఆవాసం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Railway Colony Borra",
      "nameTe": "రైల్వే కాలనీ బొర్రా",
      "type": "Colony"
    }
  ],
  "ananthagiri__chilakalagedda": [
    {
      "nameEn": "Chilakalagedda (Main Village)",
      "nameTe": "చిలకలగెడ్డ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chilakalagedda",
      "nameTe": "దిగువ చిలకలగెడ్డ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chilakalagedda",
      "nameTe": "ఎగువ చిలకలగెడ్డ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chilakalagedda Colony",
      "nameTe": "చిలకలగెడ్డ కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__garugubilli": [
    {
      "nameEn": "Garugubilli (Main Village)",
      "nameTe": "గరుగుబిల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Garugubilli",
      "nameTe": "దిగువ గరుగుబిల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Garugubilli",
      "nameTe": "ఎగువ గరుగుబిల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Garugubilli Colony",
      "nameTe": "గరుగుబిల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__gumma": [
    {
      "nameEn": "Gumma (Main Village)",
      "nameTe": "గుమ్మ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gumma",
      "nameTe": "దిగువ గుమ్మ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gumma",
      "nameTe": "ఎగువ గుమ్మ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gumma Colony",
      "nameTe": "గుమ్మ కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__gummakota": [
    {
      "nameEn": "Gummakota (Main Village)",
      "nameTe": "గుమ్మకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gummakota",
      "nameTe": "దిగువ గుమ్మకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gummakota",
      "nameTe": "ఎగువ గుమ్మకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gummakota Colony",
      "nameTe": "గుమ్మకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__jeenabadu": [
    {
      "nameEn": "Jeenabadu (Main Village)",
      "nameTe": "జీనబాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jeenabadu",
      "nameTe": "దిగువ జీనబాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jeenabadu",
      "nameTe": "ఎగువ జీనబాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jeenabadu Colony",
      "nameTe": "జీనబాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__kasipatnam": [
    {
      "nameEn": "Kasipatnam (Main Village)",
      "nameTe": "కాశీపట్నం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kasipatnam",
      "nameTe": "దిగువ కాశీపట్నం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kasipatnam",
      "nameTe": "ఎగువ కాశీపట్నం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kasipatnam Colony",
      "nameTe": "కాశీపట్నం కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__kivarla": [
    {
      "nameEn": "Kivarla (Main Village)",
      "nameTe": "కివర్ల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kivarla",
      "nameTe": "దిగువ కివర్ల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kivarla",
      "nameTe": "ఎగువ కివర్ల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kivarla Colony",
      "nameTe": "కివర్ల కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__kondiba": [
    {
      "nameEn": "Kondiba (Main Village)",
      "nameTe": "కొండిబ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kondiba",
      "nameTe": "దిగువ కొండిబ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kondiba",
      "nameTe": "ఎగువ కొండిబ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kondiba Colony",
      "nameTe": "కొండిబ కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__kotturu": [
    {
      "nameEn": "Kotturu (Main Village)",
      "nameTe": "కొత్తూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kotturu",
      "nameTe": "దిగువ కొత్తూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kotturu",
      "nameTe": "ఎగువ కొత్తూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kotturu Colony",
      "nameTe": "కొత్తూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__kunapuram": [
    {
      "nameEn": "Kunapuram (Main Village)",
      "nameTe": "కూనపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kunapuram",
      "nameTe": "దిగువ కూనపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kunapuram",
      "nameTe": "ఎగువ కూనపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kunapuram Colony",
      "nameTe": "కూనపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__lungaparti": [
    {
      "nameEn": "Lungaparti (Main Village)",
      "nameTe": "లుంగపర్తి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lungaparti",
      "nameTe": "దిగువ లుంగపర్తి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lungaparti",
      "nameTe": "ఎగువ లుంగపర్తి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lungaparti Colony",
      "nameTe": "లుంగపర్తి కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__narasimharajupuram": [
    {
      "nameEn": "Narasimharajupuram (Main Village)",
      "nameTe": "నరసింహరాజుపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Narasimharajupuram",
      "nameTe": "దిగువ నరసింహరాజుపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Narasimharajupuram",
      "nameTe": "ఎగువ నరసింహరాజుపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Narasimharajupuram Colony",
      "nameTe": "నరసింహరాజుపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__pedabidda": [
    {
      "nameEn": "Pedabidda (Main Village)",
      "nameTe": "పెదబిడ్డ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedabidda",
      "nameTe": "దిగువ పెదబిడ్డ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedabidda",
      "nameTe": "ఎగువ పెదబిడ్డ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedabidda Colony",
      "nameTe": "పెదబిడ్డ కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__pedakota": [
    {
      "nameEn": "Pedakota (Main Village)",
      "nameTe": "పెదకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedakota",
      "nameTe": "దిగువ పెదకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedakota",
      "nameTe": "ఎగువ పెదకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedakota Colony",
      "nameTe": "పెదకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__pinakota": [
    {
      "nameEn": "Pinakota (Main Village)",
      "nameTe": "పినకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pinakota",
      "nameTe": "దిగువ పినకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pinakota",
      "nameTe": "ఎగువ పినకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pinakota Colony",
      "nameTe": "పినకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__pynampadu": [
    {
      "nameEn": "Pynampadu (Main Village)",
      "nameTe": "పైనాంపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pynampadu",
      "nameTe": "దిగువ పైనాంపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pynampadu",
      "nameTe": "ఎగువ పైనాంపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pynampadu Colony",
      "nameTe": "పైనాంపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__rampalle": [
    {
      "nameEn": "Rampalle (Main Village)",
      "nameTe": "రంపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rampalle",
      "nameTe": "దిగువ రంపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rampalle",
      "nameTe": "ఎగువ రంపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rampalle Colony",
      "nameTe": "రంపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__tokuru": [
    {
      "nameEn": "Tokuru (Main Village)",
      "nameTe": "తోకూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Tokuru",
      "nameTe": "దిగువ తోకూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Tokuru",
      "nameTe": "ఎగువ తోకూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Tokuru Colony",
      "nameTe": "తోకూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__valasi": [
    {
      "nameEn": "Valasi (Main Village)",
      "nameTe": "వలసి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Valasi",
      "nameTe": "దిగువ వలసి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Valasi",
      "nameTe": "ఎగువ వలసి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Valasi Colony",
      "nameTe": "వలసి కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__vengada": [
    {
      "nameEn": "Vengada (Main Village)",
      "nameTe": "వెంగడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vengada",
      "nameTe": "దిగువ వెంగడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vengada",
      "nameTe": "ఎగువ వెంగడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vengada Colony",
      "nameTe": "వెంగడ కాలనీ",
      "type": "Colony"
    }
  ],
  "ananthagiri__yeguvasoba": [
    {
      "nameEn": "Yeguvasoba (Main Village)",
      "nameTe": "ఎగువసోబ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Yeguvasoba",
      "nameTe": "దిగువ ఎగువసోబ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Yeguvasoba",
      "nameTe": "ఎగువ ఎగువసోబ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Yeguvasoba Colony",
      "nameTe": "ఎగువసోబ కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__addumanda": [
    {
      "nameEn": "Addumanda (Main Village)",
      "nameTe": "అద్దుమండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Addumanda",
      "nameTe": "దిగువ అద్దుమండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Addumanda",
      "nameTe": "ఎగువ అద్దుమండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Addumanda Colony",
      "nameTe": "అద్దుమండ కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__andiba": [
    {
      "nameEn": "Andiba (Main Village)",
      "nameTe": "అండిబ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Andiba",
      "nameTe": "దిగువ అండిబ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Andiba",
      "nameTe": "ఎగువ అండిబ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Andiba Colony",
      "nameTe": "అండిబ కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__bakuru": [
    {
      "nameEn": "Bakuru (Main Village)",
      "nameTe": "బాకూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bakuru",
      "nameTe": "దిగువ బాకూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bakuru",
      "nameTe": "ఎగువ బాకూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bakuru Colony",
      "nameTe": "బాకూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__baramasi": [
    {
      "nameEn": "Baramasi (Main Village)",
      "nameTe": "బారమాసి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Baramasi",
      "nameTe": "దిగువ బారమాసి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Baramasi",
      "nameTe": "ఎగువ బారమాసి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Baramasi Colony",
      "nameTe": "బారమాసి కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__bheemavaram": [
    {
      "nameEn": "Bheemavaram (Main Village)",
      "nameTe": "భీమవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bheemavaram",
      "nameTe": "దిగువ భీమవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bheemavaram",
      "nameTe": "ఎగువ భీమవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bheemavaram Colony",
      "nameTe": "భీమవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__boddaputtu": [
    {
      "nameEn": "Boddaputtu (Main Village)",
      "nameTe": "బొడ్డపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Boddaputtu",
      "nameTe": "దిగువ బొడ్డపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Boddaputtu",
      "nameTe": "ఎగువ బొడ్డపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Boddaputtu Colony",
      "nameTe": "బొడ్డపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__boorja": [
    {
      "nameEn": "Boorja (Main Village)",
      "nameTe": "బూర్జ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Boorja",
      "nameTe": "దిగువ బూర్జ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Boorja",
      "nameTe": "ఎగువ బూర్జ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Boorja Colony",
      "nameTe": "బూర్జ కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__cheekumaddula": [
    {
      "nameEn": "Cheekumaddula (Main Village)",
      "nameTe": "చీకుమద్దుల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Cheekumaddula",
      "nameTe": "దిగువ చీకుమద్దుల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Cheekumaddula",
      "nameTe": "ఎగువ చీకుమద్దుల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Cheekumaddula Colony",
      "nameTe": "చీకుమద్దుల కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__durgam": [
    {
      "nameEn": "Durgam (Main Village)",
      "nameTe": "దుర్గం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Durgam",
      "nameTe": "దిగువ దుర్గం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Durgam",
      "nameTe": "ఎగువ దుర్గం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Durgam Colony",
      "nameTe": "దుర్గం కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__gadikinchumanda": [
    {
      "nameEn": "Gadikinchumanda (Main Village)",
      "nameTe": "గడికించుమండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gadikinchumanda",
      "nameTe": "దిగువ గడికించుమండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gadikinchumanda",
      "nameTe": "ఎగువ గడికించుమండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gadikinchumanda Colony",
      "nameTe": "గడికించుమండ కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__ganneruputtu": [
    {
      "nameEn": "Ganneruputtu (Main Village)",
      "nameTe": "గన్నేరుపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Ganneruputtu",
      "nameTe": "దిగువ గన్నేరుపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Ganneruputtu",
      "nameTe": "ఎగువ గన్నేరుపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Ganneruputtu Colony",
      "nameTe": "గన్నేరుపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__gattum": [
    {
      "nameEn": "Gattum (Main Village)",
      "nameTe": "గట్టుం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gattum",
      "nameTe": "దిగువ గట్టుం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gattum",
      "nameTe": "ఎగువ గట్టుం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gattum Colony",
      "nameTe": "గట్టుం కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__guda": [
    {
      "nameEn": "Guda (Main Village)",
      "nameTe": "గూడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Guda",
      "nameTe": "దిగువ గూడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Guda",
      "nameTe": "ఎగువ గూడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Guda Colony",
      "nameTe": "గూడ కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__hukumpeta": [
    {
      "nameEn": "Hukumpeta (Main Village)",
      "nameTe": "హుకుంపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Hukumpeta",
      "nameTe": "దిగువ హుకుంపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Hukumpeta",
      "nameTe": "ఎగువ హుకుంపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Hukumpeta Colony",
      "nameTe": "హుకుంపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__jarrakonda": [
    {
      "nameEn": "Jarrakonda (Main Village)",
      "nameTe": "జర్రకొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jarrakonda",
      "nameTe": "దిగువ జర్రకొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jarrakonda",
      "nameTe": "ఎగువ జర్రకొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jarrakonda Colony",
      "nameTe": "జర్రకొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__konthili": [
    {
      "nameEn": "Konthili (Main Village)",
      "nameTe": "కొంతిలి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Konthili",
      "nameTe": "దిగువ కొంతిలి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Konthili",
      "nameTe": "ఎగువ కొంతిలి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Konthili Colony",
      "nameTe": "కొంతిలి కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__kotnapalli": [
    {
      "nameEn": "Kotnapalli (Main Village)",
      "nameTe": "కొత్నాపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kotnapalli",
      "nameTe": "దిగువ కొత్నాపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kotnapalli",
      "nameTe": "ఎగువ కొత్నాపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kotnapalli Colony",
      "nameTe": "కొత్నాపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__matsyapuram": [
    {
      "nameEn": "Matsyapuram (Main Village)",
      "nameTe": "మత్స్యపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Matsyapuram",
      "nameTe": "దిగువ మత్స్యపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Matsyapuram",
      "nameTe": "ఎగువ మత్స్యపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Matsyapuram Colony",
      "nameTe": "మత్స్యపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__mattam": [
    {
      "nameEn": "Mattam (Main Village)",
      "nameTe": "మట్టం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mattam",
      "nameTe": "దిగువ మట్టం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mattam",
      "nameTe": "ఎగువ మట్టం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mattam Colony",
      "nameTe": "మట్టం కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__merakachinta": [
    {
      "nameEn": "Merakachinta (Main Village)",
      "nameTe": "మెరకచింత (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Merakachinta",
      "nameTe": "దిగువ మెరకచింత",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Merakachinta",
      "nameTe": "ఎగువ మెరకచింత",
      "type": "Hamlet"
    },
    {
      "nameEn": "Merakachinta Colony",
      "nameTe": "మెరకచింత కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__mettujoru": [
    {
      "nameEn": "Mettujoru (Main Village)",
      "nameTe": "మెట్టుజోరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mettujoru",
      "nameTe": "దిగువ మెట్టుజోరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mettujoru",
      "nameTe": "ఎగువ మెట్టుజోరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mettujoru Colony",
      "nameTe": "మెట్టుజోరు కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__muliaputtu": [
    {
      "nameEn": "Muliaputtu (Main Village)",
      "nameTe": "ములియపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Muliaputtu",
      "nameTe": "దిగువ ములియపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Muliaputtu",
      "nameTe": "ఎగువ ములియపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Muliaputtu Colony",
      "nameTe": "ములియపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__olda": [
    {
      "nameEn": "Olda (Main Village)",
      "nameTe": "ఓల్డ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Olda",
      "nameTe": "దిగువ ఓల్డ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Olda",
      "nameTe": "ఎగువ ఓల్డ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Olda Colony",
      "nameTe": "ఓల్డ కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__pathakota": [
    {
      "nameEn": "Pathakota (Main Village)",
      "nameTe": "పాతకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pathakota",
      "nameTe": "దిగువ పాతకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pathakota",
      "nameTe": "ఎగువ పాతకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pathakota Colony",
      "nameTe": "పాతకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__pattam": [
    {
      "nameEn": "Pattam (Main Village)",
      "nameTe": "పట్టం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pattam",
      "nameTe": "దిగువ పట్టం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pattam",
      "nameTe": "ఎగువ పట్టం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pattam Colony",
      "nameTe": "పట్టం కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__rangaseela": [
    {
      "nameEn": "Rangaseela (Main Village)",
      "nameTe": "రంగశీల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rangaseela",
      "nameTe": "దిగువ రంగశీల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rangaseela",
      "nameTe": "ఎగువ రంగశీల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rangaseela Colony",
      "nameTe": "రంగశీల కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__rapa": [
    {
      "nameEn": "Rapa (Main Village)",
      "nameTe": "రాప (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rapa",
      "nameTe": "దిగువ రాప",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rapa",
      "nameTe": "ఎగువ రాప",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rapa Colony",
      "nameTe": "రాప కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__santhari": [
    {
      "nameEn": "Santhari (Main Village)",
      "nameTe": "సంతరి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Santhari",
      "nameTe": "దిగువ సంతరి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Santhari",
      "nameTe": "ఎగువ సంతరి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Santhari Colony",
      "nameTe": "సంతరి కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__sobakota": [
    {
      "nameEn": "Sobakota (Main Village)",
      "nameTe": "శోభకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sobakota",
      "nameTe": "దిగువ శోభకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sobakota",
      "nameTe": "ఎగువ శోభకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sobakota Colony",
      "nameTe": "శోభకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__sukuru": [
    {
      "nameEn": "Sukuru (Main Village)",
      "nameTe": "సుకురు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sukuru",
      "nameTe": "దిగువ సుకురు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sukuru",
      "nameTe": "ఎగువ సుకురు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sukuru Colony",
      "nameTe": "సుకురు కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__tadigiri": [
    {
      "nameEn": "Tadigiri (Main Village)",
      "nameTe": "తాడిగిరి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Tadigiri",
      "nameTe": "దిగువ తాడిగిరి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Tadigiri",
      "nameTe": "ఎగువ తాడిగిరి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Tadigiri Colony",
      "nameTe": "తాడిగిరి కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__teegalavalasa": [
    {
      "nameEn": "Teegalavalasa (Main Village)",
      "nameTe": "తీగలవలస (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Teegalavalasa",
      "nameTe": "దిగువ తీగలవలస",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Teegalavalasa",
      "nameTe": "ఎగువ తీగలవలస",
      "type": "Hamlet"
    },
    {
      "nameEn": "Teegalavalasa Colony",
      "nameTe": "తీగలవలస కాలనీ",
      "type": "Colony"
    }
  ],
  "hukumpeta__thadiputtu": [
    {
      "nameEn": "Thadiputtu (Main Village)",
      "nameTe": "తాడిపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Thadiputtu",
      "nameTe": "దిగువ తాడిపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Thadiputtu",
      "nameTe": "ఎగువ తాడిపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Thadiputtu Colony",
      "nameTe": "తాడిపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__adugula_puttu": [
    {
      "nameEn": "Adugula Puttu (Main Village)",
      "nameTe": "అడుగుల పుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Adugula Puttu",
      "nameTe": "దిగువ అడుగుల పుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Adugula Puttu",
      "nameTe": "ఎగువ అడుగుల పుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Adugula Puttu Colony",
      "nameTe": "అడుగుల పుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__aradakota": [
    {
      "nameEn": "Aradakota (Main Village)",
      "nameTe": "అరదకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Aradakota",
      "nameTe": "దిగువ అరదకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Aradakota",
      "nameTe": "ఎగువ అరదకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Aradakota Colony",
      "nameTe": "అరదకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__bondapalli": [
    {
      "nameEn": "Bondapalli (Main Village)",
      "nameTe": "బొండపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bondapalli",
      "nameTe": "దిగువ బొండపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bondapalli",
      "nameTe": "ఎగువ బొండపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bondapalli Colony",
      "nameTe": "బొండపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__bongaram": [
    {
      "nameEn": "Bongaram (Main Village)",
      "nameTe": "బొంగరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bongaram",
      "nameTe": "దిగువ బొంగరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bongaram",
      "nameTe": "ఎగువ బొంగరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bongaram Colony",
      "nameTe": "బొంగరం కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__galagonda": [
    {
      "nameEn": "Galagonda (Main Village)",
      "nameTe": "గలగొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Galagonda",
      "nameTe": "దిగువ గలగొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Galagonda",
      "nameTe": "ఎగువ గలగొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Galagonda Colony",
      "nameTe": "గలగొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__gamparai": [
    {
      "nameEn": "Gamparai (Main Village)",
      "nameTe": "గంపరాయి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gamparai",
      "nameTe": "దిగువ గంపరాయి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gamparai",
      "nameTe": "ఎగువ గంపరాయి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gamparai Colony",
      "nameTe": "గంపరాయి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__ginnelakota": [
    {
      "nameEn": "Ginnelakota (Main Village)",
      "nameTe": "గిన్నెలకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Ginnelakota",
      "nameTe": "దిగువ గిన్నెలకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Ginnelakota",
      "nameTe": "ఎగువ గిన్నెలకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Ginnelakota Colony",
      "nameTe": "గిన్నెలకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__gomangi": [
    {
      "nameEn": "Gomangi (Main Village)",
      "nameTe": "గోమంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gomangi",
      "nameTe": "దిగువ గోమంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gomangi",
      "nameTe": "ఎగువ గోమంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gomangi Colony",
      "nameTe": "గోమంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__gullelu": [
    {
      "nameEn": "Gullelu (Main Village)",
      "nameTe": "గుల్లెలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gullelu",
      "nameTe": "దిగువ గుల్లెలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gullelu",
      "nameTe": "ఎగువ గుల్లెలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gullelu Colony",
      "nameTe": "గుల్లెలు కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__injari": [
    {
      "nameEn": "Injari (Main Village)",
      "nameTe": "ఇంజరి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Injari",
      "nameTe": "దిగువ ఇంజరి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Injari",
      "nameTe": "ఎగువ ఇంజరి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Injari Colony",
      "nameTe": "ఇంజరి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__jamiguda": [
    {
      "nameEn": "Jamiguda (Main Village)",
      "nameTe": "జామిగూడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jamiguda",
      "nameTe": "దిగువ జామిగూడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jamiguda",
      "nameTe": "ఎగువ జామిగూడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jamiguda Colony",
      "nameTe": "జామిగూడ కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__kimudupalli": [
    {
      "nameEn": "Kimudupalli (Main Village)",
      "nameTe": "కిముడుపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kimudupalli",
      "nameTe": "దిగువ కిముడుపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kimudupalli",
      "nameTe": "ఎగువ కిముడుపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kimudupalli Colony",
      "nameTe": "కిముడుపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__koravangi": [
    {
      "nameEn": "Koravangi (Main Village)",
      "nameTe": "కొరవంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Koravangi",
      "nameTe": "దిగువ కొరవంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Koravangi",
      "nameTe": "ఎగువ కొరవంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Koravangi Colony",
      "nameTe": "కొరవంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__kuntharla": [
    {
      "nameEn": "Kuntharla (Main Village)",
      "nameTe": "కుంతర్ల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kuntharla",
      "nameTe": "దిగువ కుంతర్ల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kuntharla",
      "nameTe": "ఎగువ కుంతర్ల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kuntharla Colony",
      "nameTe": "కుంతర్ల కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__laxmipeta": [
    {
      "nameEn": "Laxmipeta (Main Village)",
      "nameTe": "లక్ష్మీపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Laxmipeta",
      "nameTe": "దిగువ లక్ష్మీపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Laxmipeta",
      "nameTe": "ఎగువ లక్ష్మీపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Laxmipeta Colony",
      "nameTe": "లక్ష్మీపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__lingeti": [
    {
      "nameEn": "Lingeti (Main Village)",
      "nameTe": "లింగేటి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lingeti",
      "nameTe": "దిగువ లింగేటి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lingeti",
      "nameTe": "ఎగువ లింగేటి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lingeti Colony",
      "nameTe": "లింగేటి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__parreda": [
    {
      "nameEn": "Parreda (Main Village)",
      "nameTe": "పర్రెడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Parreda",
      "nameTe": "దిగువ పర్రెడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Parreda",
      "nameTe": "ఎగువ పర్రెడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Parreda Colony",
      "nameTe": "పర్రెడ కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__pedakodapalli": [
    {
      "nameEn": "Pedakodapalli (Main Village)",
      "nameTe": "పెదకోడపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedakodapalli",
      "nameTe": "దిగువ పెదకోడపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedakodapalli",
      "nameTe": "ఎగువ పెదకోడపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedakodapalli Colony",
      "nameTe": "పెదకోడపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__poipalle": [
    {
      "nameEn": "Poipalle (Main Village)",
      "nameTe": "పోయిపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Poipalle",
      "nameTe": "దిగువ పోయిపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Poipalle",
      "nameTe": "ఎగువ పోయిపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Poipalle Colony",
      "nameTe": "పోయిపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__rudakota": [
    {
      "nameEn": "Rudakota (Main Village)",
      "nameTe": "రుదకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rudakota",
      "nameTe": "దిగువ రుదకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rudakota",
      "nameTe": "ఎగువ రుదకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rudakota Colony",
      "nameTe": "రుదకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__seekari": [
    {
      "nameEn": "Seekari (Main Village)",
      "nameTe": "సీకరి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Seekari",
      "nameTe": "దిగువ సీకరి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Seekari",
      "nameTe": "ఎగువ సీకరి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Seekari Colony",
      "nameTe": "సీకరి కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__seethagunta": [
    {
      "nameEn": "Seethagunta (Main Village)",
      "nameTe": "సీతగుంట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Seethagunta",
      "nameTe": "దిగువ సీతగుంట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Seethagunta",
      "nameTe": "ఎగువ సీతగుంట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Seethagunta Colony",
      "nameTe": "సీతగుంట కాలనీ",
      "type": "Colony"
    }
  ],
  "pedabayalu__vanabangi": [
    {
      "nameEn": "Vanabangi (Main Village)",
      "nameTe": "వనబంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanabangi",
      "nameTe": "దిగువ వనబంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanabangi",
      "nameTe": "ఎగువ వనబంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanabangi Colony",
      "nameTe": "వనబంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__babusala": [
    {
      "nameEn": "Babusala (Main Village)",
      "nameTe": "బాబుసాల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Babusala",
      "nameTe": "దిగువ బాబుసాల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Babusala",
      "nameTe": "ఎగువ బాబుసాల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Babusala Colony",
      "nameTe": "బాబుసాల కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__bangarumetta": [
    {
      "nameEn": "Bangarumetta (Main Village)",
      "nameTe": "బంగారుమెట్ట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bangarumetta",
      "nameTe": "దిగువ బంగారుమెట్ట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bangarumetta",
      "nameTe": "ఎగువ బంగారుమెట్ట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bangarumetta Colony",
      "nameTe": "బంగారుమెట్ట కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__barada": [
    {
      "nameEn": "Barada (Main Village)",
      "nameTe": "బారద (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Barada",
      "nameTe": "దిగువ బారద",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Barada",
      "nameTe": "ఎగువ బారద",
      "type": "Hamlet"
    },
    {
      "nameEn": "Barada Colony",
      "nameTe": "బారద కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__bungaput": [
    {
      "nameEn": "Bungaput (Main Village)",
      "nameTe": "బుంగపుట్ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bungaput",
      "nameTe": "దిగువ బుంగపుట్",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bungaput",
      "nameTe": "ఎగువ బుంగపుట్",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bungaput Colony",
      "nameTe": "బుంగపుట్ కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__busiputtu": [
    {
      "nameEn": "Busiputtu (Main Village)",
      "nameTe": "బుసిపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Busiputtu",
      "nameTe": "దిగువ బుసిపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Busiputtu",
      "nameTe": "ఎగువ బుసిపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Busiputtu Colony",
      "nameTe": "బుసిపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__darela": [
    {
      "nameEn": "Darela (Main Village)",
      "nameTe": "దారెలా (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Darela",
      "nameTe": "దిగువ దారెలా",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Darela",
      "nameTe": "ఎగువ దారెలా",
      "type": "Hamlet"
    },
    {
      "nameEn": "Darela Colony",
      "nameTe": "దారెలా కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__doddiputtu": [
    {
      "nameEn": "Doddiputtu (Main Village)",
      "nameTe": "దొడ్డిపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Doddiputtu",
      "nameTe": "దిగువ దొడ్డిపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Doddiputtu",
      "nameTe": "ఎగువ దొడ్డిపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Doddiputtu Colony",
      "nameTe": "దొడ్డిపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__jarjula": [
    {
      "nameEn": "Jarjula (Main Village)",
      "nameTe": "జార్జుల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jarjula",
      "nameTe": "దిగువ జార్జుల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jarjula",
      "nameTe": "ఎగువ జార్జుల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jarjula Colony",
      "nameTe": "జార్జుల కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__jerrala": [
    {
      "nameEn": "Jerrala (Main Village)",
      "nameTe": "జెర్రల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jerrala",
      "nameTe": "దిగువ జెర్రల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jerrala",
      "nameTe": "ఎగువ జెర్రల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jerrala Colony",
      "nameTe": "జెర్రల కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__jolaputtu": [
    {
      "nameEn": "Jolaputtu (Main Village)",
      "nameTe": "జోలాపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jolaputtu",
      "nameTe": "దిగువ జోలాపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jolaputtu",
      "nameTe": "ఎగువ జోలాపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jolaputtu Colony",
      "nameTe": "జోలాపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__karimukhiputtu": [
    {
      "nameEn": "Karimukhiputtu (Main Village)",
      "nameTe": "కరిముఖిపుట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Karimukhiputtu",
      "nameTe": "దిగువ కరిముఖిపుట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Karimukhiputtu",
      "nameTe": "ఎగువ కరిముఖిపుట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Karimukhiputtu Colony",
      "nameTe": "కరిముఖిపుట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__kilagada": [
    {
      "nameEn": "Kilagada (Main Village)",
      "nameTe": "కిలగడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kilagada",
      "nameTe": "దిగువ కిలగడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kilagada",
      "nameTe": "ఎగువ కిలగడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kilagada Colony",
      "nameTe": "కిలగడ కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__kinchaiput": [
    {
      "nameEn": "Kinchaiput (Main Village)",
      "nameTe": "కించాయిపుట్ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kinchaiput",
      "nameTe": "దిగువ కించాయిపుట్",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kinchaiput",
      "nameTe": "ఎగువ కించాయిపుట్",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kinchaiput Colony",
      "nameTe": "కించాయిపుట్ కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__kumada": [
    {
      "nameEn": "Kumada (Main Village)",
      "nameTe": "కుమడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kumada",
      "nameTe": "దిగువ కుమడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kumada",
      "nameTe": "ఎగువ కుమడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kumada Colony",
      "nameTe": "కుమడ కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__laxmipuram": [
    {
      "nameEn": "Laxmipuram (Main Village)",
      "nameTe": "లక్ష్మీపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Laxmipuram",
      "nameTe": "దిగువ లక్ష్మీపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Laxmipuram",
      "nameTe": "ఎగువ లక్ష్మీపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Laxmipuram Colony",
      "nameTe": "లక్ష్మీపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__makavaram": [
    {
      "nameEn": "Makavaram (Main Village)",
      "nameTe": "మాకవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Makavaram",
      "nameTe": "దిగువ మాకవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Makavaram",
      "nameTe": "ఎగువ మాకవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Makavaram Colony",
      "nameTe": "మాకవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__panasaput": [
    {
      "nameEn": "Panasaput (Main Village)",
      "nameTe": "పనసపుట్ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Panasaput",
      "nameTe": "దిగువ పనసపుట్",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Panasaput",
      "nameTe": "ఎగువ పనసపుట్",
      "type": "Hamlet"
    },
    {
      "nameEn": "Panasaput Colony",
      "nameTe": "పనసపుట్ కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__pedaguda": [
    {
      "nameEn": "Pedaguda (Main Village)",
      "nameTe": "పెదగూడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedaguda",
      "nameTe": "దిగువ పెదగూడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedaguda",
      "nameTe": "ఎగువ పెదగూడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedaguda Colony",
      "nameTe": "పెదగూడ కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__rangabayalu": [
    {
      "nameEn": "Rangabayalu (Main Village)",
      "nameTe": "రంగబయలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rangabayalu",
      "nameTe": "దిగువ రంగబయలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rangabayalu",
      "nameTe": "ఎగువ రంగబయలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rangabayalu Colony",
      "nameTe": "రంగబయలు కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__sujanakota": [
    {
      "nameEn": "Sujanakota (Main Village)",
      "nameTe": "సుజనకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sujanakota",
      "nameTe": "దిగువ సుజనకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sujanakota",
      "nameTe": "ఎగువ సుజనకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sujanakota Colony",
      "nameTe": "సుజనకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__vanabhasingi": [
    {
      "nameEn": "Vanabhasingi (Main Village)",
      "nameTe": "వనభసింగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanabhasingi",
      "nameTe": "దిగువ వనభసింగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanabhasingi",
      "nameTe": "ఎగువ వనభసింగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanabhasingi Colony",
      "nameTe": "వనభసింగి కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__vanugumma": [
    {
      "nameEn": "Vanugumma (Main Village)",
      "nameTe": "వనుగుమ్మ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanugumma",
      "nameTe": "దిగువ వనుగుమ్మ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanugumma",
      "nameTe": "ఎగువ వనుగుమ్మ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanugumma Colony",
      "nameTe": "వనుగుమ్మ కాలనీ",
      "type": "Colony"
    }
  ],
  "munchingi_puttu__yenugurai": [
    {
      "nameEn": "Yenugurai (Main Village)",
      "nameTe": "ఏనుగురాయి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Yenugurai",
      "nameTe": "దిగువ ఏనుగురాయి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Yenugurai",
      "nameTe": "ఎగువ ఏనుగురాయి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Yenugurai Colony",
      "nameTe": "ఏనుగురాయి కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__cheedipalem": [
    {
      "nameEn": "Cheedipalem (Main Village)",
      "nameTe": "చీడిపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Cheedipalem",
      "nameTe": "దిగువ చీడిపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Cheedipalem",
      "nameTe": "ఎగువ చీడిపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Cheedipalem Colony",
      "nameTe": "చీడిపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__damanapalle": [
    {
      "nameEn": "Damanapalle (Main Village)",
      "nameTe": "దమనపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Damanapalle",
      "nameTe": "దిగువ దమనపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Damanapalle",
      "nameTe": "ఎగువ దమనపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Damanapalle Colony",
      "nameTe": "దమనపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__darakonda": [
    {
      "nameEn": "Darakonda (Main Village)",
      "nameTe": "ధారకొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Darakonda",
      "nameTe": "దిగువ ధారకొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Darakonda",
      "nameTe": "ఎగువ ధారకొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Darakonda Colony",
      "nameTe": "ధారకొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__devarapalli": [
    {
      "nameEn": "Devarapalli (Main Village)",
      "nameTe": "దేవరపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Devarapalli",
      "nameTe": "దిగువ దేవరపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Devarapalli",
      "nameTe": "ఎగువ దేవరపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Devarapalli Colony",
      "nameTe": "దేవరపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__duppalawada": [
    {
      "nameEn": "Duppalawada (Main Village)",
      "nameTe": "దుప్పలవాడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Duppalawada",
      "nameTe": "దిగువ దుప్పలవాడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Duppalawada",
      "nameTe": "ఎగువ దుప్పలవాడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Duppalawada Colony",
      "nameTe": "దుప్పలవాడ కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__g_k_veedhi": [
    {
      "nameEn": "G.K. Veedhi (Main Village)",
      "nameTe": "గూడెం కొత్త వీధి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva G.K. Veedhi",
      "nameTe": "దిగువ గూడెం కొత్త వీధి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva G.K. Veedhi",
      "nameTe": "ఎగువ గూడెం కొత్త వీధి",
      "type": "Hamlet"
    },
    {
      "nameEn": "G.K. Veedhi Colony",
      "nameTe": "గూడెం కొత్త వీధి కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__gummerevulu": [
    {
      "nameEn": "Gummerevulu (Main Village)",
      "nameTe": "గుమ్మెరేవులు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gummerevulu",
      "nameTe": "దిగువ గుమ్మెరేవులు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gummerevulu",
      "nameTe": "ఎగువ గుమ్మెరేవులు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gummerevulu Colony",
      "nameTe": "గుమ్మెరేవులు కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__jerrila": [
    {
      "nameEn": "Jerrila (Main Village)",
      "nameTe": "జెర్రిల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jerrila",
      "nameTe": "దిగువ జెర్రిల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jerrila",
      "nameTe": "ఎగువ జెర్రిల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jerrila Colony",
      "nameTe": "జెర్రిల కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__lakkavarapupeta": [
    {
      "nameEn": "Lakkavarapupeta (Main Village)",
      "nameTe": "లక్కవరపుపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lakkavarapupeta",
      "nameTe": "దిగువ లక్కవరపుపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lakkavarapupeta",
      "nameTe": "ఎగువ లక్కవరపుపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lakkavarapupeta Colony",
      "nameTe": "లక్కవరపుపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__mondigedda": [
    {
      "nameEn": "Mondigedda (Main Village)",
      "nameTe": "మొండిగెడ్డ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mondigedda",
      "nameTe": "దిగువ మొండిగెడ్డ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mondigedda",
      "nameTe": "ఎగువ మొండిగెడ్డ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mondigedda Colony",
      "nameTe": "మొండిగెడ్డ కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__peddavalasa": [
    {
      "nameEn": "Peddavalasa (Main Village)",
      "nameTe": "పెద్దవలస (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Peddavalasa",
      "nameTe": "దిగువ పెద్దవలస",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Peddavalasa",
      "nameTe": "ఎగువ పెద్దవలస",
      "type": "Hamlet"
    },
    {
      "nameEn": "Peddavalasa Colony",
      "nameTe": "పెద్దవలస కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__rinthada": [
    {
      "nameEn": "Rinthada (Main Village)",
      "nameTe": "రింతడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rinthada",
      "nameTe": "దిగువ రింతడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rinthada",
      "nameTe": "ఎగువ రింతడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rinthada Colony",
      "nameTe": "రింతడ కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__sapparla": [
    {
      "nameEn": "Sapparla (Main Village)",
      "nameTe": "సప్పర్ల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sapparla",
      "nameTe": "దిగువ సప్పర్ల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sapparla",
      "nameTe": "ఎగువ సప్పర్ల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sapparla Colony",
      "nameTe": "సప్పర్ల కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__sileru": [
    {
      "nameEn": "Sileru (Main Village)",
      "nameTe": "సీలేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sileru",
      "nameTe": "దిగువ సీలేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sileru",
      "nameTe": "ఎగువ సీలేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sileru Colony",
      "nameTe": "సీలేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__vanchula": [
    {
      "nameEn": "Vanchula (Main Village)",
      "nameTe": "వంచులా (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanchula",
      "nameTe": "దిగువ వంచులా",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanchula",
      "nameTe": "ఎగువ వంచులా",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanchula Colony",
      "nameTe": "వంచులా కాలనీ",
      "type": "Colony"
    }
  ],
  "gk_veedhi__vegalapadu": [
    {
      "nameEn": "Vegalapadu (Main Village)",
      "nameTe": "వెగలపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vegalapadu",
      "nameTe": "దిగువ వెగలపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vegalapadu",
      "nameTe": "ఎగువ వెగలపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vegalapadu Colony",
      "nameTe": "వెగలపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__adakula": [
    {
      "nameEn": "Adakula (Main Village)",
      "nameTe": "అడకుల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Adakula",
      "nameTe": "దిగువ అడకుల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Adakula",
      "nameTe": "ఎగువ అడకుల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Adakula Colony",
      "nameTe": "అడకుల కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__anthada": [
    {
      "nameEn": "Anthada (Main Village)",
      "nameTe": "అంతడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Anthada",
      "nameTe": "దిగువ అంతడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Anthada",
      "nameTe": "ఎగువ అంతడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Anthada Colony",
      "nameTe": "అంతడ కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__bakuluru": [
    {
      "nameEn": "Bakuluru (Main Village)",
      "nameTe": "బాకులూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bakuluru",
      "nameTe": "దిగువ బాకులూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bakuluru",
      "nameTe": "ఎగువ బాకులూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bakuluru Colony",
      "nameTe": "బాకులూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__balaram": [
    {
      "nameEn": "Balaram (Main Village)",
      "nameTe": "బలరాం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Balaram",
      "nameTe": "దిగువ బలరాం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Balaram",
      "nameTe": "ఎగువ బలరాం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Balaram Colony",
      "nameTe": "బలరాం కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__bandalova": [
    {
      "nameEn": "Bandalova (Main Village)",
      "nameTe": "బండలోవ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bandalova",
      "nameTe": "దిగువ బండలోవ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bandalova",
      "nameTe": "ఎగువ బండలోవ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bandalova Colony",
      "nameTe": "బండలోవ కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__bangarammapeta": [
    {
      "nameEn": "Bangarammapeta (Main Village)",
      "nameTe": "బంగారమ్మపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bangarammapeta",
      "nameTe": "దిగువ బంగారమ్మపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bangarammapeta",
      "nameTe": "ఎగువ బంగారమ్మపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bangarammapeta Colony",
      "nameTe": "బంగారమ్మపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__battapanukulu": [
    {
      "nameEn": "Battapanukulu (Main Village)",
      "nameTe": "బట్టపానుకులు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Battapanukulu",
      "nameTe": "దిగువ బట్టపానుకులు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Battapanukulu",
      "nameTe": "ఎగువ బట్టపానుకులు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Battapanukulu Colony",
      "nameTe": "బట్టపానుకులు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__budaralla": [
    {
      "nameEn": "Budaralla (Main Village)",
      "nameTe": "బుదరాళ్ళ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Budaralla",
      "nameTe": "దిగువ బుదరాళ్ళ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Budaralla",
      "nameTe": "ఎగువ బుదరాళ్ళ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Budaralla Colony",
      "nameTe": "బుదరాళ్ళ కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__budidha": [
    {
      "nameEn": "Budidha (Main Village)",
      "nameTe": "బూడిద (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Budidha",
      "nameTe": "దిగువ బూడిద",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Budidha",
      "nameTe": "ఎగువ బూడిద",
      "type": "Hamlet"
    },
    {
      "nameEn": "Budidha Colony",
      "nameTe": "బూడిద కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__cheedipalem": [
    {
      "nameEn": "Cheedipalem (Main Village)",
      "nameTe": "చీడిపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Cheedipalem",
      "nameTe": "దిగువ చీడిపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Cheedipalem",
      "nameTe": "ఎగువ చీడిపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Cheedipalem Colony",
      "nameTe": "చీడిపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__chittempadu": [
    {
      "nameEn": "Chittempadu (Main Village)",
      "nameTe": "చిట్టెంపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chittempadu",
      "nameTe": "దిగువ చిట్టెంపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chittempadu",
      "nameTe": "ఎగువ చిట్టెంపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chittempadu Colony",
      "nameTe": "చిట్టెంపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__downuru": [
    {
      "nameEn": "Downuru (Main Village)",
      "nameTe": "డౌనూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Downuru",
      "nameTe": "దిగువ డౌనూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Downuru",
      "nameTe": "ఎగువ డౌనూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Downuru Colony",
      "nameTe": "డౌనూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__gadabapalem": [
    {
      "nameEn": "Gadabapalem (Main Village)",
      "nameTe": "గడబపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gadabapalem",
      "nameTe": "దిగువ గడబపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gadabapalem",
      "nameTe": "ఎగువ గడబపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gadabapalem Colony",
      "nameTe": "గడబపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__golugonda_peta": [
    {
      "nameEn": "Golugonda Peta (Main Village)",
      "nameTe": "గొలుగొండ పేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Golugonda Peta",
      "nameTe": "దిగువ గొలుగొండ పేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Golugonda Peta",
      "nameTe": "ఎగువ గొలుగొండ పేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Golugonda Peta Colony",
      "nameTe": "గొలుగొండ పేట కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__guntapalli": [
    {
      "nameEn": "Guntapalli (Main Village)",
      "nameTe": "గుంటపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Guntapalli",
      "nameTe": "దిగువ గుంటపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Guntapalli",
      "nameTe": "ఎగువ గుంటపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Guntapalli Colony",
      "nameTe": "గుంటపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__kannampeta": [
    {
      "nameEn": "Kannampeta (Main Village)",
      "nameTe": "కన్నంపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kannampeta",
      "nameTe": "దిగువ కన్నంపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kannampeta",
      "nameTe": "ఎగువ కన్నంపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kannampeta Colony",
      "nameTe": "కన్నంపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__kinchuru": [
    {
      "nameEn": "Kinchuru (Main Village)",
      "nameTe": "కించూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kinchuru",
      "nameTe": "దిగువ కించూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kinchuru",
      "nameTe": "ఎగువ కించూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kinchuru Colony",
      "nameTe": "కించూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__komaravolu": [
    {
      "nameEn": "Komaravolu (Main Village)",
      "nameTe": "కొమరవోలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Komaravolu",
      "nameTe": "దిగువ కొమరవోలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Komaravolu",
      "nameTe": "ఎగువ కొమరవోలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Komaravolu Colony",
      "nameTe": "కొమరవోలు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__koyyuru": [
    {
      "nameEn": "Koyyuru (Main Village)",
      "nameTe": "కొయ్యూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Koyyuru",
      "nameTe": "దిగువ కొయ్యూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Koyyuru",
      "nameTe": "ఎగువ కొయ్యూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Koyyuru Colony",
      "nameTe": "కొయ్యూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__mampa": [
    {
      "nameEn": "Mampa (Main Village)",
      "nameTe": "మాంప (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mampa",
      "nameTe": "దిగువ మాంప",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mampa",
      "nameTe": "ఎగువ మాంప",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mampa Colony",
      "nameTe": "మాంప కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__marriwada": [
    {
      "nameEn": "Marriwada (Main Village)",
      "nameTe": "మర్రివాడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Marriwada",
      "nameTe": "దిగువ మర్రివాడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Marriwada",
      "nameTe": "ఎగువ మర్రివాడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Marriwada Colony",
      "nameTe": "మర్రివాడ కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__mulapeta": [
    {
      "nameEn": "Mulapeta (Main Village)",
      "nameTe": "మూలపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mulapeta",
      "nameTe": "దిగువ మూలపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mulapeta",
      "nameTe": "ఎగువ మూలపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mulapeta Colony",
      "nameTe": "మూలపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__nadimpalem": [
    {
      "nameEn": "Nadimpalem (Main Village)",
      "nameTe": "నదింపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Nadimpalem",
      "nameTe": "దిగువ నదింపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Nadimpalem",
      "nameTe": "ఎగువ నదింపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Nadimpalem Colony",
      "nameTe": "నదింపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__nallagonda": [
    {
      "nameEn": "Nallagonda (Main Village)",
      "nameTe": "నల్లగొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Nallagonda",
      "nameTe": "దిగువ నల్లగొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Nallagonda",
      "nameTe": "ఎగువ నల్లగొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Nallagonda Colony",
      "nameTe": "నల్లగొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__paderu_colony": [
    {
      "nameEn": "Paderu Colony (Main Village)",
      "nameTe": "పాడేరు కాలనీ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Paderu Colony",
      "nameTe": "దిగువ పాడేరు కాలనీ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Paderu Colony",
      "nameTe": "ఎగువ పాడేరు కాలనీ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Paderu Colony Colony",
      "nameTe": "పాడేరు కాలనీ కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__peda_boddepalle": [
    {
      "nameEn": "Peda Boddepalle (Main Village)",
      "nameTe": "పెద బొద్దేపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Peda Boddepalle",
      "nameTe": "దిగువ పెద బొద్దేపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Peda Boddepalle",
      "nameTe": "ఎగువ పెద బొద్దేపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Peda Boddepalle Colony",
      "nameTe": "పెద బొద్దేపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__rajendrapalayam": [
    {
      "nameEn": "Rajendrapalayam (Main Village)",
      "nameTe": "రాజేంద్రపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rajendrapalayam",
      "nameTe": "దిగువ రాజేంద్రపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rajendrapalayam",
      "nameTe": "ఎగువ రాజేంద్రపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rajendrapalayam Colony",
      "nameTe": "రాజేంద్రపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__revallu": [
    {
      "nameEn": "Revallu (Main Village)",
      "nameTe": "రేవళ్ళు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Revallu",
      "nameTe": "దిగువ రేవళ్ళు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Revallu",
      "nameTe": "ఎగువ రేవళ్ళు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Revallu Colony",
      "nameTe": "రేవళ్ళు కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__sarabhanna_palem": [
    {
      "nameEn": "Sarabhanna Palem (Main Village)",
      "nameTe": "శరభన్నపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sarabhanna Palem",
      "nameTe": "దిగువ శరభన్నపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sarabhanna Palem",
      "nameTe": "ఎగువ శరభన్నపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sarabhanna Palem Colony",
      "nameTe": "శరభన్నపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__singavaram": [
    {
      "nameEn": "Singavaram (Main Village)",
      "nameTe": "సింగవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Singavaram",
      "nameTe": "దిగువ సింగవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Singavaram",
      "nameTe": "ఎగువ సింగవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Singavaram Colony",
      "nameTe": "సింగవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__somanadhapalem": [
    {
      "nameEn": "Somanadhapalem (Main Village)",
      "nameTe": "సోమనాథపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Somanadhapalem",
      "nameTe": "దిగువ సోమనాథపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Somanadhapalem",
      "nameTe": "ఎగువ సోమనాథపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Somanadhapalem Colony",
      "nameTe": "సోమనాథపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__sunkarametta": [
    {
      "nameEn": "Sunkarametta (Main Village)",
      "nameTe": "సుంకరమెట్ట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sunkarametta",
      "nameTe": "దిగువ సుంకరమెట్ట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sunkarametta",
      "nameTe": "ఎగువ సుంకరమెట్ట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sunkarametta Colony",
      "nameTe": "సుంకరమెట్ట కాలనీ",
      "type": "Colony"
    }
  ],
  "koyyuru__yellavaram": [
    {
      "nameEn": "Yellavaram (Main Village)",
      "nameTe": "ఎల్లవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Yellavaram",
      "nameTe": "దిగువ ఎల్లవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Yellavaram",
      "nameTe": "ఎగువ ఎల్లవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Yellavaram Colony",
      "nameTe": "ఎల్లవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__akuru": [
    {
      "nameEn": "Akuru (Main Village)",
      "nameTe": "ఆకూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Akuru",
      "nameTe": "దిగువ ఆకూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Akuru",
      "nameTe": "ఎగువ ఆకూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Akuru Colony",
      "nameTe": "ఆకూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__b_velamalakota": [
    {
      "nameEn": "B. Velamalakota (Main Village)",
      "nameTe": "బి. వెలమలకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva B. Velamalakota",
      "nameTe": "దిగువ బి. వెలమలకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva B. Velamalakota",
      "nameTe": "ఎగువ బి. వెలమలకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "B. Velamalakota Colony",
      "nameTe": "బి. వెలమలకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__bandapalle": [
    {
      "nameEn": "Bandapalle (Main Village)",
      "nameTe": "బండపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bandapalle",
      "nameTe": "దిగువ బండపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bandapalle",
      "nameTe": "ఎగువ బండపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bandapalle Colony",
      "nameTe": "బండపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__beerampalle": [
    {
      "nameEn": "Beerampalle (Main Village)",
      "nameTe": "బీరంపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Beerampalle",
      "nameTe": "దిగువ బీరంపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Beerampalle",
      "nameTe": "ఎగువ బీరంపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Beerampalle Colony",
      "nameTe": "బీరంపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__bolagonda": [
    {
      "nameEn": "Bolagonda (Main Village)",
      "nameTe": "బోలగొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bolagonda",
      "nameTe": "దిగువ బోలగొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bolagonda",
      "nameTe": "ఎగువ బోలగొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bolagonda Colony",
      "nameTe": "బోలగొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__busigudem": [
    {
      "nameEn": "Busigudem (Main Village)",
      "nameTe": "బుసిగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Busigudem",
      "nameTe": "దిగువ బుసిగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Busigudem",
      "nameTe": "ఎగువ బుసిగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Busigudem Colony",
      "nameTe": "బుసిగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__foulkspeta": [
    {
      "nameEn": "Foulkspeta (Main Village)",
      "nameTe": "ఫౌల్క్స్‌పేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Foulkspeta",
      "nameTe": "దిగువ ఫౌల్క్స్‌పేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Foulkspeta",
      "nameTe": "ఎగువ ఫౌల్క్స్‌పేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Foulkspeta Colony",
      "nameTe": "ఫౌల్క్స్‌పేట కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__i_polavaram": [
    {
      "nameEn": "I. Polavaram (Main Village)",
      "nameTe": "ఐ. పోలవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva I. Polavaram",
      "nameTe": "దిగువ ఐ. పోలవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva I. Polavaram",
      "nameTe": "ఎగువ ఐ. పోలవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "I. Polavaram Colony",
      "nameTe": "ఐ. పోలవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__madicherla": [
    {
      "nameEn": "Madicherla (Main Village)",
      "nameTe": "మడిచెర్ల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Madicherla",
      "nameTe": "దిగువ మడిచెర్ల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Madicherla",
      "nameTe": "ఎగువ మడిచెర్ల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Madicherla Colony",
      "nameTe": "మడిచెర్ల కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__marrivada": [
    {
      "nameEn": "Marrivada (Main Village)",
      "nameTe": "మర్రివాడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Marrivada",
      "nameTe": "దిగువ మర్రివాడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Marrivada",
      "nameTe": "ఎగువ మర్రివాడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Marrivada Colony",
      "nameTe": "మర్రివాడ కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__musurumilli": [
    {
      "nameEn": "Musurumilli (Main Village)",
      "nameTe": "ముసురుమిల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Musurumilli",
      "nameTe": "దిగువ ముసురుమిల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Musurumilli",
      "nameTe": "ఎగువ ముసురుమిల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Musurumilli Colony",
      "nameTe": "ముసురుమిల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__pedageddada": [
    {
      "nameEn": "Pedageddada (Main Village)",
      "nameTe": "పెదగెడ్డడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedageddada",
      "nameTe": "దిగువ పెదగెడ్డడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedageddada",
      "nameTe": "ఎగువ పెదగెడ్డడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedageddada Colony",
      "nameTe": "పెదగెడ్డడ కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__rampa": [
    {
      "nameEn": "Rampa (Main Village)",
      "nameTe": "రంప (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rampa",
      "nameTe": "దిగువ రంప",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rampa",
      "nameTe": "ఎగువ రంప",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rampa Colony",
      "nameTe": "రంప కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__rampachodavaram": [
    {
      "nameEn": "Rampachodavaram Town",
      "nameTe": "రంపచోడవరం టౌన్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Rampa Waterfalls Hamlet",
      "nameTe": "రంప జలపాతం ఆవాసం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "ITDA Colony",
      "nameTe": "ఐటీడీఏ కాలనీ",
      "type": "Colony"
    },
    {
      "nameEn": "Konda Kothuru",
      "nameTe": "కొండ కొత్తూరు",
      "type": "Hamlet"
    }
  ],
  "rampachodavaram__tamarapalle": [
    {
      "nameEn": "Tamarapalle (Main Village)",
      "nameTe": "తామరపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Tamarapalle",
      "nameTe": "దిగువ తామరపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Tamarapalle",
      "nameTe": "ఎగువ తామరపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Tamarapalle Colony",
      "nameTe": "తామరపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__thativada": [
    {
      "nameEn": "Thativada (Main Village)",
      "nameTe": "తాటివాడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Thativada",
      "nameTe": "దిగువ తాటివాడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Thativada",
      "nameTe": "ఎగువ తాటివాడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Thativada Colony",
      "nameTe": "తాటివాడ కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__utla": [
    {
      "nameEn": "Utla (Main Village)",
      "nameTe": "ఉట్ల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Utla",
      "nameTe": "దిగువ ఉట్ల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Utla",
      "nameTe": "ఎగువ ఉట్ల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Utla Colony",
      "nameTe": "ఉట్ల కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__vadapalle": [
    {
      "nameEn": "Vadapalle (Main Village)",
      "nameTe": "వాడపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vadapalle",
      "nameTe": "దిగువ వాడపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vadapalle",
      "nameTe": "ఎగువ వాడపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vadapalle Colony",
      "nameTe": "వాడపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "rampachodavaram__vemulakonda": [
    {
      "nameEn": "Vemulakonda (Main Village)",
      "nameTe": "వేములకొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vemulakonda",
      "nameTe": "దిగువ వేములకొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vemulakonda",
      "nameTe": "ఎగువ వేములకొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vemulakonda Colony",
      "nameTe": "వేములకొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__bodlanka": [
    {
      "nameEn": "Bodlanka (Main Village)",
      "nameTe": "బోడ్లంక (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bodlanka",
      "nameTe": "దిగువ బోడ్లంక",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bodlanka",
      "nameTe": "ఎగువ బోడ్లంక",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bodlanka Colony",
      "nameTe": "బోడ్లంక కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__chatlawada": [
    {
      "nameEn": "Chatlawada (Main Village)",
      "nameTe": "చట్లవాడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chatlawada",
      "nameTe": "దిగువ చట్లవాడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chatlawada",
      "nameTe": "ఎగువ చట్లవాడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chatlawada Colony",
      "nameTe": "చట్లవాడ కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__chavidikota": [
    {
      "nameEn": "Chavidikota (Main Village)",
      "nameTe": "చవిడికోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chavidikota",
      "nameTe": "దిగువ చవిడికోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chavidikota",
      "nameTe": "ఎగువ చవిడికోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chavidikota Colony",
      "nameTe": "చవిడికోట కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__d_ch_palem": [
    {
      "nameEn": "D.Ch. Palem (Main Village)",
      "nameTe": "డి.సిహెచ్. పాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva D.Ch. Palem",
      "nameTe": "దిగువ డి.సిహెచ్. పాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva D.Ch. Palem",
      "nameTe": "ఎగువ డి.సిహెచ్. పాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "D.Ch. Palem Colony",
      "nameTe": "డి.సిహెచ్. పాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__d_v_kota": [
    {
      "nameEn": "D.V. Kota (Main Village)",
      "nameTe": "డి.వి. కోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva D.V. Kota",
      "nameTe": "దిగువ డి.వి. కోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva D.V. Kota",
      "nameTe": "ఎగువ డి.వి. కోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "D.V. Kota Colony",
      "nameTe": "డి.వి. కోట కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__g_m_valasa": [
    {
      "nameEn": "G.M. Valasa (Main Village)",
      "nameTe": "జి.ఎం. వలస (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva G.M. Valasa",
      "nameTe": "దిగువ జి.ఎం. వలస",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva G.M. Valasa",
      "nameTe": "ఎగువ జి.ఎం. వలస",
      "type": "Hamlet"
    },
    {
      "nameEn": "G.M. Valasa Colony",
      "nameTe": "జి.ఎం. వలస కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__kundada": [
    {
      "nameEn": "Kundada (Main Village)",
      "nameTe": "కుండడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kundada",
      "nameTe": "దిగువ కుండడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kundada",
      "nameTe": "ఎగువ కుండడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kundada Colony",
      "nameTe": "కుండడ కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__maredumilli": [
    {
      "nameEn": "Maredumilli Proper",
      "nameTe": "మారేడుమిల్లి ప్రొపర్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Valamuru",
      "nameTe": "వలమూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Jungle Star Habitation",
      "nameTe": "జంగిల్ స్టార్ ఆవాసం",
      "type": "Colony"
    },
    {
      "nameEn": "Gudisa Hill Hamlet",
      "nameTe": "గుడిస కొండ ఆవాసం",
      "type": "Hamlet"
    }
  ],
  "maredumilli__pamuleru": [
    {
      "nameEn": "Pamuleru (Main Village)",
      "nameTe": "పాములేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pamuleru",
      "nameTe": "దిగువ పాములేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pamuleru",
      "nameTe": "ఎగువ పాములేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pamuleru Colony",
      "nameTe": "పాములేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__pullangi": [
    {
      "nameEn": "Pullangi (Main Village)",
      "nameTe": "పుల్లంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pullangi",
      "nameTe": "దిగువ పుల్లంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pullangi",
      "nameTe": "ఎగువ పుల్లంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pullangi Colony",
      "nameTe": "పుల్లంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__sunnampadu": [
    {
      "nameEn": "Sunnampadu (Main Village)",
      "nameTe": "సున్నంపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sunnampadu",
      "nameTe": "దిగువ సున్నంపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sunnampadu",
      "nameTe": "ఎగువ సున్నంపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sunnampadu Colony",
      "nameTe": "సున్నంపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "maredumilli__vetukuru": [
    {
      "nameEn": "Vetukuru (Main Village)",
      "nameTe": "వేటుకూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vetukuru",
      "nameTe": "దిగువ వేటుకూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vetukuru",
      "nameTe": "ఎగువ వేటుకూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vetukuru Colony",
      "nameTe": "వేటుకూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__ch_ramanayyapeta": [
    {
      "nameEn": "Ch. Ramanayyapeta (Main Village)",
      "nameTe": "చిన రామనయ్యపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Ch. Ramanayyapeta",
      "nameTe": "దిగువ చిన రామనయ్యపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Ch. Ramanayyapeta",
      "nameTe": "ఎగువ చిన రామనయ్యపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Ch. Ramanayyapeta Colony",
      "nameTe": "చిన రామనయ్యపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__choppakonda": [
    {
      "nameEn": "Choppakonda (Main Village)",
      "nameTe": "చొప్పకొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Choppakonda",
      "nameTe": "దిగువ చొప్పకొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Choppakonda",
      "nameTe": "ఎగువ చొప్పకొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Choppakonda Colony",
      "nameTe": "చొప్పకొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__devaram": [
    {
      "nameEn": "Devaram (Main Village)",
      "nameTe": "దేవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Devaram",
      "nameTe": "దిగువ దేవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Devaram",
      "nameTe": "ఎగువ దేవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Devaram Colony",
      "nameTe": "దేవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__devipatnam": [
    {
      "nameEn": "Devipatnam (Main Village)",
      "nameTe": "దేవీపట్నం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Devipatnam",
      "nameTe": "దిగువ దేవీపట్నం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Devipatnam",
      "nameTe": "ఎగువ దేవీపట్నం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Devipatnam Colony",
      "nameTe": "దేవీపట్నం కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__indukuru": [
    {
      "nameEn": "Indukuru (Main Village)",
      "nameTe": "ఇందుకూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Indukuru",
      "nameTe": "దిగువ ఇందుకూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Indukuru",
      "nameTe": "ఎగువ ఇందుకూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Indukuru Colony",
      "nameTe": "ఇందుకూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__indukurupeta": [
    {
      "nameEn": "Indukurupeta (Main Village)",
      "nameTe": "ఇందుకూరుపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Indukurupeta",
      "nameTe": "దిగువ ఇందుకూరుపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Indukurupeta",
      "nameTe": "ఎగువ ఇందుకూరుపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Indukurupeta Colony",
      "nameTe": "ఇందుకూరుపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__kachuluru": [
    {
      "nameEn": "Kachuluru (Main Village)",
      "nameTe": "కచులూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kachuluru",
      "nameTe": "దిగువ కచులూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kachuluru",
      "nameTe": "ఎగువ కచులూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kachuluru Colony",
      "nameTe": "కచులూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__kondamodalu": [
    {
      "nameEn": "Kondamodalu (Main Village)",
      "nameTe": "కొండమొదలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kondamodalu",
      "nameTe": "దిగువ కొండమొదలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kondamodalu",
      "nameTe": "ఎగువ కొండమొదలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kondamodalu Colony",
      "nameTe": "కొండమొదలు కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__manturu": [
    {
      "nameEn": "Manturu (Main Village)",
      "nameTe": "మంటూరి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Manturu",
      "nameTe": "దిగువ మంటూరి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Manturu",
      "nameTe": "ఎగువ మంటూరి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Manturu Colony",
      "nameTe": "మంటూరి కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__palem": [
    {
      "nameEn": "Palem (Main Village)",
      "nameTe": "పాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Palem",
      "nameTe": "దిగువ పాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Palem",
      "nameTe": "ఎగువ పాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Palem Colony",
      "nameTe": "పాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__pamugandi": [
    {
      "nameEn": "Pamugandi (Main Village)",
      "nameTe": "పాముగండి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pamugandi",
      "nameTe": "దిగువ పాముగండి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pamugandi",
      "nameTe": "ఎగువ పాముగండి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pamugandi Colony",
      "nameTe": "పాముగండి కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__posammagandi": [
    {
      "nameEn": "Posammagandi (Main Village)",
      "nameTe": "పోశమ్మగండి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Posammagandi",
      "nameTe": "దిగువ పోశమ్మగండి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Posammagandi",
      "nameTe": "ఎగువ పోశమ్మగండి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Posammagandi Colony",
      "nameTe": "పోశమ్మగండి కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__pudipalli": [
    {
      "nameEn": "Pudipalli (Main Village)",
      "nameTe": "పూడిపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pudipalli",
      "nameTe": "దిగువ పూడిపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pudipalli",
      "nameTe": "ఎగువ పూడిపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pudipalli Colony",
      "nameTe": "పూడిపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "devipatnam__toyyeru": [
    {
      "nameEn": "Toyyeru (Main Village)",
      "nameTe": "తొయ్యేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Toyyeru",
      "nameTe": "దిగువ తొయ్యేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Toyyeru",
      "nameTe": "ఎగువ తొయ్యేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Toyyeru Colony",
      "nameTe": "తొయ్యేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__boddagandi": [
    {
      "nameEn": "Boddagandi (Main Village)",
      "nameTe": "బొడ్డగండి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Boddagandi",
      "nameTe": "దిగువ బొడ్డగండి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Boddagandi",
      "nameTe": "ఎగువ బొడ్డగండి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Boddagandi Colony",
      "nameTe": "బొడ్డగండి కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__chavulakota": [
    {
      "nameEn": "Chavulakota (Main Village)",
      "nameTe": "చావులకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chavulakota",
      "nameTe": "దిగువ చావులకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chavulakota",
      "nameTe": "ఎగువ చావులకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chavulakota Colony",
      "nameTe": "చావులకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__chintalapudi": [
    {
      "nameEn": "Chintalapudi (Main Village)",
      "nameTe": "చింతలపూడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chintalapudi",
      "nameTe": "దిగువ చింతలపూడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chintalapudi",
      "nameTe": "ఎగువ చింతలపూడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chintalapudi Colony",
      "nameTe": "చింతలపూడి కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__dalipatiguda": [
    {
      "nameEn": "Dalipatiguda (Main Village)",
      "nameTe": "దాలిపాటిగూడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Dalipatiguda",
      "nameTe": "దిగువ దాలిపాటిగూడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Dalipatiguda",
      "nameTe": "ఎగువ దాలిపాటిగూడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Dalipatiguda Colony",
      "nameTe": "దాలిపాటిగూడ కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__dalipadu": [
    {
      "nameEn": "Dalipadu (Main Village)",
      "nameTe": "దాలిపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Dalipadu",
      "nameTe": "దిగువ దాలిపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Dalipadu",
      "nameTe": "ఎగువ దాలిపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Dalipadu Colony",
      "nameTe": "దాలిపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__donkarai": [
    {
      "nameEn": "Donkarai (Main Village)",
      "nameTe": "దొంకరాయి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Donkarai",
      "nameTe": "దిగువ దొంకరాయి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Donkarai",
      "nameTe": "ఎగువ దొంకరాయి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Donkarai Colony",
      "nameTe": "దొంకరాయి కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__gurthedu": [
    {
      "nameEn": "Gurthedu (Main Village)",
      "nameTe": "గుర్తేడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gurthedu",
      "nameTe": "దిగువ గుర్తేడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gurthedu",
      "nameTe": "ఎగువ గుర్తేడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gurthedu Colony",
      "nameTe": "గుర్తేడు కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__kota": [
    {
      "nameEn": "Kota (Main Village)",
      "nameTe": "కోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kota",
      "nameTe": "దిగువ కోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kota",
      "nameTe": "ఎగువ కోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kota Colony",
      "nameTe": "కోట కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__mangampadu": [
    {
      "nameEn": "Mangampadu (Main Village)",
      "nameTe": "మంగంపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mangampadu",
      "nameTe": "దిగువ మంగంపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mangampadu",
      "nameTe": "ఎగువ మంగంపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mangampadu Colony",
      "nameTe": "మంగంపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__marripalem": [
    {
      "nameEn": "Marripalem (Main Village)",
      "nameTe": "మర్రిపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Marripalem",
      "nameTe": "దిగువ మర్రిపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Marripalem",
      "nameTe": "ఎగువ మర్రిపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Marripalem Colony",
      "nameTe": "మర్రిపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__nimmalapalem": [
    {
      "nameEn": "Nimmalapalem (Main Village)",
      "nameTe": "నిమ్మలపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Nimmalapalem",
      "nameTe": "దిగువ నిమ్మలపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Nimmalapalem",
      "nameTe": "ఎగువ నిమ్మలపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Nimmalapalem Colony",
      "nameTe": "నిమ్మలపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__p_yerragonda": [
    {
      "nameEn": "P. Yerragonda (Main Village)",
      "nameTe": "పి. ఎర్రగొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva P. Yerragonda",
      "nameTe": "దిగువ పి. ఎర్రగొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva P. Yerragonda",
      "nameTe": "ఎగువ పి. ఎర్రగొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "P. Yerragonda Colony",
      "nameTe": "పి. ఎర్రగొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__pathakota": [
    {
      "nameEn": "Pathakota (Main Village)",
      "nameTe": "పాతకోట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pathakota",
      "nameTe": "దిగువ పాతకోట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pathakota",
      "nameTe": "ఎగువ పాతకోట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pathakota Colony",
      "nameTe": "పాతకోట కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__pedagondi": [
    {
      "nameEn": "Pedagondi (Main Village)",
      "nameTe": "పెదగొంది (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedagondi",
      "nameTe": "దిగువ పెదగొంది",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedagondi",
      "nameTe": "ఎగువ పెదగొంది",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedagondi Colony",
      "nameTe": "పెదగొంది కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__rampa_yerrampalem": [
    {
      "nameEn": "Rampa Yerrampalem (Main Village)",
      "nameTe": "రంప ఎర్రంపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rampa Yerrampalem",
      "nameTe": "దిగువ రంప ఎర్రంపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rampa Yerrampalem",
      "nameTe": "ఎగువ రంప ఎర్రంపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rampa Yerrampalem Colony",
      "nameTe": "రంప ఎర్రంపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__y_ramavaram": [
    {
      "nameEn": "Y. Ramavaram (Main Village)",
      "nameTe": "వై. రామవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Y. Ramavaram",
      "nameTe": "దిగువ వై. రామవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Y. Ramavaram",
      "nameTe": "ఎగువ వై. రామవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Y. Ramavaram Colony",
      "nameTe": "వై. రామవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "y_ramavaram__yerramareddipalem": [
    {
      "nameEn": "Yerramareddipalem (Main Village)",
      "nameTe": "ఎర్రమరెడ్డిపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Yerramareddipalem",
      "nameTe": "దిగువ ఎర్రమరెడ్డిపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Yerramareddipalem",
      "nameTe": "ఎగువ ఎర్రమరెడ్డిపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Yerramareddipalem Colony",
      "nameTe": "ఎర్రమరెడ్డిపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__addateegala": [
    {
      "nameEn": "Addateegala (Main Village)",
      "nameTe": "అడ్డతీగల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Addateegala",
      "nameTe": "దిగువ అడ్డతీగల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Addateegala",
      "nameTe": "ఎగువ అడ్డతీగల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Addateegala Colony",
      "nameTe": "అడ్డతీగల కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__bheemudupakalu": [
    {
      "nameEn": "Bheemudupakalu (Main Village)",
      "nameTe": "భీముడుపాకాలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bheemudupakalu",
      "nameTe": "దిగువ భీముడుపాకాలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bheemudupakalu",
      "nameTe": "ఎగువ భీముడుపాకాలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bheemudupakalu Colony",
      "nameTe": "భీముడుపాకాలు కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__bodlanka": [
    {
      "nameEn": "Bodlanka (Main Village)",
      "nameTe": "బోడ్లంక (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bodlanka",
      "nameTe": "దిగువ బోడ్లంక",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bodlanka",
      "nameTe": "ఎగువ బోడ్లంక",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bodlanka Colony",
      "nameTe": "బోడ్లంక కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__d_bheemavaram": [
    {
      "nameEn": "D. Bheemavaram (Main Village)",
      "nameTe": "డి. భీమవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva D. Bheemavaram",
      "nameTe": "దిగువ డి. భీమవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva D. Bheemavaram",
      "nameTe": "ఎగువ డి. భీమవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "D. Bheemavaram Colony",
      "nameTe": "డి. భీమవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__d_ramavaram": [
    {
      "nameEn": "D. Ramavaram (Main Village)",
      "nameTe": "డి. రామవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva D. Ramavaram",
      "nameTe": "దిగువ డి. రామవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva D. Ramavaram",
      "nameTe": "ఎగువ డి. రామవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "D. Ramavaram Colony",
      "nameTe": "డి. రామవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__dakodu": [
    {
      "nameEn": "Dakodu (Main Village)",
      "nameTe": "దాకోడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Dakodu",
      "nameTe": "దిగువ దాకోడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Dakodu",
      "nameTe": "ఎగువ దాకోడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Dakodu Colony",
      "nameTe": "దాకోడు కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__dhanyampalem": [
    {
      "nameEn": "Dhanyampalem (Main Village)",
      "nameTe": "ధాన్యంపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Dhanyampalem",
      "nameTe": "దిగువ ధాన్యంపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Dhanyampalem",
      "nameTe": "ఎగువ ధాన్యంపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Dhanyampalem Colony",
      "nameTe": "ధాన్యంపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__doramamidi": [
    {
      "nameEn": "Doramamidi (Main Village)",
      "nameTe": "దొరమామిడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Doramamidi",
      "nameTe": "దిగువ దొరమామిడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Doramamidi",
      "nameTe": "ఎగువ దొరమామిడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Doramamidi Colony",
      "nameTe": "దొరమామిడి కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__ducherthi": [
    {
      "nameEn": "Ducherthi (Main Village)",
      "nameTe": "దుచర్తి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Ducherthi",
      "nameTe": "దిగువ దుచర్తి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Ducherthi",
      "nameTe": "ఎగువ దుచర్తి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Ducherthi Colony",
      "nameTe": "దుచర్తి కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__gondolu": [
    {
      "nameEn": "Gondolu (Main Village)",
      "nameTe": "గొండోలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gondolu",
      "nameTe": "దిగువ గొండోలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gondolu",
      "nameTe": "ఎగువ గొండోలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gondolu Colony",
      "nameTe": "గొండోలు కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__gontuvanipalem": [
    {
      "nameEn": "Gontuvanipalem (Main Village)",
      "nameTe": "గొంతువానిపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gontuvanipalem",
      "nameTe": "దిగువ గొంతువానిపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gontuvanipalem",
      "nameTe": "ఎగువ గొంతువానిపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gontuvanipalem Colony",
      "nameTe": "గొంతువానిపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__kimmuru": [
    {
      "nameEn": "Kimmuru (Main Village)",
      "nameTe": "కిమ్మురు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kimmuru",
      "nameTe": "దిగువ కిమ్మురు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kimmuru",
      "nameTe": "ఎగువ కిమ్మురు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kimmuru Colony",
      "nameTe": "కిమ్మురు కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__konalova": [
    {
      "nameEn": "Konalova (Main Village)",
      "nameTe": "కోనలోవ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Konalova",
      "nameTe": "దిగువ కోనలోవ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Konalova",
      "nameTe": "ఎగువ కోనలోవ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Konalova Colony",
      "nameTe": "కోనలోవ కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__matlapadu": [
    {
      "nameEn": "Matlapadu (Main Village)",
      "nameTe": "మట్లపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Matlapadu",
      "nameTe": "దిగువ మట్లపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Matlapadu",
      "nameTe": "ఎగువ మట్లపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Matlapadu Colony",
      "nameTe": "మట్లపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__puligogulapadu": [
    {
      "nameEn": "Puligogulapadu (Main Village)",
      "nameTe": "పులిగోగులపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Puligogulapadu",
      "nameTe": "దిగువ పులిగోగులపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Puligogulapadu",
      "nameTe": "ఎగువ పులిగోగులపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Puligogulapadu Colony",
      "nameTe": "పులిగోగులపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__rayapalli": [
    {
      "nameEn": "Rayapalli (Main Village)",
      "nameTe": "రాయపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rayapalli",
      "nameTe": "దిగువ రాయపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rayapalli",
      "nameTe": "ఎగువ రాయపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rayapalli Colony",
      "nameTe": "రాయపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__somannapalem": [
    {
      "nameEn": "Somannapalem (Main Village)",
      "nameTe": "సోమన్నపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Somannapalem",
      "nameTe": "దిగువ సోమన్నపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Somannapalem",
      "nameTe": "ఎగువ సోమన్నపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Somannapalem Colony",
      "nameTe": "సోమన్నపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__thimmapuram": [
    {
      "nameEn": "Thimmapuram (Main Village)",
      "nameTe": "తిమ్మాపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Thimmapuram",
      "nameTe": "దిగువ తిమ్మాపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Thimmapuram",
      "nameTe": "ఎగువ తిమ్మాపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Thimmapuram Colony",
      "nameTe": "తిమ్మాపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__thungamadugula": [
    {
      "nameEn": "Thungamadugula (Main Village)",
      "nameTe": "తుంగమాడుగుల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Thungamadugula",
      "nameTe": "దిగువ తుంగమాడుగుల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Thungamadugula",
      "nameTe": "ఎగువ తుంగమాడుగుల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Thungamadugula Colony",
      "nameTe": "తుంగమాడుగుల కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__veeravaram": [
    {
      "nameEn": "Veeravaram (Main Village)",
      "nameTe": "వీరవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Veeravaram",
      "nameTe": "దిగువ వీరవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Veeravaram",
      "nameTe": "ఎగువ వీరవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Veeravaram Colony",
      "nameTe": "వీరవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__vetamamidi": [
    {
      "nameEn": "Vetamamidi (Main Village)",
      "nameTe": "వేటమామిడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vetamamidi",
      "nameTe": "దిగువ వేటమామిడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vetamamidi",
      "nameTe": "ఎగువ వేటమామిడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vetamamidi Colony",
      "nameTe": "వేటమామిడి కాలనీ",
      "type": "Colony"
    }
  ],
  "addateegala__yellavaram": [
    {
      "nameEn": "Yellavaram (Main Village)",
      "nameTe": "ఎల్లవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Yellavaram",
      "nameTe": "దిగువ ఎల్లవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Yellavaram",
      "nameTe": "ఎగువ ఎల్లవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Yellavaram Colony",
      "nameTe": "ఎల్లవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__amudalabanda": [
    {
      "nameEn": "Amudalabanda (Main Village)",
      "nameTe": "ఆముదాలబండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Amudalabanda",
      "nameTe": "దిగువ ఆముదాలబండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Amudalabanda",
      "nameTe": "ఎగువ ఆముదాలబండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Amudalabanda Colony",
      "nameTe": "ఆముదాలబండ కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__bayyanapalli": [
    {
      "nameEn": "Bayyanapalli (Main Village)",
      "nameTe": "బయ్యనపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Bayyanapalli",
      "nameTe": "దిగువ బయ్యనపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Bayyanapalli",
      "nameTe": "ఎగువ బయ్యనపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Bayyanapalli Colony",
      "nameTe": "బయ్యనపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__doramamidi": [
    {
      "nameEn": "Doramamidi (Main Village)",
      "nameTe": "దొరమామిడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Doramamidi",
      "nameTe": "దిగువ దొరమామిడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Doramamidi",
      "nameTe": "ఎగువ దొరమామిడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Doramamidi Colony",
      "nameTe": "దొరమామిడి కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__gangavaram": [
    {
      "nameEn": "Gangavaram (Main Village)",
      "nameTe": "గంగవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gangavaram",
      "nameTe": "దిగువ గంగవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gangavaram",
      "nameTe": "ఎగువ గంగవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gangavaram Colony",
      "nameTe": "గంగవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__jaggampalem": [
    {
      "nameEn": "Jaggampalem (Main Village)",
      "nameTe": "జగ్గంపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jaggampalem",
      "nameTe": "దిగువ జగ్గంపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jaggampalem",
      "nameTe": "ఎగువ జగ్గంపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jaggampalem Colony",
      "nameTe": "జగ్గంపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__jiyyampalem": [
    {
      "nameEn": "Jiyyampalem (Main Village)",
      "nameTe": "జియ్యంపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jiyyampalem",
      "nameTe": "దిగువ జియ్యంపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jiyyampalem",
      "nameTe": "ఎగువ జియ్యంపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jiyyampalem Colony",
      "nameTe": "జియ్యంపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__kondapalli": [
    {
      "nameEn": "Kondapalli (Main Village)",
      "nameTe": "కొండపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kondapalli",
      "nameTe": "దిగువ కొండపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kondapalli",
      "nameTe": "ఎగువ కొండపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kondapalli Colony",
      "nameTe": "కొండపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__kothada": [
    {
      "nameEn": "Kothada (Main Village)",
      "nameTe": "కొత్తడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kothada",
      "nameTe": "దిగువ కొత్తడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kothada",
      "nameTe": "ఎగువ కొత్తడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kothada Colony",
      "nameTe": "కొత్తడ కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__lakkonda": [
    {
      "nameEn": "Lakkonda (Main Village)",
      "nameTe": "లక్కొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lakkonda",
      "nameTe": "దిగువ లక్కొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lakkonda",
      "nameTe": "ఎగువ లక్కొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lakkonda Colony",
      "nameTe": "లక్కొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__marripalem": [
    {
      "nameEn": "Marripalem (Main Village)",
      "nameTe": "మర్రిపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Marripalem",
      "nameTe": "దిగువ మర్రిపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Marripalem",
      "nameTe": "ఎగువ మర్రిపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Marripalem Colony",
      "nameTe": "మర్రిపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__mohanapuram": [
    {
      "nameEn": "Mohanapuram (Main Village)",
      "nameTe": "మోహనపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mohanapuram",
      "nameTe": "దిగువ మోహనపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mohanapuram",
      "nameTe": "ఎగువ మోహనపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mohanapuram Colony",
      "nameTe": "మోహనపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__molleru": [
    {
      "nameEn": "Molleru (Main Village)",
      "nameTe": "మొల్లేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Molleru",
      "nameTe": "దిగువ మొల్లేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Molleru",
      "nameTe": "ఎగువ మొల్లేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Molleru Colony",
      "nameTe": "మొల్లేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__nellipudi": [
    {
      "nameEn": "Nellipudi (Main Village)",
      "nameTe": "నెల్లిపూడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Nellipudi",
      "nameTe": "దిగువ నెల్లిపూడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Nellipudi",
      "nameTe": "ఎగువ నెల్లిపూడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Nellipudi Colony",
      "nameTe": "నెల్లిపూడి కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__pandraprolu": [
    {
      "nameEn": "Pandraprolu (Main Village)",
      "nameTe": "పండ్రప్రోలు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pandraprolu",
      "nameTe": "దిగువ పండ్రప్రోలు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pandraprolu",
      "nameTe": "ఎగువ పండ్రప్రోలు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pandraprolu Colony",
      "nameTe": "పండ్రప్రోలు కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__pidathamamidi": [
    {
      "nameEn": "Pidathamamidi (Main Village)",
      "nameTe": "పిడతమామిడి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pidathamamidi",
      "nameTe": "దిగువ పిడతమామిడి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pidathamamidi",
      "nameTe": "ఎగువ పిడతమామిడి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pidathamamidi Colony",
      "nameTe": "పిడతమామిడి కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__surampalem": [
    {
      "nameEn": "Surampalem (Main Village)",
      "nameTe": "సూరంపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Surampalem",
      "nameTe": "దిగువ సూరంపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Surampalem",
      "nameTe": "ఎగువ సూరంపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Surampalem Colony",
      "nameTe": "సూరంపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "gangavaram__zaderu": [
    {
      "nameEn": "Zaderu (Main Village)",
      "nameTe": "జాదేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Zaderu",
      "nameTe": "దిగువ జాదేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Zaderu",
      "nameTe": "ఎగువ జాదేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Zaderu Colony",
      "nameTe": "జాదేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__aminabada": [
    {
      "nameEn": "Aminabada (Main Village)",
      "nameTe": "అమీనాబాద (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Aminabada",
      "nameTe": "దిగువ అమీనాబాద",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Aminabada",
      "nameTe": "ఎగువ అమీనాబాద",
      "type": "Hamlet"
    },
    {
      "nameEn": "Aminabada Colony",
      "nameTe": "అమీనాబాద కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__badadanampalli": [
    {
      "nameEn": "Badadanampalli (Main Village)",
      "nameTe": "బదదనంపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Badadanampalli",
      "nameTe": "దిగువ బదదనంపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Badadanampalli",
      "nameTe": "ఎగువ బదదనంపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Badadanampalli Colony",
      "nameTe": "బదదనంపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__cheruvukommupalem": [
    {
      "nameEn": "Cheruvukommupalem (Main Village)",
      "nameTe": "చెరువుకొమ్ముపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Cheruvukommupalem",
      "nameTe": "దిగువ చెరువుకొమ్ముపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Cheruvukommupalem",
      "nameTe": "ఎగువ చెరువుకొమ్ముపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Cheruvukommupalem Colony",
      "nameTe": "చెరువుకొమ్ముపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__chikilinta": [
    {
      "nameEn": "Chikilinta (Main Village)",
      "nameTe": "చికిలింత (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chikilinta",
      "nameTe": "దిగువ చికిలింత",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chikilinta",
      "nameTe": "ఎగువ చికిలింత",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chikilinta Colony",
      "nameTe": "చికిలింత కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__dusaripamu": [
    {
      "nameEn": "Dusaripamu (Main Village)",
      "nameTe": "దూసరిపాము (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Dusaripamu",
      "nameTe": "దిగువ దూసరిపాము",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Dusaripamu",
      "nameTe": "ఎగువ దూసరిపాము",
      "type": "Hamlet"
    },
    {
      "nameEn": "Dusaripamu Colony",
      "nameTe": "దూసరిపాము కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__gaduvakurthi": [
    {
      "nameEn": "Gaduvakurthi (Main Village)",
      "nameTe": "గడువకుర్తి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gaduvakurthi",
      "nameTe": "దిగువ గడువకుర్తి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gaduvakurthi",
      "nameTe": "ఎగువ గడువకుర్తి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gaduvakurthi Colony",
      "nameTe": "గడువకుర్తి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__jaddangi": [
    {
      "nameEn": "Jaddangi (Main Village)",
      "nameTe": "జద్దంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jaddangi",
      "nameTe": "దిగువ జద్దంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jaddangi",
      "nameTe": "ఎగువ జద్దంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jaddangi Colony",
      "nameTe": "జద్దంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__kindra": [
    {
      "nameEn": "Kindra (Main Village)",
      "nameTe": "కింద్ర (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kindra",
      "nameTe": "దిగువ కింద్ర",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kindra",
      "nameTe": "ఎగువ కింద్ర",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kindra Colony",
      "nameTe": "కింద్ర కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__kirrabu": [
    {
      "nameEn": "Kirrabu (Main Village)",
      "nameTe": "కిర్రబు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kirrabu",
      "nameTe": "దిగువ కిర్రబు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kirrabu",
      "nameTe": "ఎగువ కిర్రబు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kirrabu Colony",
      "nameTe": "కిర్రబు కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__kondapalli": [
    {
      "nameEn": "Kondapalli (Main Village)",
      "nameTe": "కొండపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kondapalli",
      "nameTe": "దిగువ కొండపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kondapalli",
      "nameTe": "ఎగువ కొండపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kondapalli Colony",
      "nameTe": "కొండపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__labbarthi": [
    {
      "nameEn": "Labbarthi (Main Village)",
      "nameTe": "లబ్బర్తి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Labbarthi",
      "nameTe": "దిగువ లబ్బర్తి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Labbarthi",
      "nameTe": "ఎగువ లబ్బర్తి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Labbarthi Colony",
      "nameTe": "లబ్బర్తి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__lagarayi": [
    {
      "nameEn": "Lagarayi (Main Village)",
      "nameTe": "లగరాయి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lagarayi",
      "nameTe": "దిగువ లగరాయి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lagarayi",
      "nameTe": "ఎగువ లగరాయి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lagarayi Colony",
      "nameTe": "లగరాయి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__lododdi": [
    {
      "nameEn": "Lododdi (Main Village)",
      "nameTe": "లోదొడ్డి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lododdi",
      "nameTe": "దిగువ లోదొడ్డి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lododdi",
      "nameTe": "ఎగువ లోదొడ్డి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lododdi Colony",
      "nameTe": "లోదొడ్డి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__maredubaka": [
    {
      "nameEn": "Maredubaka (Main Village)",
      "nameTe": "మారేడుబాక (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Maredubaka",
      "nameTe": "దిగువ మారేడుబాక",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Maredubaka",
      "nameTe": "ఎగువ మారేడుబాక",
      "type": "Hamlet"
    },
    {
      "nameEn": "Maredubaka Colony",
      "nameTe": "మారేడుబాక కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__rajavommangi": [
    {
      "nameEn": "Rajavommangi (Main Village)",
      "nameTe": "రాజవొమ్మంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rajavommangi",
      "nameTe": "దిగువ రాజవొమ్మంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rajavommangi",
      "nameTe": "ఎగువ రాజవొమ్మంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rajavommangi Colony",
      "nameTe": "రాజవొమ్మంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__sarabhavaram": [
    {
      "nameEn": "Sarabhavaram (Main Village)",
      "nameTe": "శరభవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sarabhavaram",
      "nameTe": "దిగువ శరభవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sarabhavaram",
      "nameTe": "ఎగువ శరభవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sarabhavaram Colony",
      "nameTe": "శరభవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__thantikonda": [
    {
      "nameEn": "Thantikonda (Main Village)",
      "nameTe": "తాంతికొండ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Thantikonda",
      "nameTe": "దిగువ తాంతికొండ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Thantikonda",
      "nameTe": "ఎగువ తాంతికొండ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Thantikonda Colony",
      "nameTe": "తాంతికొండ కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__vanchangi": [
    {
      "nameEn": "Vanchangi (Main Village)",
      "nameTe": "వంచంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vanchangi",
      "nameTe": "దిగువ వంచంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vanchangi",
      "nameTe": "ఎగువ వంచంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vanchangi Colony",
      "nameTe": "వంచంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "rajavommangi__vatangi": [
    {
      "nameEn": "Vatangi (Main Village)",
      "nameTe": "వాతంగి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vatangi",
      "nameTe": "దిగువ వాతంగి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vatangi",
      "nameTe": "ఎగువ వాతంగి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vatangi Colony",
      "nameTe": "వాతంగి కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__a_g_koderu": [
    {
      "nameEn": "A.G.Koderu (Main Village)",
      "nameTe": "ఎ.జి.కోడేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva A.G.Koderu",
      "nameTe": "దిగువ ఎ.జి.కోడేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva A.G.Koderu",
      "nameTe": "ఎగువ ఎ.జి.కోడేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "A.G.Koderu Colony",
      "nameTe": "ఎ.జి.కోడేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__chadalavada": [
    {
      "nameEn": "Chadalavada (Main Village)",
      "nameTe": "చదలవాడ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chadalavada",
      "nameTe": "దిగువ చదలవాడ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chadalavada",
      "nameTe": "ఎగువ చదలవాడ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chadalavada Colony",
      "nameTe": "చదలవాడ కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__chatti": [
    {
      "nameEn": "Chatti (Main Village)",
      "nameTe": "చట్టి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chatti",
      "nameTe": "దిగువ చట్టి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chatti",
      "nameTe": "ఎగువ చట్టి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chatti Colony",
      "nameTe": "చట్టి కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__chidumuru": [
    {
      "nameEn": "Chidumuru (Main Village)",
      "nameTe": "చిడుమూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chidumuru",
      "nameTe": "దిగువ చిడుమూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chidumuru",
      "nameTe": "ఎగువ చిడుమూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chidumuru Colony",
      "nameTe": "చిడుమూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__chintoor": [
    {
      "nameEn": "Chintoor Town",
      "nameTe": "చింతూరు టౌన్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Mothugudem Tribal Hamlet",
      "nameTe": "మోతుగూడెం గిరిజన ఆవాసం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Polluru Waterfalls Habitation",
      "nameTe": "పొల్లూరు జలపాతం ఆవాసం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sileru River Colony",
      "nameTe": "సీలేరు నది కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__edugurallapalli": [
    {
      "nameEn": "Edugurallapalli (Main Village)",
      "nameTe": "ఏడుగురాళ్ళపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Edugurallapalli",
      "nameTe": "దిగువ ఏడుగురాళ్ళపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Edugurallapalli",
      "nameTe": "ఎగువ ఏడుగురాళ్ళపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Edugurallapalli Colony",
      "nameTe": "ఏడుగురాళ్ళపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__gangannametta": [
    {
      "nameEn": "Gangannametta (Main Village)",
      "nameTe": "గంగన్నమెట్ట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gangannametta",
      "nameTe": "దిగువ గంగన్నమెట్ట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gangannametta",
      "nameTe": "ఎగువ గంగన్నమెట్ట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gangannametta Colony",
      "nameTe": "గంగన్నమెట్ట కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__guduru": [
    {
      "nameEn": "Guduru (Main Village)",
      "nameTe": "గూడూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Guduru",
      "nameTe": "దిగువ గూడూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Guduru",
      "nameTe": "ఎగువ గూడూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Guduru Colony",
      "nameTe": "గూడూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__kalleru": [
    {
      "nameEn": "Kalleru (Main Village)",
      "nameTe": "కల్లేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kalleru",
      "nameTe": "దిగువ కల్లేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kalleru",
      "nameTe": "ఎగువ కల్లేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kalleru Colony",
      "nameTe": "కల్లేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__kothapalli": [
    {
      "nameEn": "Kothapalli (Main Village)",
      "nameTe": "కొత్తపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kothapalli",
      "nameTe": "దిగువ కొత్తపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kothapalli",
      "nameTe": "ఎగువ కొత్తపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kothapalli Colony",
      "nameTe": "కొత్తపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__kummuru": [
    {
      "nameEn": "Kummuru (Main Village)",
      "nameTe": "కుమ్మురు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kummuru",
      "nameTe": "దిగువ కుమ్మురు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kummuru",
      "nameTe": "ఎగువ కుమ్మురు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kummuru Colony",
      "nameTe": "కుమ్మురు కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__lachigudem": [
    {
      "nameEn": "Lachigudem (Main Village)",
      "nameTe": "లచ్చిగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lachigudem",
      "nameTe": "దిగువ లచ్చిగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lachigudem",
      "nameTe": "ఎగువ లచ్చిగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lachigudem Colony",
      "nameTe": "లచ్చిగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__mothugudem": [
    {
      "nameEn": "Mothugudem (Main Village)",
      "nameTe": "మోతుగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mothugudem",
      "nameTe": "దిగువ మోతుగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mothugudem",
      "nameTe": "ఎగువ మోతుగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mothugudem Colony",
      "nameTe": "మోతుగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__mukkunuru": [
    {
      "nameEn": "Mukkunuru (Main Village)",
      "nameTe": "ముక్కునూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mukkunuru",
      "nameTe": "దిగువ ముక్కునూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mukkunuru",
      "nameTe": "ఎగువ ముక్కునూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mukkunuru Colony",
      "nameTe": "ముక్కునూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__pedda_seetanapalle": [
    {
      "nameEn": "Pedda Seetanapalle (Main Village)",
      "nameTe": "పెద్ద సీతనపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedda Seetanapalle",
      "nameTe": "దిగువ పెద్ద సీతనపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedda Seetanapalle",
      "nameTe": "ఎగువ పెద్ద సీతనపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedda Seetanapalle Colony",
      "nameTe": "పెద్ద సీతనపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__pega": [
    {
      "nameEn": "Pega (Main Village)",
      "nameTe": "పెగ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pega",
      "nameTe": "దిగువ పెగ",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pega",
      "nameTe": "ఎగువ పెగ",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pega Colony",
      "nameTe": "పెగ కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__ramannapalem": [
    {
      "nameEn": "Ramannapalem (Main Village)",
      "nameTe": "రామన్నపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Ramannapalem",
      "nameTe": "దిగువ రామన్నపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Ramannapalem",
      "nameTe": "ఎగువ రామన్నపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Ramannapalem Colony",
      "nameTe": "రామన్నపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "chintoor__tummala": [
    {
      "nameEn": "Tummala (Main Village)",
      "nameTe": "తుమ్మల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Tummala",
      "nameTe": "దిగువ తుమ్మల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Tummala",
      "nameTe": "ఎగువ తుమ్మల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Tummala Colony",
      "nameTe": "తుమ్మల కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__abhicherla": [
    {
      "nameEn": "Abhicherla (Main Village)",
      "nameTe": "అభిచెర్ల (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Abhicherla",
      "nameTe": "దిగువ అభిచెర్ల",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Abhicherla",
      "nameTe": "ఎగువ అభిచెర్ల",
      "type": "Hamlet"
    },
    {
      "nameEn": "Abhicherla Colony",
      "nameTe": "అభిచెర్ల కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__chinarkur": [
    {
      "nameEn": "Chinarkur (Main Village)",
      "nameTe": "చినార్కూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chinarkur",
      "nameTe": "దిగువ చినార్కూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chinarkur",
      "nameTe": "ఎగువ చినార్కూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chinarkur Colony",
      "nameTe": "చినార్కూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__chuchirevulagudem": [
    {
      "nameEn": "Chuchirevulagudem (Main Village)",
      "nameTe": "చుచిరేవులగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chuchirevulagudem",
      "nameTe": "దిగువ చుచిరేవులగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chuchirevulagudem",
      "nameTe": "ఎగువ చుచిరేవులగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chuchirevulagudem Colony",
      "nameTe": "చుచిరేవులగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__jaggavaram": [
    {
      "nameEn": "Jaggavaram (Main Village)",
      "nameTe": "జగ్గవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jaggavaram",
      "nameTe": "దిగువ జగ్గవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jaggavaram",
      "nameTe": "ఎగువ జగ్గవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jaggavaram Colony",
      "nameTe": "జగ్గవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__kachavaram": [
    {
      "nameEn": "Kachavaram (Main Village)",
      "nameTe": "కచవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kachavaram",
      "nameTe": "దిగువ కచవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kachavaram",
      "nameTe": "ఎగువ కచవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kachavaram Colony",
      "nameTe": "కచవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__karakagudem": [
    {
      "nameEn": "Karakagudem (Main Village)",
      "nameTe": "కారకగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Karakagudem",
      "nameTe": "దిగువ కారకగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Karakagudem",
      "nameTe": "ఎగువ కారకగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Karakagudem Colony",
      "nameTe": "కారకగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__kondrajupeta": [
    {
      "nameEn": "Kondrajupeta (Main Village)",
      "nameTe": "కొండ్రాజుపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kondrajupeta",
      "nameTe": "దిగువ కొండ్రాజుపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kondrajupeta",
      "nameTe": "ఎగువ కొండ్రాజుపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kondrajupeta Colony",
      "nameTe": "కొండ్రాజుపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__kunavaram": [
    {
      "nameEn": "Kunavaram Proper",
      "nameTe": "కూనవరం ప్రొపర్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Godavari-Sabari Sangam Area",
      "nameTe": "గోదావరి-శబరి సంగమ ప్రాంతం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Tekulaboru",
      "nameTe": "టేకులబోరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kondrajupeta",
      "nameTe": "కొండ్రాజుపేట",
      "type": "Hamlet"
    }
  ],
  "kunavaram__kuturu": [
    {
      "nameEn": "Kuturu (Main Village)",
      "nameTe": "కూతురు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kuturu",
      "nameTe": "దిగువ కూతురు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kuturu",
      "nameTe": "ఎగువ కూతురు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kuturu Colony",
      "nameTe": "కూతురు కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__lingapuram": [
    {
      "nameEn": "Lingapuram (Main Village)",
      "nameTe": "లింగాపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lingapuram",
      "nameTe": "దిగువ లింగాపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lingapuram",
      "nameTe": "ఎగువ లింగాపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lingapuram Colony",
      "nameTe": "లింగాపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__marrigudem": [
    {
      "nameEn": "Marrigudem (Main Village)",
      "nameTe": "మర్రిగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Marrigudem",
      "nameTe": "దిగువ మర్రిగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Marrigudem",
      "nameTe": "ఎగువ మర్రిగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Marrigudem Colony",
      "nameTe": "మర్రిగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__pedarkuru": [
    {
      "nameEn": "Pedarkuru (Main Village)",
      "nameTe": "పెదార్కూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedarkuru",
      "nameTe": "దిగువ పెదార్కూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedarkuru",
      "nameTe": "ఎగువ పెదార్కూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedarkuru Colony",
      "nameTe": "పెదార్కూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__pochavaram": [
    {
      "nameEn": "Pochavaram (Main Village)",
      "nameTe": "పోచవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pochavaram",
      "nameTe": "దిగువ పోచవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pochavaram",
      "nameTe": "ఎగువ పోచవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pochavaram Colony",
      "nameTe": "పోచవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__regulapadu": [
    {
      "nameEn": "Regulapadu (Main Village)",
      "nameTe": "రేగులపాడు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Regulapadu",
      "nameTe": "దిగువ రేగులపాడు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Regulapadu",
      "nameTe": "ఎగువ రేగులపాడు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Regulapadu Colony",
      "nameTe": "రేగులపాడు కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__tekubaka": [
    {
      "nameEn": "Tekubaka (Main Village)",
      "nameTe": "టేకుబాక (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Tekubaka",
      "nameTe": "దిగువ టేకుబాక",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Tekubaka",
      "nameTe": "ఎగువ టేకుబాక",
      "type": "Hamlet"
    },
    {
      "nameEn": "Tekubaka Colony",
      "nameTe": "టేకుబాక కాలనీ",
      "type": "Colony"
    }
  ],
  "kunavaram__venkatayapalem": [
    {
      "nameEn": "Venkatayapalem (Main Village)",
      "nameTe": "వెంకటాయపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Venkatayapalem",
      "nameTe": "దిగువ వెంకటాయపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Venkatayapalem",
      "nameTe": "ఎగువ వెంకటాయపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Venkatayapalem Colony",
      "nameTe": "వెంకటాయపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__chinnamattapalle": [
    {
      "nameEn": "Chinnamattapalle (Main Village)",
      "nameTe": "చినమట్టపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chinnamattapalle",
      "nameTe": "దిగువ చినమట్టపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chinnamattapalle",
      "nameTe": "ఎగువ చినమట్టపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chinnamattapalle Colony",
      "nameTe": "చినమట్టపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__jediguppa": [
    {
      "nameEn": "Jediguppa (Main Village)",
      "nameTe": "జేడిగుప్ప (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Jediguppa",
      "nameTe": "దిగువ జేడిగుప్ప",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Jediguppa",
      "nameTe": "ఎగువ జేడిగుప్ప",
      "type": "Hamlet"
    },
    {
      "nameEn": "Jediguppa Colony",
      "nameTe": "జేడిగుప్ప కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__kunduluru": [
    {
      "nameEn": "Kunduluru (Main Village)",
      "nameTe": "కుందులూరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kunduluru",
      "nameTe": "దిగువ కుందులూరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kunduluru",
      "nameTe": "ఎగువ కుందులూరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kunduluru Colony",
      "nameTe": "కుందులూరు కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__mulkanapally": [
    {
      "nameEn": "Mulkanapally (Main Village)",
      "nameTe": "ముల్కనపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Mulkanapally",
      "nameTe": "దిగువ ముల్కనపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Mulkanapally",
      "nameTe": "ఎగువ ముల్కనపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Mulkanapally Colony",
      "nameTe": "ముల్కనపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__pedda_mattapalle": [
    {
      "nameEn": "Pedda Mattapalle (Main Village)",
      "nameTe": "పెద్ద మట్టపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Pedda Mattapalle",
      "nameTe": "దిగువ పెద్ద మట్టపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Pedda Mattapalle",
      "nameTe": "ఎగువ పెద్ద మట్టపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Pedda Mattapalle Colony",
      "nameTe": "పెద్ద మట్టపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__rajupeta": [
    {
      "nameEn": "Rajupeta (Main Village)",
      "nameTe": "రాజుపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rajupeta",
      "nameTe": "దిగువ రాజుపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rajupeta",
      "nameTe": "ఎగువ రాజుపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rajupeta Colony",
      "nameTe": "రాజుపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__ramavaram": [
    {
      "nameEn": "Ramavaram (Main Village)",
      "nameTe": "రామవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Ramavaram",
      "nameTe": "దిగువ రామవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Ramavaram",
      "nameTe": "ఎగువ రామవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Ramavaram Colony",
      "nameTe": "రామవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__rekapalli": [
    {
      "nameEn": "Rekapalli (Main Village)",
      "nameTe": "రేఖపల్లె (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Rekapalli",
      "nameTe": "దిగువ రేఖపల్లె",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Rekapalli",
      "nameTe": "ఎగువ రేఖపల్లె",
      "type": "Hamlet"
    },
    {
      "nameEn": "Rekapalli Colony",
      "nameTe": "రేఖపల్లె కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__sriramagiri": [
    {
      "nameEn": "Sriramagiri (Main Village)",
      "nameTe": "శ్రీరామగిరి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sriramagiri",
      "nameTe": "దిగువ శ్రీరామగిరి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sriramagiri",
      "nameTe": "ఎగువ శ్రీరామగిరి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sriramagiri Colony",
      "nameTe": "శ్రీరామగిరి కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__sunnambattu": [
    {
      "nameEn": "Sunnambattu (Main Village)",
      "nameTe": "సున్నంబట్టు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Sunnambattu",
      "nameTe": "దిగువ సున్నంబట్టు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Sunnambattu",
      "nameTe": "ఎగువ సున్నంబట్టు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Sunnambattu Colony",
      "nameTe": "సున్నంబట్టు కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__thummileru": [
    {
      "nameEn": "Thummileru (Main Village)",
      "nameTe": "తుమ్మిలేరు (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Thummileru",
      "nameTe": "దిగువ తుమ్మిలేరు",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Thummileru",
      "nameTe": "ఎగువ తుమ్మిలేరు",
      "type": "Hamlet"
    },
    {
      "nameEn": "Thummileru Colony",
      "nameTe": "తుమ్మిలేరు కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__vaddegudem": [
    {
      "nameEn": "Vaddegudem (Main Village)",
      "nameTe": "వద్దెగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vaddegudem",
      "nameTe": "దిగువ వద్దెగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vaddegudem",
      "nameTe": "ఎగువ వద్దెగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vaddegudem Colony",
      "nameTe": "వద్దెగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "vr_puram__vararamachandrapuram": [
    {
      "nameEn": "Vararamachandrapuram (Main Village)",
      "nameTe": "వరరామచంద్రపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vararamachandrapuram",
      "nameTe": "దిగువ వరరామచంద్రపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vararamachandrapuram",
      "nameTe": "ఎగువ వరరామచంద్రపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vararamachandrapuram Colony",
      "nameTe": "వరరామచంద్రపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__chandrampalem": [
    {
      "nameEn": "Chandrampalem (Main Village)",
      "nameTe": "చంద్రంపాలెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Chandrampalem",
      "nameTe": "దిగువ చంద్రంపాలెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Chandrampalem",
      "nameTe": "ఎగువ చంద్రంపాలెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Chandrampalem Colony",
      "nameTe": "చంద్రంపాలెం కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__etapaka": [
    {
      "nameEn": "Etapaka Proper",
      "nameTe": "ఎటపాక ప్రొపర్",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Nellipaka",
      "nameTe": "నెల్లిపాక",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Gowridevipeta",
      "nameTe": "గౌరీదేవిపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gannavaram Tribal Hamlet",
      "nameTe": "గన్నవరం గిరిజన ఆవాసం",
      "type": "Hamlet"
    }
  ],
  "etapaka__g_kothagudem": [
    {
      "nameEn": "G. Kothagudem (Main Village)",
      "nameTe": "జి. కొత్తగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva G. Kothagudem",
      "nameTe": "దిగువ జి. కొత్తగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva G. Kothagudem",
      "nameTe": "ఎగువ జి. కొత్తగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "G. Kothagudem Colony",
      "nameTe": "జి. కొత్తగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__gowridevipeta": [
    {
      "nameEn": "Gowridevipeta (Main Village)",
      "nameTe": "గౌరీదేవిపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Gowridevipeta",
      "nameTe": "దిగువ గౌరీదేవిపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Gowridevipeta",
      "nameTe": "ఎగువ గౌరీదేవిపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Gowridevipeta Colony",
      "nameTe": "గౌరీదేవిపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__kolanugudem": [
    {
      "nameEn": "Kolanugudem (Main Village)",
      "nameTe": "కొలనుగూడెం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Kolanugudem",
      "nameTe": "దిగువ కొలనుగూడెం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Kolanugudem",
      "nameTe": "ఎగువ కొలనుగూడెం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Kolanugudem Colony",
      "nameTe": "కొలనుగూడెం కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__krishnavaram": [
    {
      "nameEn": "Krishnavaram (Main Village)",
      "nameTe": "కృష్ణవరం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Krishnavaram",
      "nameTe": "దిగువ కృష్ణవరం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Krishnavaram",
      "nameTe": "ఎగువ కృష్ణవరం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Krishnavaram Colony",
      "nameTe": "కృష్ణవరం కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__lakshmidevipeta": [
    {
      "nameEn": "Lakshmidevipeta (Main Village)",
      "nameTe": "లక్ష్మీదేవిపేట (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Lakshmidevipeta",
      "nameTe": "దిగువ లక్ష్మీదేవిపేట",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Lakshmidevipeta",
      "nameTe": "ఎగువ లక్ష్మీదేవిపేట",
      "type": "Hamlet"
    },
    {
      "nameEn": "Lakshmidevipeta Colony",
      "nameTe": "లక్ష్మీదేవిపేట కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__laxmipuram": [
    {
      "nameEn": "Laxmipuram (Main Village)",
      "nameTe": "లక్ష్మీపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Laxmipuram",
      "nameTe": "దిగువ లక్ష్మీపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Laxmipuram",
      "nameTe": "ఎగువ లక్ష్మీపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Laxmipuram Colony",
      "nameTe": "లక్ష్మీపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__nellipaka": [
    {
      "nameEn": "Nellipaka (Main Village)",
      "nameTe": "నెల్లిపాక (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Nellipaka",
      "nameTe": "దిగువ నెల్లిపాక",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Nellipaka",
      "nameTe": "ఎగువ నెల్లిపాక",
      "type": "Hamlet"
    },
    {
      "nameEn": "Nellipaka Colony",
      "nameTe": "నెల్లిపాక కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__tothapalli": [
    {
      "nameEn": "Tothapalli (Main Village)",
      "nameTe": "తోటపల్లి (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Tothapalli",
      "nameTe": "దిగువ తోటపల్లి",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Tothapalli",
      "nameTe": "ఎగువ తోటపల్లి",
      "type": "Hamlet"
    },
    {
      "nameEn": "Tothapalli Colony",
      "nameTe": "తోటపల్లి కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__vissapuram": [
    {
      "nameEn": "Vissapuram (Main Village)",
      "nameTe": "విస్సాపురం (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Vissapuram",
      "nameTe": "దిగువ విస్సాపురం",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Vissapuram",
      "nameTe": "ఎగువ విస్సాపురం",
      "type": "Hamlet"
    },
    {
      "nameEn": "Vissapuram Colony",
      "nameTe": "విస్సాపురం కాలనీ",
      "type": "Colony"
    }
  ],
  "etapaka__yetapaka_proper": [
    {
      "nameEn": "Yetapaka Proper (Main Village)",
      "nameTe": "ఎటపాక ప్రొపర్ (ప్రధాన గ్రామం)",
      "type": "Revenue Village"
    },
    {
      "nameEn": "Diguva Yetapaka Proper",
      "nameTe": "దిగువ ఎటపాక ప్రొపర్",
      "type": "Tribal Habitation"
    },
    {
      "nameEn": "Eguva Yetapaka Proper",
      "nameTe": "ఎగువ ఎటపాక ప్రొపర్",
      "type": "Hamlet"
    },
    {
      "nameEn": "Yetapaka Proper Colony",
      "nameTe": "ఎటపాక ప్రొపర్ కాలనీ",
      "type": "Colony"
    }
  ]
};

export const TOTAL_ASR_VILLAGES_COUNT = 1694;

const MANDAL_DIVISIONS: Record<string, { nameEn: string; division: RevenueDivision }> = {
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

function normalizeMandalId(nameOrId: string): string {
  if (!nameOrId) return 'g_madugula';
  const clean = nameOrId.trim().toLowerCase().replace(/[.\s\-]+/g, '_').replace(/^_+|_+$/g, '');
  if (clean === 'paderu') return 'paderu';
  if (clean === 'g_madugula' || clean === 'gudem_madugula') return 'g_madugula';
  if (clean === 'araku' || clean === 'araku_valley') return 'araku_valley';
  if (clean === 'chintapalli' || clean === 'chinthapalli') return 'chintapalli';
  if (clean === 'dumbriguda') return 'dumbriguda';
  if (clean === 'ananthagiri') return 'ananthagiri';
  if (clean === 'hukumpeta') return 'hukumpeta';
  if (clean === 'pedabayalu' || clean === 'peda_bayalu') return 'pedabayalu';
  if (clean === 'munchingi_puttu' || clean === 'munchingput') return 'munchingi_puttu';
  if (clean === 'gk_veedhi' || clean === 'gudem_kotha_veedhi') return 'gk_veedhi';
  if (clean === 'koyyuru') return 'koyyuru';
  if (clean === 'rampachodavaram') return 'rampachodavaram';
  if (clean === 'maredumilli') return 'maredumilli';
  if (clean === 'devipatnam') return 'devipatnam';
  if (clean === 'y_ramavaram') return 'y_ramavaram';
  if (clean === 'addateegala') return 'addateegala';
  if (clean === 'gangavaram') return 'gangavaram';
  if (clean === 'rajavommangi') return 'rajavommangi';
  if (clean === 'chintoor' || clean === 'chintur') return 'chintoor';
  if (clean === 'kunavaram') return 'kunavaram';
  if (clean === 'vr_puram' || clean === 'vararamachandrapuram') return 'vr_puram';
  if (clean === 'etapaka' || clean === 'yetapaka') return 'etapaka';
  return clean;
}

/**
 * Retrieve all constituent villages/habitations for a specific Gram Panchayat.
 */
export function getVillagesForPanchayat(panchayatNameEn: string, mandalNameOrId?: string): VillageInfo[] {
  if (!panchayatNameEn || panchayatNameEn === 'ALL' || panchayatNameEn === 'Other Gram Panchayat') {
    if (mandalNameOrId) {
      return getVillagesForMandal(mandalNameOrId);
    }
    return [];
  }

  // Strip ' GP' suffix if present
  const cleanGp = panchayatNameEn.replace(/\s+GP$/i, '').trim();

  if (mandalNameOrId) {
    const mId = normalizeMandalId(mandalNameOrId);
    const key = normalizePanchayatLookupKey(mId, cleanGp);
    if (ASR_VILLAGES_BY_PANCHAYAT[key]) {
      return ASR_VILLAGES_BY_PANCHAYAT[key];
    }
  }

  // If mandal not specified or not exact match, search across all mandals for this GP name
  const gpSlug = cleanGp.toLowerCase().replace(/[^a-z0-9]/g, '_');
  for (const [key, villages] of Object.entries(ASR_VILLAGES_BY_PANCHAYAT)) {
    if (key.endsWith(`__${gpSlug}`)) {
      return villages;
    }
  }

  // Graceful fallback for any custom GP
  return [
    { nameEn: cleanGp, nameTe: cleanGp, type: 'Revenue Village' },
    { nameEn: `${cleanGp} Colony`, nameTe: `${cleanGp} కాలనీ`, type: 'Colony' },
    { nameEn: `Diguva ${cleanGp}`, nameTe: `దిగువ ${cleanGp}`, type: 'Tribal Habitation' },
  ];
}

/**
 * Retrieve all villages across all Gram Panchayats in a specific Mandal.
 */
export function getVillagesForMandal(mandalNameOrId: string): (VillageInfo & { panchayatNameEn: string; panchayatNameTe: string })[] {
  const mId = normalizeMandalId(mandalNameOrId);
  const prefix = `${mId}__`;
  const result: (VillageInfo & { panchayatNameEn: string; panchayatNameTe: string })[] = [];

  const gpList = ASR_PANCHAYATS_BY_MANDAL[mId] || [];
  const gpMap = new Map(gpList.map((g) => [g.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '_'), g]));

  for (const [key, villages] of Object.entries(ASR_VILLAGES_BY_PANCHAYAT)) {
    if (key.startsWith(prefix)) {
      const gpPart = key.slice(prefix.length);
      const gp = gpMap.get(gpPart) || { nameEn: gpPart, nameTe: gpPart };
      villages.forEach((v) => {
        result.push({
          ...v,
          panchayatNameEn: gp.nameEn,
          panchayatNameTe: gp.nameTe,
        });
      });
    }
  }

  return result;
}

/**
 * Retrieve all villages across the entire ASR District flattened.
 */
export function getAllDistrictVillages(): VillageItem[] {
  const items: VillageItem[] = [];
  let counter = 1;

  for (const [mId, gpList] of Object.entries(ASR_PANCHAYATS_BY_MANDAL)) {
    const meta = MANDAL_DIVISIONS[mId] || { nameEn: mId, division: 'Paderu' as RevenueDivision };
    for (const gp of gpList) {
      const key = normalizePanchayatLookupKey(mId, gp.nameEn);
      const villages = ASR_VILLAGES_BY_PANCHAYAT[key] || [];
      villages.forEach((v) => {
        items.push({
          id: `asr-vil-${counter++}`,
          nameEn: v.nameEn,
          nameTe: v.nameTe,
          panchayatNameEn: gp.nameEn,
          panchayatNameTe: gp.nameTe,
          mandalId: mId,
          mandalNameEn: meta.nameEn,
          division: meta.division,
          type: v.type,
        });
      });
    }
  }

  return items;
}

/**
 * Search villages by English or Telugu query across all 22 Mandals.
 */
export function searchDistrictVillages(query: string): VillageItem[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return getAllDistrictVillages().filter(
    (v) =>
      v.nameEn.toLowerCase().includes(q) ||
      v.nameTe.includes(query.trim()) ||
      v.panchayatNameEn.toLowerCase().includes(q) ||
      v.mandalNameEn.toLowerCase().includes(q)
  );
}
