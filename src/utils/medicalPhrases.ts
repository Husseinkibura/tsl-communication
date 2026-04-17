import { MedicalPhrase, GestureKey } from "@/types";

export const MEDICAL_PHRASES: Record<GestureKey, MedicalPhrase> = {
  pain: {
    key: "pain",
    icon: "😖",
    label: "Pain",
    swahili: "Mgonjwa ana maumivu",
    english: "The patient is in pain",
  },
  fever: {
    key: "fever",
    icon: "🌡️",
    label: "Fever",
    swahili: "Mgonjwa ana homa",
    english: "The patient has a fever",
  },
  medicine: {
    key: "medicine",
    icon: "💊",
    label: "Medicine",
    swahili: "Nahitaji dawa",
    english: "I need medicine",
  },
  emergency: {
    key: "emergency",
    icon: "🚨",
    label: "Emergency",
    swahili: "Dharura! Nahitaji msaada haraka",
    english: "Emergency! I need immediate help",
  },
  allergy: {
    key: "allergy",
    icon: "⚠️",
    label: "Allergy",
    swahili: "Nina mzio",
    english: "I have an allergy",
  },
  headache: {
    key: "headache",
    icon: "🤕",
    label: "Headache",
    swahili: "Ninaumwa kichwa",
    english: "I have a headache",
  },
  stomach: {
    key: "stomach",
    icon: "🤢",
    label: "Stomach",
    swahili: "Ninaumwa tumbo",
    english: "I have stomach pain",
  },
  diabetes: {
    key: "diabetes",
    icon: "🩸",
    label: "Diabetes",
    swahili: "Nina ugonjwa wa kisukari",
    english: "I have diabetes",
  },
  pregnancy: {
    key: "pregnancy",
    icon: "🤰",
    label: "Pregnancy",
    swahili: "Nina mimba",
    english: "I am pregnant",
  },
  help: {
    key: "help",
    icon: "🆘",
    label: "Help",
    swahili: "Tafadhali nisaidie",
    english: "Please help me",
  },
  thirsty: {
    key: "thirsty",
    icon: "💧",
    label: "Thirsty",
    swahili: "Nina kiu",
    english: "I am thirsty",
  },
  thank_you: {
    key: "thank_you",
    icon: "🙏",
    label: "Thank You",
    swahili: "Asante sana",
    english: "Thank you very much",
  },
};

export const PHRASES_LIST = Object.values(MEDICAL_PHRASES);
