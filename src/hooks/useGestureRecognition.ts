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
  
  // NEW: Detection stability tracking
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
      console.error('❌ API error:', err);
      return { gesture: null, confidence: 0 };
    } finally {
      isProcessingRef.current = false;
    }
  };

  // NEW: Check if hand is in a stable position (not moving too much)
  const isHandStable = (landmarks: Landmark[][]): boolean => {
    if (landmarks.length === 0) return false;
    
    const hand = landmarks[0];
    if (hand.length < 21) return false;
    
    // Check wrist position stability
    const wrist = hand[0];
    const wristX = wrist.x || 0;
    const wristY = wrist.y || 0;
    
    // You can add more sophisticated stability detection here
    // For now, return true if we have hand landmarks
    return true;
  };

  // NEW: Determine if the gesture is intentionally held
  const isIntentionalGesture = (gestureKey: GestureKey | null, confidence: number): boolean => {
    const CONSECUTIVE_DETECTIONS_REQUIRED = 8; // Need 8 consecutive frames
    const MIN_CONFIDENCE = 0.55; // Higher threshold for intentional detection
    const MIN_HOLD_TIME = 300; // Must hold for at least 300ms
    
    if (!gestureKey || confidence < MIN_CONFIDENCE) {
      // Reset buffer if confidence drops
      detectionBufferRef.current = [];
      return false;
    }
    
    // Add to buffer
    detectionBufferRef.current.push({ gesture: gestureKey, confidence });
    
    // Keep only last N detections
    if (detectionBufferRef.current.length > CONSECUTIVE_DETECTIONS_REQUIRED) {
      detectionBufferRef.current.shift();
    }
    
    // Check if we have enough consecutive detections of the SAME gesture
    const recentDetections = detectionBufferRef.current;
    if (recentDetections.length < CONSECUTIVE_DETECTIONS_REQUIRED) {
      return false;
    }
    
    const allSameGesture = recentDetections.every(d => d.gesture === gestureKey);
    const allHighConfidence = recentDetections.every(d => d.confidence >= MIN_CONFIDENCE);
    
    if (allSameGesture && allHighConfidence) {
      // Check if gesture has been held long enough
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
          minDetectionConfidence: 0.7, // Higher initial detection
          minTrackingConfidence: 0.7,
        });

        hands.onResults(async (results: any) => {
          const landmarks: Landmark[][] = results.multiHandLandmarks || [];
          
          if (landmarks.length > 0 && isHandStable(landmarks)) {
            const result = await classifyWithPython(landmarks);
            
            // Check if this is an intentional, stable gesture
            if (isIntentionalGesture(result.gesture, result.confidence)) {
              console.log('🎯 INTENTIONAL DETECTION:', result.gesture, 'Confidence:', result.confidence);
              setGesture(result.gesture);
              setConfidence(result.confidence);
              lastGestureRef.current = result.gesture;
              isSpeakingRef.current = true;
            } else {
              // Gesture detected but not intentional yet
              if (!isSpeakingRef.current) {
                // Only clear if we weren't already speaking
                setGesture(null);
              }
            }
          } else {
            // No hand detected
            if (!isSpeakingRef.current) {
              // Reset if not actively speaking
              detectionBufferRef.current = [];
              stableGestureRef.current = null;
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

  // Reset speaking state after gesture is spoken
  useEffect(() => {
    if (gesture) {
      // Reset the speaking flag after the gesture has been processed
      const timer = setTimeout(() => {
        isSpeakingRef.current = false;
      }, 1000); // Give time for TTS to start
      
      return () => clearTimeout(timer);
    }
  }, [gesture]);

  return { gesture, confidence, fps, ready, error };
}