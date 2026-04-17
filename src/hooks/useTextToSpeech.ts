import { useCallback, useEffect, useState } from "react";
import { Language } from "@/types";

export function useTextToSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  const speak = useCallback(
    (text: string, language: Language) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const langCode = language === "sw" ? "sw-TZ" : "en-US";
      utter.lang = langCode;
      utter.rate = 0.95;
      utter.pitch = 1;

      const preferred =
        voices.find((v) => v.lang === langCode) ||
        voices.find((v) => v.lang.startsWith(language === "sw" ? "sw" : "en"));
      if (preferred) utter.voice = preferred;

      window.speechSynthesis.speak(utter);
    },
    [supported, voices]
  );

  return { speak, supported };
}
