import { GestureKey, Landmark, DetectionResult } from "@/types";

const TIPS = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
const PIPS = { index: 6, middle: 10, ring: 14, pinky: 18 };
const MCPS = { index: 5, middle: 9, ring: 13, pinky: 17 };

const dist = (a: Landmark, b: Landmark) =>
  Math.hypot(a.x - b.x, a.y - b.y);

interface FingerStates {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}

function getFingerStates(lm: Landmark[]): FingerStates {
  return {
    thumb: Math.abs(lm[TIPS.thumb].x - lm[MCPS.index].x) > 0.08,
    index: lm[TIPS.index].y < lm[PIPS.index].y - 0.02,
    middle: lm[TIPS.middle].y < lm[PIPS.middle].y - 0.02,
    ring: lm[TIPS.ring].y < lm[PIPS.ring].y - 0.02,
    pinky: lm[TIPS.pinky].y < lm[PIPS.pinky].y - 0.02,
  };
}

function classifySingleHand(lm: Landmark[]): DetectionResult {
  const f = getFingerStates(lm);
  const extendedCount = [f.index, f.middle, f.ring, f.pinky].filter(Boolean).length;

  const thumbIndexDist = dist(lm[TIPS.thumb], lm[TIPS.index]);
  const indexMiddleDist = dist(lm[TIPS.index], lm[TIPS.middle]);
  const handSpan = dist(lm[TIPS.thumb], lm[TIPS.pinky]);
  const palmSize = dist(lm[0], lm[MCPS.middle]);
  const normalizedSpan = palmSize > 0 ? handSpan / palmSize : 0;

  if (f.thumb && f.index && f.middle && f.ring && f.pinky && normalizedSpan > 1.4) {
    return { gesture: "emergency", confidence: Math.min(1, normalizedSpan / 2) };
  }

  const tips = [lm[TIPS.thumb], lm[TIPS.index], lm[TIPS.middle], lm[TIPS.ring], lm[TIPS.pinky]];
  const cx = tips.reduce((s, p) => s + p.x, 0) / 5;
  const cy = tips.reduce((s, p) => s + p.y, 0) / 5;
  const avgTipSpread = tips.reduce((s, p) => s + Math.hypot(p.x - cx, p.y - cy), 0) / 5;
  if (avgTipSpread < 0.04 && palmSize > 0.05) {
    return { gesture: "thank_you", confidence: 0.85 };
  }

  if (f.middle && f.ring && f.pinky && thumbIndexDist < 0.06) {
    return { gesture: "medicine", confidence: 0.85 };
  }

  if (f.thumb && f.index && f.middle && f.ring && f.pinky && normalizedSpan <= 1.4) {
    return { gesture: "stomach", confidence: 0.8 };
  }

  if (f.index && f.middle && !f.ring && !f.pinky) {
    if (indexMiddleDist < 0.05) {
      return { gesture: "help", confidence: 0.85 };
    }
    if (indexMiddleDist > 0.09) {
      return { gesture: "allergy", confidence: 0.85 };
    }
    return { gesture: "diabetes", confidence: 0.75 };
  }

  if (f.index && !f.middle && !f.ring && !f.pinky) {
    const pointingUp = lm[TIPS.index].y < lm[0].y - 0.15;
    if (pointingUp) {
      return { gesture: "headache", confidence: 0.85 };
    }
    return { gesture: "pain", confidence: 0.9 };
  }

  if (!f.index && !f.middle && !f.ring && !f.pinky && f.thumb) {
    return { gesture: "fever", confidence: 0.85 };
  }

  if (!f.middle && !f.ring && !f.pinky && thumbIndexDist > 0.08 && thumbIndexDist < 0.18) {
    return { gesture: "thirsty", confidence: 0.7 };
  }

  return { gesture: null, confidence: 0 };
}

export function classifyGesture(hands: Landmark[][]): DetectionResult {
  if (!hands || hands.length === 0) return { gesture: null, confidence: 0 };

  if (hands.length >= 2) {
    return { gesture: "pregnancy", confidence: 0.8 };
  }

  return classifySingleHand(hands[0]);
}

export class StabilityBuffer {
  private buffer: (GestureKey | null)[] = [];
  private size: number;

  constructor(size = 5) {
    this.size = size;
  }

  push(g: GestureKey | null): GestureKey | null {
    this.buffer.push(g);
    if (this.buffer.length > this.size) this.buffer.shift();
    if (this.buffer.length < this.size) return null;
    const first = this.buffer[0];
    return this.buffer.every((x) => x === first) ? first : null;
  }

  reset() {
    this.buffer = [];
  }
}
