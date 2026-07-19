// frontend/src/components/PhrasesList.tsx
import { PHRASES_LIST } from "@/utils/medicalPhrases";
import { Language, GestureKey } from "@/types";

interface Props {
  language: Language;
  current: GestureKey | null;
}

export function PhrasesList({ language, current }: Props) {
  return (
    <div className="glass rounded-2xl p-3 sm:p-4">
      <h3 className="text-sm font-semibold text-foreground/80 mb-3 px-1">
        Medical Phrases ({PHRASES_LIST.length})
      </h3>
      <div className="space-y-1.5 max-h-[60vh] lg:max-h-[420px] overflow-y-auto pr-1">
        {PHRASES_LIST.map((p) => {
          const text = language === "sw" ? p.swahili : p.english;
          const active = current === p.key;
          return (
            <div
              key={p.key}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all
                ${active ? "bg-primary/20 border border-primary/40 glow" : "bg-white/[0.03] border border-transparent"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-primary/90">
                  {p.label}
                </div>
                <div className="text-sm text-foreground/80 break-words">{text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// import { PHRASES_LIST } from "@/utils/medicalPhrases";
// import { Language, GestureKey } from "@/types";

// interface Props {
//   language: Language;
//   current: GestureKey | null;
// }

// export function PhrasesList({ language, current }: Props) {
//   return (
//     <div className="glass rounded-2xl p-3 sm:p-4">
//       <h3 className="text-sm font-semibold text-foreground/80 mb-3 px-1">
//         Medical Phrases ({PHRASES_LIST.length})
//       </h3>
//       <div className="space-y-1.5 max-h-[60vh] lg:max-h-[420px] overflow-y-auto pr-1">
//         {PHRASES_LIST.map((p) => {
//           const text = language === "sw" ? p.swahili : p.english;
//           const active = current === p.key;
//           return (
//             <div
//               key={p.key}
//               className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all
//                 ${active ? "bg-primary/20 border border-primary/40 glow" : "bg-white/[0.03] border border-transparent"}`}
//             >
//               <div className="flex-1 min-w-0">
//                 <div className="text-xs font-bold uppercase tracking-wider text-primary/90">
//                   {p.label}
//                 </div>
//                 <div className="text-sm text-foreground/80 break-words">{text}</div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
