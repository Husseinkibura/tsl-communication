import { useEffect, useRef, useState } from "react";
import { classifyGesture, StabilityBuffer } from "@/utils/gestureClassifier";
import { GestureKey, Landmark } from "@/types";

declare global {
  interface Window {
    Hands: any;
  }
}

const MEDIAPIPE_HANDS = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function useGestureRecognition(
  videoRef: React.RefObject<HTMLVideoElement>,
  enabled: boolean
) {
  const [gesture, setGesture] = useState<GestureKey | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [fps, setFps] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handsRef = useRef<any>(null);
  const bufferRef = useRef(new StabilityBuffer(5));
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        await loadScript(MEDIAPIPE_HANDS);
        if (cancelled) return;

        // Check if Hands is available
        if (!window.Hands) {
          throw new Error("MediaPipe Hands not available");
        }

        const hands = new window.Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        hands.onResults((results: any) => {
          const landmarks: Landmark[][] = results.multiHandLandmarks || [];
          const result = classifyGesture(landmarks);
          const stable = bufferRef.current.push(result.gesture);
          setGesture(stable);
          setConfidence(stable ? result.confidence : 0);

          frameCountRef.current++;
          const now = performance.now();
          if (now - lastTimeRef.current >= 1000) {
            setFps(frameCountRef.current);
            frameCountRef.current = 0;
            lastTimeRef.current = now;
          }
        });

        handsRef.current = hands;
        setReady(true);
        setError(null);

        const process = async () => {
          if (cancelled) return;
          const video = videoRef.current;
          if (video && video.readyState >= 2 && handsRef.current) {
            try {
              await handsRef.current.send({ image: video });
            } catch (e) {
              // Ignore transient send errors
            }
          }
          rafRef.current = requestAnimationFrame(process);
        };
        process();
      } catch (e: any) {
        console.error("MediaPipe load error", e);
        setError("Failed to load hand tracking model. Please refresh. Using Demo Mode.");
        setReady(false);
      }
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (handsRef.current) {
        try {
          handsRef.current.close();
        } catch {}
      }
    };
  }, [enabled, videoRef]);

  return { gesture, confidence, fps, ready, error };
}