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

    // A numeric `scrub` only smooths the playhead of an animation that
    // ScrollTrigger is driving — reading `self.progress` off a bare
    // ScrollTrigger (no attached tween) gives the raw, unsmoothed scroll
    // position instead, per GSAP's own docs. So the "smoothed progress" has
    // to be an actual tweened value: `state.value` chases the real scroll
    // position over ~1.1s, and everything below reads that, not raw scroll.
    const state = { value: 0 };
    const tween = gsap.to(state, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.1,
      },
      onUpdate: () => {
        progressRef.current = state.value;
        const { phase, localProgress } = getSkillsPhase(state.value);
        const opacity = getCardOpacity(localProgress);
        if (cardRef.current) {
          cardRef.current.style.opacity = String(opacity);
          // Ramp the card's backdrop blur with the same fade so it grows in
          // smoothly instead of popping to full strength (backdrop-filter
          // otherwise ignores the wrapper's opacity).
          cardRef.current.style.setProperty("--card-blur", `${(opacity * 10).toFixed(2)}px`);
        }
        const nextActivePhase = opacity > 0 ? phase : null;
        setActivePhase((prev) => (prev === nextActivePhase ? prev : nextActivePhase));
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [sectionRef]);

  return { progressRef, activePhase, cardRef };
}
