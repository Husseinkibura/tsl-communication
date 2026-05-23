export type GestureKey =
  | "pain" | "fever" | "medicine" | "emergency" | "allergy" | "headache"
  | "stomach" | "diabetes" | "pregnancy" | "help" | "thirsty" | "thank_you"
  | "happy" | "sad" | "hungry" | "tired" | "sleep" | "water"
  | "food" | "doctor" | "nurse" | "hospital" | "sick" | "cold"
  | "hot" | "dizzy" | "vomit" | "blood" | "breathe" | "cough"
  | "sneeze" | "injection" | "bandage" | "wheelchair" | "ambulance" | "surgery"
  | "xray" | "pressure" | "heart" | "eye" | "ear" | "nose"
  | "mouth" | "hand" | "leg" | "back" | "yes" | "no"
  | "hello" | "goodbye" | "please" | "sorry" | "wait" | "stop";

export interface MedicalPhrase {
  key: GestureKey;
  swahili: string;
  english: string;
  label: string;
}

export type Language = "sw" | "en";

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectionResult {
  gesture: GestureKey | null;
  confidence: number;
}
