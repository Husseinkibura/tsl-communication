// frontend/src/utils/medicalPhrases.ts
import { GestureKey } from "@/types";

export interface Phrase {
  key: GestureKey;  // ← Add this!
  label: string;
  swahili: string;
  english: string;
  category: string;
}

export const MEDICAL_PHRASES: Record<GestureKey, Phrase> = {
  thirsty: {
    key: "thirsty",  // ← Add this!
    label: "Thirsty",
    swahili: "Nina kiu",
    english: "I'm thirsty",
    category: "needs"
  },
  pregnant: {
    key: "pregnant",  // ← Add this!
    label: "Pregnant",
    swahili: "Nina mimba",
    english: "I'm pregnant",
    category: "medical"
  },
  dont_understand: {
    key: "dont_understand",  // ← Add this!
    label: "Don't Understand",
    swahili: "Sielewi",
    english: "I don't understand",
    category: "social"
  },
  sick: {
    key: "sick",  // ← Add this!
    label: "Sick",
    swahili: "Sijisikii vizuri",
    english: "I don't feel well",
    category: "symptoms"
  },
  please: {
    key: "please",  // ← Add this!
    label: "Please",
    swahili: "Tafadhali",
    english: "Please",
    category: "social"
  },
  thank_you: {
    key: "thank_you",  // ← Add this!
    label: "Thank You",
    swahili: "Asante sana",
    english: "Thank you",
    category: "social"
  },
  sorry: {
    key: "sorry",  // ← Add this!
    label: "Sorry",
    swahili: "Samahani",
    english: "Sorry",
    category: "social"
  },
  hello: {
    key: "hello",  // ← Add this!
    label: "Hello",
    swahili: "Habari",
    english: "Hello",
    category: "social"
  },
  burned: {
    key: "burned",  // ← Add this!
    label: "Burned",
    swahili: "Nimeungua",
    english: "I've been burned",
    category: "medical"
  },
  epilepsy: {
    key: "epilepsy",  // ← Add this!
    label: "Epilepsy",
    swahili: "Nina kifafa",
    english: "I have epilepsy",
    category: "medical"
  },
  hello_respectful: {
    key: "hello_respectful",  // ← Add this!
    label: "Respectful Hello",
    swahili: "Shikamoo",
    english: "Hello (Respectful)",
    category: "social"
  },
  nauseous: {
    key: "nauseous",  // ← Add this!
    label: "Nauseous",
    swahili: "Ninahisi kichefuchefu",
    english: "I feel nauseous",
    category: "symptoms"
  },
  help: {
    key: "help",  // ← Add this!
    label: "Help",
    swahili: "Nahitaji msaada",
    english: "I need help",
    category: "help"
  }
};

export const PHRASES_LIST = Object.values(MEDICAL_PHRASES);
export const GESTURE_KEYS = Object.keys(MEDICAL_PHRASES) as GestureKey[];




// import { MedicalPhrase, GestureKey } from "@/types";

// // Vocabulary aligned with the Tanzanian Sign Language reference:
// // "Kamusi ya Lugha ya Alama kwa Watoto" (Tanzatoto Foundation, CHAVITA &
// // Kilakala Unit for the Deaf, Morogoro — 2010 / 2nd print 2014).
// // Each entry pairs an authentic TSL Kiswahili term from the dictionary with
// // a medical-context English meaning used by the translator.

// const P = (key: GestureKey, label: string, swahili: string, english: string): MedicalPhrase => ({
//   key, label, swahili, english,
// });

// export const MEDICAL_PHRASES: Record<GestureKey, MedicalPhrase> = {
//   // Health & symptoms (Kamusi §6 Maono/tabia, §9 Kazi)
//   pain:       P("pain",       "Maumivu",     "Ninaumwa",                     "I am in pain"),
//   fever:      P("fever",      "Homa",        "Nina homa",                    "I have a fever"),
//   medicine:   P("medicine",   "Dawa",        "Nahitaji dawa",                "I need medicine"),
//   emergency:  P("emergency",  "Dharura",     "Dharura, saidia haraka",       "Emergency, help quickly"),
//   allergy:    P("allergy",    "Mzio",        "Nina mzio",                    "I have an allergy"),
//   headache:   P("headache",   "Kichwa",      "Ninaumwa kichwa",              "I have a headache"),
//   stomach:    P("stomach",    "Tumbo",       "Ninaumwa tumbo",               "I have stomach pain"),
//   diabetes:   P("diabetes",   "Kisukari",    "Nina kisukari",                "I have diabetes"),
//   pregnancy:  P("pregnancy",  "Mimba",       "Nina mimba",                   "I am pregnant"),
//   help:       P("help",       "Saidia",      "Tafadhali nisaidie",           "Please help me"),
//   thirsty:    P("thirsty",    "Kiu",         "Nina kiu",                     "I am thirsty"),
//   thank_you:  P("thank_you",  "Asante",      "Asante sana",                  "Thank you very much"),

