"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SkillPhaseIndex, getSkillsPhase, getCardOpacity } from "../lib/skillsPhases";

gsap.registerPlugin(ScrollTrigger);

export interface SkillsScrollState {
  // Raw 0..1 progress, updated every scroll frame. Exposed as a ref (not
  // React state) so the R3F scene can read it per-frame without triggering
  // a React re-render on every pixel of scroll.
  progressRef: RefObject<number>;
  // Which phase's text card content should be mounted, or null between
  // phases. React state, since the text card needs to re-render on this
  // discrete change, not on every scroll pixel.
  activePhase: SkillPhaseIndex | null;
  // Attach to the card's wrapper element; its opacity is written directly
  // from scroll progress (scrub-driven fade, no React involvement).
  cardRef: RefObject<HTMLDivElement | null>;
}

export function useSkillsScrollProgress(
  sectionRef: RefObject<HTMLElement | null>
): SkillsScrollState {
  const progressRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState<SkillPhaseIndex | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      // Numeric scrub adds a catch-up lag so the animation eases toward the
      // scroll position instead of tracking it 1:1 (reads as an in/out ease
      // on every wheel notch) without breaking reversibility.
      scrub: 1.4,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const { phase, localProgress } = getSkillsPhase(self.progress);
        const opacity = getCardOpacity(localProgress);
        if (cardRef.current) {
          cardRef.current.style.opacity = String(opacity);
        }
        const nextActivePhase = opacity > 0 ? phase : null;
        setActivePhase((prev) => (prev === nextActivePhase ? prev : nextActivePhase));
      },
    });

    return () => trigger.kill();
  }, [sectionRef]);

  return { progressRef, activePhase, cardRef };
}
