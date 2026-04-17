import { useCallback, useEffect, useRef, useState } from "react";
import { Camera } from "@/components/Camera";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PhrasesList } from "@/components/PhrasesList";
import { StatusIndicator } from "@/components/StatusIndicator";
import { useCamera } from "@/hooks/useCamera";
import { useGestureRecognition } from "@/hooks/useGestureRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { GestureKey, Language } from "@/types";
import { MEDICAL_PHRASES } from "@/utils/medicalPhrases";
import { Volume2, History, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { videoRef, status, error } = useCamera();
  const { gesture, confidence, fps, ready, error: modelError } = useGestureRecognition(
    videoRef,
    status === "ready"
  );
  const { speak, supported: ttsSupported } = useTextToSpeech();

  const [language, setLanguage] = useState<Language>("sw");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [history, setHistory] = useState<GestureKey[]>([]);
  const lastSpokenRef = useRef<GestureKey | null>(null);

  // Auto-speak on detection change
  useEffect(() => {
    if (!gesture) return;
    if (lastSpokenRef.current === gesture) return;
    lastSpokenRef.current = gesture;
    setHistory((h) => [gesture, ...h.filter((x) => x !== gesture)].slice(0, 5));
    if (autoSpeak) {
      const phrase = MEDICAL_PHRASES[gesture];
      speak(language === "sw" ? phrase.swahili : phrase.english, language);
    }
  }, [gesture, autoSpeak, language, speak]);

  const speakCurrent = useCallback(
    (key?: GestureKey) => {
      const target = key ?? gesture;
      if (!target) return;
      const p = MEDICAL_PHRASES[target];
      speak(language === "sw" ? p.swahili : p.english, language);
    },
    [gesture, language, speak]
  );

  // Welcome toast
  useEffect(() => {
    toast.success("Karibu! Welcome to TSL Medical Translator", {
      description: "Press SPACE to speak • Press L to switch language",
      duration: 5000,
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        speakCurrent();
      } else if (e.key.toLowerCase() === "l") {
        setLanguage((l) => (l === "sw" ? "en" : "sw"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [speakCurrent]);

  return (
    <div className="min-h-screen text-foreground">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-3 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Project I — NTA Level 8 | 2025/2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-2">
            🤟 <span className="text-gradient">TSL Medical Translator</span>
          </h1>
          <p className="text-sm sm:text-base text-foreground/70">
            Tanzanian Sign Language to Voice · Medical Communication System
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Camera column */}
          <div className="lg:col-span-2 space-y-4">
            <Camera
              ref={videoRef}
              status={status}
              error={error}
              gesture={gesture}
              confidence={confidence}
              language={language}
            />

            {/* Recent history */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <History className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground/80">Recent Detections</h3>
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No gestures detected yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {history.map((g, i) => {
                    const p = MEDICAL_PHRASES[g];
                    return (
                      <button
                        key={`${g}-${i}`}
                        onClick={() => speakCurrent(g)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-full pl-2 pr-3 py-1.5 text-sm transition-all hover:scale-105"
                      >
                        <span className="text-lg">{p.icon}</span>
                        <span className="font-medium">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Controls column */}
          <div className="space-y-4">
            <StatusIndicator status={status} modelReady={ready} fps={fps} error={modelError} />
            <LanguageToggle language={language} onChange={setLanguage} />

            <button
              onClick={() => speakCurrent()}
              disabled={!gesture || !ttsSupported}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl
                bg-warning text-warning-foreground font-bold text-lg shadow-lg
                transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Volume2 className="h-5 w-5" />
              SPEAK GESTURE
            </button>

            <label className="glass rounded-2xl p-3 flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-semibold">Auto-speak</div>
                <div className="text-xs text-muted-foreground">Speak when gesture detected</div>
              </div>
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="h-5 w-5 accent-primary cursor-pointer"
              />
            </label>

            <PhrasesList language={language} current={gesture} onSelect={speakCurrent} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/10 text-center text-xs sm:text-sm text-foreground/60 space-y-1">
          <p className="font-semibold text-foreground/80">
            Dar es Salaam Institute of Technology (DIT)
          </p>
          <p>Department of Computer Studies · NTA Level 8 · Academic Year 2025/2026</p>
          <p>
            Student: <span className="text-foreground/80 font-medium">ZAITUN SAID GHASIA</span>
            {" · "}
            Supervisor: <span className="text-foreground/80 font-medium">MR. DENIS SHIJA</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
