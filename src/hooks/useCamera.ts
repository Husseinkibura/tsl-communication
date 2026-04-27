import { useRef, useState, useEffect } from "react";

export type CameraStatus = "idle" | "loading" | "ready" | "error";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function init() {
      setStatus("loading");
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Your browser does not support camera access. Please use Chrome, Edge, or Safari.");
        setStatus("error");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 }, 
            facingMode: "user" 
          },
          audio: false,
        });
        
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStatus("ready");
          setError(null);
        }
      } catch (e: any) {
        console.error("Camera error", e);
        
        const name = e?.name || e?.constructor?.name;
        let msg = "Unable to access camera. Please check your device.";
        
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          msg = "Camera permission denied. Please allow camera access in your browser settings and refresh.";
        } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          msg = "No camera detected on this device. You can still use Demo Mode — tap any phrase below to hear it spoken.";
        } else if (name === "NotReadableError" || name === "TrackStartError") {
          msg = "Camera is already in use by another application. Please close it and refresh.";
        } else if (name === "OverconstrainedError") {
          msg = "No suitable camera found. Please check your camera settings.";
        } else if (name === "TypeError" && !navigator.mediaDevices) {
          msg = "This browser doesn't support camera access. Please use HTTPS or a modern browser.";
        }
        
        setError(msg);
        setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return { videoRef, status, error };
}