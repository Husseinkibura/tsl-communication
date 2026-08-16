// utils/gestureClassifier.ts
import { GestureKey, Landmark, DetectionResult } from "@/types";

const TIPS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
const PIPS = { index: 6, middle: 10, ring: 14, pinky: 18 };
const MCPS = { index: 5, middle: 9, ring: 13, pinky: 17 };
const WRIST = 0;

const dist = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);

interface FingerStates {
  thumb: 0 | 1;
  index: 0 | 1;
  middle: 0 | 1;
  ring: 0 | 1;
  pinky: 0 | 1;
}

function getFingerStates(lm: Landmark[]): FingerStates {
  return {
    thumb: Math.abs(lm[TIPS.thumb].x - lm[MCPS.index].x) > 0.07 ? 1 : 0,
    index: lm[TIPS.index].y < lm[PIPS.index].y - 0.02 ? 1 : 0,
    middle: lm[TIPS.middle].y < lm[PIPS.middle].y - 0.02 ? 1 : 0,
    ring: lm[TIPS.ring].y < lm[PIPS.ring].y - 0.02 ? 1 : 0,
    pinky: lm[TIPS.pinky].y < lm[PIPS.pinky].y - 0.02 ? 1 : 0,
  };
}

function getOrientation(lm: Landmark[]): "U" | "D" | "L" | "R" {
  const dx = lm[MCPS.middle].x - lm[WRIST].x;
  const dy = lm[MCPS.middle].y - lm[WRIST].y;
  if (Math.abs(dy) >= Math.abs(dx)) return dy < 0 ? "U" : "D";
  return dx < 0 ? "L" : "R";
}

function patternKey(f: FingerStates): string {
  return `${f.thumb}${f.index}${f.middle}${f.ring}${f.pinky}`;
}

const SINGLE_HAND_MAP: Record<string, GestureKey> = {
  "01000_U": "headache",
  "01000_D": "pain",
  "01000_L": "stop",
  "01000_R": "stop",
  "01100_U": "help",
  "01100_D": "diabetes",
  "01100_L": "wait",
  "01100_R": "wait",
  "01110_U": "doctor",
  "01110_D": "nurse",
  "01110_L": "nurse",
  "01110_R": "nurse",
  "01111_U": "hospital",
  "01111_D": "vomit",
  "01111_L": "wheelchair",
  "01111_R": "wheelchair",
  "11111_U": "hello",
  "11111_D": "blood",
  "11111_L": "goodbye",
  "11111_R": "goodbye",
  "00000_U": "yes",
  "00000_D": "fever",
  "00000_L": "yes",
  "00000_R": "yes",
  "10000_U": "happy",
  "10000_D": "sad",
  "10000_L": "happy",
  "10000_R": "happy",
  "00001_U": "thirsty",
  "00001_D": "thirsty",
  "00001_L": "thirsty",
  "00001_R": "thirsty",
  "01001_U": "sick",
  "01001_D": "sick",
  "01001_L": "sick",
  "01001_R": "sick",
  "11001_U": "ambulance",
  "11001_D": "ambulance",
  "11001_L": "ambulance",
  "11001_R": "ambulance",
  "10001_U": "please",
  "10001_D": "please",
  "10001_L": "please",
  "10001_R": "please",
  "11000_U": "injection",
  "11000_D": "injection",
  "11000_L": "injection",
  "11000_R": "injection",
  "11100_U": "medicine",
  "11100_D": "medicine",
  "11100_L": "medicine",
  "11100_R": "medicine",
  "11110_U": "xray",
  "11110_D": "xray",
  "11110_L": "xray",
  "11110_R": "xray",
  "00100_U": "no",
  "00100_D": "no",
  "00100_L": "no",
  "00100_R": "no",
  "00011_U": "tired",
  "00011_D": "tired",
  "00011_L": "tired",
  "00011_R": "tired",
  "00111_U": "sneeze",
  "00111_D": "sneeze",
  "00111_L": "sneeze",
  "00111_R": "sneeze",
  "01101_U": "cough",
  "01101_D": "cough",
  "01101_L": "cough",
  "01101_R": "cough",
  "01011_U": "dizzy",
  "01011_D": "dizzy",
  "01011_L": "dizzy",
  "01011_R": "dizzy",
  "10100_U": "allergy",
  "10100_D": "allergy",
  "10100_L": "allergy",
  "10100_R": "allergy",
  "10010_U": "bandage",
  "10010_D": "bandage",
  "10010_L": "bandage",
  "10010_R": "bandage",
  "11101_U": "breathe",
  "11101_D": "breathe",
  "11101_L": "breathe",
  "11101_R": "breathe",
  "11011_U": "pressure",
  "11011_D": "pressure",
  "11011_L": "pressure",
  "11011_R": "pressure",
  "10111_U": "surgery",
  "10111_D": "surgery",
  "10111_L": "surgery",
  "10111_R": "surgery",
  "00010_U": "ear",
  "00010_D": "ear",
  "00010_L": "ear",
  "00010_R": "ear",
  "10110_U": "heart",
  "10110_D": "heart",
  "10110_L": "heart",
  "10110_R": "heart",
  "10011_U": "sorry",
  "10011_D": "sorry",
  "10011_L": "sorry",
  "10011_R": "sorry",
  "10101_U": "hot",
  "10101_D": "cold",
  "10101_L": "hot",
  "10101_R": "hot",
  "00110_U": "eye",
  "00110_D": "eye",
  "00110_L": "eye",
  "00110_R": "eye",
  "01010_U": "nose",
  "01010_D": "nose",
  "01010_L": "nose",
  "01010_R": "nose",
  "00101_U": "mouth",
  "00101_D": "mouth",
  "00101_L": "mouth",
  "00101_R": "mouth",
};

