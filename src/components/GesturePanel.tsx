// frontend/src/components/GesturePanel.tsx
import { GestureKey, Language } from "@/types";
import { MEDICAL_PHRASES } from "@/utils/medicalPhrases";

interface Props {
  gesture: GestureKey | null;
  confidence: number;
  language: Language;
}

export function GesturePanel({ gesture, confidence, language }: Props) {
  const phrase = gesture ? MEDICAL_PHRASES[gesture] : null;
  const text = phrase ? (language === "sw" ? phrase.swahili : phrase.english) : null;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
      {phrase ? (
        <div key={gesture} className="animate-bounce-in">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-primary uppercase">
              {phrase.label}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-primary/80 bg-primary/20 px-2 py-0.5 rounded-full">
              {Math.round(confidence * 100)}%
            </span>
          </div>
          <p className="text-base sm:text-2xl font-semibold text-white drop-shadow-md leading-tight">
            {text}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-white/70">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse flex-shrink-0" />
          <p className="text-xs sm:text-base">Show a TSL medical gesture to begin…</p>
        </div>
      )}
    </div>
  );
}

// import { GestureKey, Language } from "@/types";
// import { MEDICAL_PHRASES } from "@/utils/medicalPhrases";

// interface Props {
//   gesture: GestureKey | null;
//   confidence: number;
//   language: Language;
// }

// export function GesturePanel({ gesture, confidence, language }: Props) {
//   const phrase = gesture ? MEDICAL_PHRASES[gesture] : null;
//   const text = phrase ? (language === "sw" ? phrase.swahili : phrase.english) : null;

//   return (
//     <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
//       {phrase ? (
//         <div key={gesture} className="animate-bounce-in">
//           <div className="flex items-center gap-2 mb-1 flex-wrap">
//             <span className="text-[10px] sm:text-xs font-bold tracking-widest text-primary uppercase">
//               {phrase.label}
//             </span>
//             <span className="text-[10px] sm:text-xs font-mono text-primary/80 bg-primary/20 px-2 py-0.5 rounded-full">
//               {Math.round(confidence * 100)}%
//             </span>
//           </div>
//           <p className="text-base sm:text-2xl font-semibold text-white drop-shadow-md leading-tight">
//             {text}
//           </p>
//         </div>
//       ) : (
//         <div className="flex items-center gap-3 text-white/70">
//           <div className="h-3 w-3 rounded-full bg-primary animate-pulse flex-shrink-0" />
//           <p className="text-xs sm:text-base">Show a TSL medical gesture to begin…</p>
//         </div>
//       )}
//     </div>
//   );
// }
