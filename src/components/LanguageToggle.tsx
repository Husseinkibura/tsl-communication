import { Language } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  language: Language;
  onChange: (l: Language) => void;
}

export function LanguageToggle({ language, onChange }: Props) {
  const opts: { value: Language; label: string; flag: string }[] = [
    { value: "sw", label: "Kiswahili", flag: "🇹🇿" },
    { value: "en", label: "English", flag: "🇬🇧" },
  ];

  return (
    <div className="glass rounded-2xl p-2 grid grid-cols-2 gap-2">
      {opts.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={language === o.value}
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all text-sm",
            "hover:scale-[1.02] active:scale-95",
            language === o.value
              ? "gradient-primary text-primary-foreground shadow-lg glow"
              : "text-foreground/70 hover:bg-white/5"
          )}
        >
          <span className="text-lg">{o.flag}</span>
          {o.label}
        </button>
      ))}
    </div>
  );
}