function classifySingleHand(lm: Landmark[]): DetectionResult {
  const f = getFingerStates(lm);
  const orient = getOrientation(lm);
  const key = `${patternKey(f)}_${orient}`;

  const thumbIndexDist = dist(lm[TIPS.thumb], lm[TIPS.index]);
  const palm = dist(lm[WRIST], lm[MCPS.middle]);
  if (palm > 0 && thumbIndexDist / palm < 0.25 && f.middle && f.ring && f.pinky) {
    return { gesture: "emergency", confidence: 0.9 };
  }

  let gesture = SINGLE_HAND_MAP[key];
  if (!gesture) {
    const pat = patternKey(f);
    for (const o of ["U", "D", "L", "R"] as const) {
      const g = SINGLE_HAND_MAP[`${pat}_${o}`];
      if (g) { gesture = g; break; }
    }
  }
  if (!gesture) return { gesture: null, confidence: 0 };
  return { gesture, confidence: 0.8 };
}

function classifyTwoHands(hands: Landmark[][]): DetectionResult {
  const totals = hands.map(getFingerStates);
  const total = totals.reduce(
    (s, f) => s + f.thumb + f.index + f.middle + f.ring + f.pinky,
    0
  );

  const c0 = hands[0][MCPS.middle];
  const c1 = hands[1][MCPS.middle];
  const between = Math.hypot(c0.x - c1.x, c0.y - c1.y);

  if (between < 0.25 && total <= 4) return { gesture: "pregnant", confidence: 0.85 };
  if (between < 0.3 && total >= 8) return { gesture: "thank_you", confidence: 0.85 };

  const TWO_HAND: Record<number, GestureKey> = {
    0: "sleep", 1: "hungry", 2: "water", 3: "food", 4: "hand",
    5: "leg", 6: "back", 7: "stomach", 8: "hospital", 9: "doctor", 10: "help",
  };
  return { gesture: TWO_HAND[total] ?? "help", confidence: 0.75 };
}

export function classifyGesture(hands: Landmark[][]): DetectionResult {
  if (!hands || hands.length === 0) return { gesture: null, confidence: 0 };
  if (hands.length >= 2) return classifyTwoHands(hands);
  return classifySingleHand(hands[0]);
}

export class StabilityBuffer {
  private buffer: (GestureKey | null)[] = [];
  private size: number;
  constructor(size = 3) {
    this.size = size;
  }
  push(g: GestureKey | null): GestureKey | null {
    this.buffer.push(g);
    if (this.buffer.length > this.size) this.buffer.shift();
    if (this.buffer.length < this.size) return null;
    const counts = new Map<GestureKey, number>();
    for (const x of this.buffer) {
      if (x) counts.set(x, (counts.get(x) ?? 0) + 1);
    }
    let best: GestureKey | null = null;
    let bestN = 0;
    for (const [k, v] of counts) {
      if (v > bestN) { best = k; bestN = v; }
    }
    return bestN >= 2 ? best : null;
  }
  reset() {
    this.buffer = [];
  }
}