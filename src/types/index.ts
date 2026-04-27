export type GestureKey =
  | "pain"
  | "fever"
  | "medicine"
  | "emergency"
  | "allergy"
  | "headache"
  | "stomach"
  | "diabetes"
  | "pregnancy"
  | "help"
  | "thirsty"
  | "thank_you";

export interface MedicalPhrase {
  key: GestureKey;
  icon: string;
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