//   // Feelings (Kamusi §6)
//   happy:      P("happy",      "Furaha",      "Nina furaha",                  "I am happy"),
//   sad:        P("sad",        "Huzuni / Lia","Nina huzuni",                  "I am sad"),
//   hungry:     P("hungry",     "Njaa",        "Nina njaa",                    "I am hungry"),
//   tired:      P("tired",      "Choka",       "Nimechoka",                    "I am tired"),
//   sleep:      P("sleep",      "Lala",        "Nahitaji kulala",              "I need to sleep"),

//   // Basic needs (Kamusi §2, §5)
//   water:      P("water",      "Maji",        "Nahitaji maji",                "I need water"),
//   food:       P("food",       "Chakula",     "Nahitaji chakula",             "I need food"),

//   // People & places (Kamusi §9)
//   doctor:     P("doctor",     "Daktari",     "Nahitaji daktari",             "I need a doctor"),
//   nurse:      P("nurse",      "Nasi",        "Nahitaji nasi",                "I need a nurse"),
//   hospital:   P("hospital",   "Hospitali",   "Nipeleke hospitali",           "Take me to the hospital"),

//   // More symptoms
//   sick:       P("sick",       "Mgonjwa",     "Ninajisikia mgonjwa",          "I feel sick"),
//   cold:       P("cold",       "Baridi",      "Nasikia baridi",               "I feel cold"),
//   hot:        P("hot",        "Joto",        "Nasikia joto",                 "I feel hot"),
//   dizzy:      P("dizzy",      "Kizunguzungu","Nina kizunguzungu",            "I feel dizzy"),
//   vomit:      P("vomit",      "Tapika",      "Ninatapika",                   "I am vomiting"),
//   blood:      P("blood",      "Damu",        "Ninatoka damu",                "I am bleeding"),
//   breathe:    P("breathe",    "Pumua",       "Nashindwa kupumua",            "I cannot breathe"),
//   cough:      P("cough",      "Kikohozi",    "Nina kikohozi",                "I have a cough"),
//   sneeze:     P("sneeze",     "Chafya",      "Ninapiga chafya",              "I am sneezing"),

//   // Treatments / equipment
//   injection:  P("injection",  "Sindano",     "Nahitaji sindano",             "I need an injection"),
//   bandage:    P("bandage",    "Bandeji",     "Nahitaji bandeji",             "I need a bandage"),
//   wheelchair: P("wheelchair", "Kiti cha magurudumu", "Nahitaji kiti cha magurudumu", "I need a wheelchair"),
//   ambulance:  P("ambulance",  "Gari la wagonjwa", "Piga gari la wagonjwa",   "Call an ambulance"),
//   surgery:    P("surgery",    "Upasuaji",    "Nahitaji upasuaji",            "I need surgery"),
//   xray:       P("xray",       "Eksirei",     "Nahitaji eksirei",             "I need an X-ray"),
//   pressure:   P("pressure",   "Shinikizo",   "Nina shinikizo la damu",       "I have high blood pressure"),

//   // Body parts (Kamusi §body / common signs)
//   heart:      P("heart",      "Moyo",        "Ninaumwa moyo",                "My heart hurts"),
//   eye:        P("eye",        "Jicho",       "Ninaumwa jicho",               "My eye hurts"),
//   ear:        P("ear",        "Sikio",       "Ninaumwa sikio",               "My ear hurts"),
//   nose:       P("nose",       "Pua",         "Ninaumwa pua",                 "My nose hurts"),
//   mouth:      P("mouth",      "Mdomo",       "Ninaumwa mdomo",               "My mouth hurts"),
//   hand:       P("hand",       "Mkono",       "Ninaumwa mkono",               "My hand hurts"),
//   leg:        P("leg",        "Mguu",        "Ninaumwa mguu",                "My leg hurts"),
//   back:       P("back",       "Mgongo",      "Ninaumwa mgongo",              "My back hurts"),

//   // Social / responses (Kamusi §15 Ushirikiano)
//   yes:        P("yes",        "Ndiyo",       "Ndiyo",                        "Yes"),
//   no:         P("no",         "Hapana / Sitaki","Hapana",                    "No"),
//   hello:      P("hello",      "Habari",      "Habari",                       "Hello"),
//   goodbye:    P("goodbye",    "Kwaheri",     "Kwaheri",                      "Goodbye"),
//   please:     P("please",     "Naomba / Tafadhali","Tafadhali",              "Please"),
//   sorry:      P("sorry",      "Samahani / Pole","Samahani",                  "Sorry"),
//   wait:       P("wait",       "Subiri",      "Subiri kidogo",                "Please wait"),
//   stop:       P("stop",       "Acha",        "Acha",                         "Stop"),
// };

// export const PHRASES_LIST = Object.values(MEDICAL_PHRASES);

// export const TSL_REFERENCE =
//   'Signs based on "Kamusi ya Lugha ya Alama kwa Watoto" — Tanzatoto Foundation, CHAVITA & Kilakala Unit for the Deaf (Morogoro, 2010 / 2014).';
