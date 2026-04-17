import { forwardRef } from "react";
import { CameraStatus } from "@/hooks/useCamera";
import { GesturePanel } from "./GesturePanel";
import { GestureKey, Language } from "@/types";
import { Loader2, CameraOff } from "lucide-react";

interface Props {
  status: CameraStatus;
  error: string | null;
  gesture: GestureKey | null;
  confidence: number;
  language: Language;
}

export const Camera = forwardRef<HTMLVideoElement, Props>(
  ({ status, error, gesture, confidence, language }, ref) => {
    return (
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-elegant border border-white/10">
        <video
          ref={ref}
          playsInline
          muted
          autoPlay
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white text-center p-6">
            {status === "error" ? (
              <>
                <CameraOff className="h-12 w-12 text-destructive mb-3" />
                <p className="font-semibold">Camera Unavailable</p>
                <p className="text-sm text-white/70 mt-1 max-w-sm">{error}</p>
              </>
            ) : (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-3" />
                <p className="font-semibold">Initializing camera…</p>
                <p className="text-sm text-white/60 mt-1">Please allow camera access</p>
              </>
            )}
          </div>
        )}

        {status === "ready" && (
          <>
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs font-semibold text-white tracking-wider">LIVE</span>
            </div>
            <GesturePanel gesture={gesture} confidence={confidence} language={language} />
          </>
        )}
      </div>
    );
  }
);

Camera.displayName = "Camera";
