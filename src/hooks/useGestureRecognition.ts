// frontend/src/hooks/useGestureRecognition.ts
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
  const lastGestureRef = useRef<GestureKey | null>(null);
  const isProcessingRef = useRef(false);

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

      console.log('📤 Sending features to API...');

      const response = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: features.slice(0, 63) }),
      });

      if (!response.ok) {
        throw new Error('Classification failed');
      }

      const data = await response.json();
      console.log('📥 API Response:', data);
      
      return { 
        gesture: data.gesture || null, 
        confidence: data.confidence || 0 
      };
    } catch (err) {
      console.error('❌ API error:', err);
      return { gesture: null, confidence: 0 };
    } finally {
      isProcessingRef.current = false;
    }
  };

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    (async () => {
      try {
        console.log('📷 Loading MediaPipe...');
        await loadScript(MEDIAPIPE_HANDS);
        if (cancelled) return;

        if (!window.Hands) {
          throw new Error("MediaPipe Hands not available");
        }

        console.log('✅ MediaPipe loaded, initializing...');

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

        hands.onResults(async (results: any) => {
          const landmarks: Landmark[][] = results.multiHandLandmarks || [];
          
          if (landmarks.length > 0) {
            console.log('🖐️ Hand detected! Landmarks:', landmarks[0].length);
            
            const result = await classifyWithPython(landmarks);
            
            // 🔧 LOWERED THRESHOLD FROM 0.6 TO 0.3
            if (result.gesture && result.confidence > 0.3) {
              console.log('🎯 DETECTED:', result.gesture, 'Confidence:', result.confidence);
              setGesture(result.gesture);
              setConfidence(result.confidence);
              lastGestureRef.current = result.gesture;
            } else if (result.confidence < 0.2 && lastGestureRef.current) {
              setGesture(null);
              setConfidence(0);
              lastGestureRef.current = null;
            }
          } else {
            if (lastGestureRef.current) {
              setGesture(null);
              setConfidence(0);
              lastGestureRef.current = null;
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
        console.log('✅ MediaPipe ready!');

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
        console.error("❌ MediaPipe load error:", e);
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

  return { gesture, confidence, fps, ready, error };
}