// hooks/useGestureRecognition.ts
import { useEffect, useRef, useState } from "react";
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
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const isProcessingRef = useRef(false);
  const detectionBufferRef = useRef<{ gesture: GestureKey | null; confidence: number }[]>([]);
  const stableGestureRef = useRef<GestureKey | null>(null);
  const gestureStartTimeRef = useRef<number>(0);
  const isSpeakingRef = useRef<boolean>(false);

  const classifyWithPython = async (landmarks: Landmark[][]): Promise<{ gesture: GestureKey | null; confidence: number }> => {
    if (isProcessingRef.current) return { gesture: null, confidence: 0 };
    
    isProcessingRef.current = true;
    
    try {
      const features: number[] = [];
      if (landmarks.length > 0) {
        const hand = landmarks[0];
        for (const lm of hand) {
          features.push(lm.x || 0, lm.y || 0, lm.z || 0);
        }
      }
      
      while (features.length < 63) {
        features.push(0);
      }

      const response = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: features.slice(0, 63) }),
      });

      if (!response.ok) {
        throw new Error('Classification failed');
      }

      const data = await response.json();
      return { 
        gesture: data.gesture || null, 
        confidence: data.confidence || 0 
      };
    } catch (err) {
      console.error('API error:', err);
      return { gesture: null, confidence: 0 };
    } finally {
      isProcessingRef.current = false;
    }
  };

  const isHandStable = (landmarks: Landmark[][]): boolean => {
    if (landmarks.length === 0) return false;
    const hand = landmarks[0];
    if (hand.length < 21) return false;
    return true;
  };

  const isIntentionalGesture = (gestureKey: GestureKey | null, confidence: number): boolean => {
    const CONSECUTIVE_DETECTIONS_REQUIRED = 3;
    const MIN_CONFIDENCE = 0.1;
    const MIN_HOLD_TIME = 100;
    
    if (!gestureKey || confidence < MIN_CONFIDENCE) {
      detectionBufferRef.current = [];
      return false;
    }
    
    detectionBufferRef.current.push({ gesture: gestureKey, confidence });
    
    if (detectionBufferRef.current.length > CONSECUTIVE_DETECTIONS_REQUIRED) {
      detectionBufferRef.current.shift();
    }
    
    const recentDetections = detectionBufferRef.current;
    if (recentDetections.length < CONSECUTIVE_DETECTIONS_REQUIRED) {
      return false;
    }
    
    const allSameGesture = recentDetections.every(d => d.gesture === gestureKey);
    const allHighConfidence = recentDetections.every(d => d.confidence >= MIN_CONFIDENCE);
    
    if (allSameGesture && allHighConfidence) {
      if (stableGestureRef.current !== gestureKey) {
        stableGestureRef.current = gestureKey;
        gestureStartTimeRef.current = Date.now();
        return false;
      }
      
      const holdDuration = Date.now() - gestureStartTimeRef.current;
      return holdDuration >= MIN_HOLD_TIME;
    }
    
    return false;
  };

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        await loadScript(MEDIAPIPE_HANDS);
        if (cancelled) return;

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
          minDetectionConfidence: 0.3,
          minTrackingConfidence: 0.3,
        });

        hands.onResults(async (results: any) => {
          const landmarks: Landmark[][] = results.multiHandLandmarks || [];
          
          if (landmarks.length > 0 && isHandStable(landmarks)) {
            const result = await classifyWithPython(landmarks);
            
            if (isIntentionalGesture(result.gesture, result.confidence)) {
              setGesture(result.gesture);
              setConfidence(result.confidence);
              isSpeakingRef.current = true;
            } else {
              if (!isSpeakingRef.current) {
                setGesture(null);
              }
            }
          } else {
            if (!isSpeakingRef.current) {
              detectionBufferRef.current = [];
              stableGestureRef.current = null;
              setGesture(null);
              setConfidence(0);
            }
          }

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
            } catch (e) {}
          }
          rafRef.current = requestAnimationFrame(process);
        };
        process();
      } catch (e: any) {
        console.error("MediaPipe load error:", e);
        setError("Failed to load hand tracking model.");
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

  useEffect(() => {
    if (gesture) {
      const timer = setTimeout(() => {
        isSpeakingRef.current = false;
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [gesture]);

  return { gesture, confidence, fps, ready, error };
}