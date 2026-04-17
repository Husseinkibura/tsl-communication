import { PHRASES_LIST } from "@/utils/medicalPhrases";
import { Language, GestureKey } from "@/types";

interface Props {
  language: Language;
  current: GestureKey | null;
  onSelect: (key: GestureKey) => void;
}

export function PhrasesList({ language, current, onSelect }: Props) {
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-foreground/80 mb-3 px-1">
        Medical Phrases ({PHRASES_LIST.length})
      </h3>
      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {PHRASES_LIST.map((p) => {
          const text = language === "sw" ? p.swahili : p.english;
          const active = current === p.key;
          return (
            <button
              key={p.key}
              onClick={() => onSelect(p.key)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all
                hover:scale-[1.02] active:scale-95 hover:bg-white/10
                ${active ? "bg-primary/20 border border-primary/40 glow" : "bg-white/[0.03] border border-transparent"}`}
            >
              <span className="text-2xl flex-shrink-0">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-primary/90">
                  {p.label}
                </div>
                <div className="text-sm text-foreground/80 truncate">{text}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
