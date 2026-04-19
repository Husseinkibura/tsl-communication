import { useEffect, useRef, useState } from "react";

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
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
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
        }
      } catch (e: any) {
        console.error("Camera error", e);
        const name = e?.name;
        let msg = "Unable to access camera. Please check your device.";
        if (name === "NotAllowedError") {
          msg = "Camera permission denied. Please allow camera access in your browser settings.";
        } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          msg = "No camera detected on this device. You can still use Demo Mode — tap any phrase below to hear it spoken.";
        } else if (name === "NotReadableError" || name === "TrackStartError") {
          msg = "Camera is already in use by another application. Please close it and refresh.";
        }
        setError(msg);
        setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { videoRef, status, error };
}
