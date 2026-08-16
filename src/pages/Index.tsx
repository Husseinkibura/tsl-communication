// pages/Index.tsx
import { useEffect, useRef, useState } from "react";
import { Camera } from "@/components/Camera";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PhrasesList } from "@/components/PhrasesList";
import { StatusIndicator } from "@/components/StatusIndicator";
import { useCamera } from "@/hooks/useCamera";
import { useGestureRecognition } from "@/hooks/useGestureRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { GestureKey, Language } from "@/types";
import { MEDICAL_PHRASES, PHRASES_LIST } from "@/utils/medicalPhrases";
import { History } from "lucide-react";
import { toast } from "sonner";
import chavitaLogo from "@/assets/chavita-logo.png";

const Index = () => {
  const { videoRef, status, error } = useCamera();
  const { gesture, confidence, fps, ready, error: modelError } = useGestureRecognition(
    videoRef,
    status === "ready"
  );
  const { speak } = useTextToSpeech();

  const [language, setLanguage] = useState<Language>("sw");
  const [history, setHistory] = useState<GestureKey[]>([]);
  const lastSpokenRef = useRef<GestureKey | null>(null);
  const cameraUnavailable = status === "error";

  useEffect(() => {
    if (!gesture) return;
    if (lastSpokenRef.current === gesture) return;
    lastSpokenRef.current = gesture;
    setHistory((h) => [gesture, ...h.filter((x) => x !== gesture)].slice(0, 5));
    
    const phrase = MEDICAL_PHRASES[gesture];
    if (!phrase) {
      console.warn('Unknown gesture:', gesture);
      return;
    }
    
    speak(language === "sw" ? phrase.swahili : phrase.english, language);
  }, [gesture, language, speak]);

  useEffect(() => {
    toast.success("Karibu! Welcome to TSL Medical Translator", {
      description: "Show a TSL sign in front of the camera to hear it spoken aloud.",
      duration: 5000,
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key.toLowerCase() === "l") {
        setLanguage((l) => (l === "sw" ? "en" : "sw"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      <div className="bg-primary text-primary-foreground text-[11px] sm:text-xs">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-1.5 flex items-center justify-end">
          <span className="hidden sm:inline opacity-90">
            CHAVITA · Usawa na Haki
          </span>
        </div>
      </div>

      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-5">
          <img
            src={chavitaLogo}
            alt="CHAVITA — Tanzania Association of the Deaf logo"
            className="h-10 sm:h-13 w-auto flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.15em] mt-0.5 text-center">
              Tanzanian Sign Language Voice · Medical Communication
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -right-40 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-accent/15 blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Camera
              ref={videoRef}
              status={status}
              error={error}
              gesture={gesture}
              confidence={confidence}
              language={language}
            />

            {cameraUnavailable && (
              <div className="glass rounded-2xl p-3 border border-warning/40 bg-warning/5 text-xs sm:text-sm text-foreground/90">
                <span className="font-semibold text-warning">Camera Required:</span>{" "}
                Enable a camera so the system can detect TSL signs. Voice translation
                only plays when a gesture is recognised from the live video feed.
              </div>
            )}

            <div className="glass rounded-2xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <History className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground/80">Recent Detections</h3>
              </div>
              {history.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No gestures detected yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {history.map((g, i) => {
                    const p = MEDICAL_PHRASES[g];
                    if (!p) return null;
                    return (
                      <div
                        key={`${g}-${i}`}
                        className="bg-white/5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium"
                      >
                        {p.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <StatusIndicator status={status} modelReady={ready} fps={fps} error={modelError} />
            <LanguageToggle language={language} onChange={setLanguage} />
            <PhrasesList language={language} current={gesture} />
          </div>
        </div>

        <footer className="mt-8 sm:mt-10 pt-6 border-t border-border text-center text-xs sm:text-sm text-muted-foreground space-y-1">
          <p className="font-semibold text-primary">
            CHAVITA · Kilakala Unit for the Deaf, Morogoro
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;