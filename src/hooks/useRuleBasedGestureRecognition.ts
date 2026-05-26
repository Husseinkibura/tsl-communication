import { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs';

export function useRuleBasedGestureRecognition(
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) {
  const [gesture, setGesture] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [fps, setFps] = useState(0);
  const [ready, setReady] = useState(false);
  const detectorRef = useRef<any>(null);
  const frameRef = useRef<number>();
  const lastTimeRef = useRef(performance.now());

  // Rule-based finger counting
  const detectGestureFromLandmarks = (landmarks: any[]): { gesture: string; confidence: number } | null => {
    if (!landmarks || landmarks.length < 21) return null;
    
    // Get finger tip and dip/mcp positions
    const thumbTip = landmarks[4];
    const thumbMcp = landmarks[2];
    const indexTip = landmarks[8];
    const indexMcp = landmarks[5];
    const middleTip = landmarks[12];
    const middleMcp = landmarks[9];
    const ringTip = landmarks[16];
    const ringMcp = landmarks[13];
    const pinkyTip = landmarks[20];
    const pinkyMcp = landmarks[17];
    
    // Check if fingers are extended (tip y < mcp y for most fingers, different for thumb)
    const isIndexUp = indexTip.y < indexMcp.y;
    const isMiddleUp = middleTip.y < middleMcp.y;
    const isRingUp = ringTip.y < ringMcp.y;
    const isPinkyUp = pinkyTip.y < pinkyMcp.y;
    const isThumbUp = Math.abs(thumbTip.x - thumbMcp.x) > 0.05;
    
    const extendedCount = [isIndexUp, isMiddleUp, isRingUp, isPinkyUp].filter(Boolean).length;
    
    // Medical gesture mapping based on finger patterns
    const gestures: Record<string, { condition: boolean; confidence: number }> = {
      help: { condition: extendedCount === 5 && isThumbUp, confidence: 0.9 }, // Open hand
      pain: { condition: extendedCount === 1 && isIndexUp, confidence: 0.85 }, // Pointing
      medicine: { condition: extendedCount === 2 && isIndexUp && isMiddleUp, confidence: 0.8 }, // Two fingers
      thank_you: { condition: extendedCount === 0, confidence: 0.85 }, // Fist
      emergency: { condition: extendedCount === 5 && !isThumbUp, confidence: 0.75 }, // Open hand, thumb not out
      fever: { condition: isThumbUp && extendedCount === 0, confidence: 0.7 }, // Thumb up only
      thirsty: { condition: isThumbUp && extendedCount === 4, confidence: 0.7 }, // Thumb + 4 fingers
      headache: { condition: isIndexUp && isThumbUp, confidence: 0.7 } // Pointing + thumb
    };
    
    for (const [gestureName, data] of Object.entries(gestures)) {
      if (data.condition) {
        return { gesture: gestureName, confidence: data.confidence };
      }
    }
    
    return null;
  };

  useEffect(() => {
    const loadDetector = async () => {
      await tf.ready();
      const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        modelType: 'full',  // This is now the correct literal type
        maxHands: 1
      };
      detectorRef.current = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        detectorConfig
      );
      setReady(true);
    };
    
    loadDetector();
  }, []);

  useEffect(() => {
    if (!isActive || !detectorRef.current || !videoRef.current || !ready) return;
    
    const detectFrame = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        frameRef.current = requestAnimationFrame(detectFrame);
        return;
      }
      
      const now = performance.now();
      setFps(Math.round(1000 / (now - lastTimeRef.current)));
      lastTimeRef.current = now;
      
      try {
        const hands = await detectorRef.current!.detect(video);
        
        if (hands.length > 0 && hands[0].keypoints) {
          const result = detectGestureFromLandmarks(hands[0].keypoints);
          if (result) {
            console.log(`Detected: ${result.gesture} (confidence: ${result.confidence})`);
            setGesture(result.gesture);
            setConfidence(result.confidence);
          } else {
            setGesture(null);
            setConfidence(0);
          }
        } else {
          setGesture(null);
          setConfidence(0);
        }
      } catch (error) {
        console.error('Detection error:', error);
      }
      
      frameRef.current = requestAnimationFrame(detectFrame);
    };
    
    detectFrame();
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isActive, ready, videoRef]);
  
  return { gesture, confidence, fps, ready, error: null };
}