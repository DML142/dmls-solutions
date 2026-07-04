import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TRIGGER_POINT, LOCK_DISTANCE } from "../hooks/useHeroScrollAnimation";

gsap.registerPlugin(ScrollToPlugin);

export type SectionTarget = "top" | "about" | "skills" | "contact";

// Plain #anchor scrolling can't be used here: About is scroll-jacked
// (fixed while raising, then absolute) so jumping straight to an
// arbitrary offset can land mid-animation in a broken visual state.
// Every nav entry point (CRT in-scene menu, DOM navbar) must go through
// this same geometry-aware scroll instead of native anchor navigation.
export function scrollToSection(target: SectionTarget) {
  let scrollTo: number | Element;

  if (target === "top") {
    scrollTo = 0;
  } else if (target === "about") {
    // Midpoint of the post-raise lock range: About is guaranteed to be
    // fully raised and static there, regardless of the raise's own 0.7s
    // real-time animation still being mid-flight right at TRIGGER_POINT.
    scrollTo = TRIGGER_POINT + LOCK_DISTANCE / 2;
  } else if (target === "skills") {
    const skillsEl = document.getElementById("skills-section");
    if (!skillsEl) return;
    scrollTo = skillsEl;
  } else {
    // Contact section doesn't exist yet.
    return;
  }

  gsap.to(window, {
    duration: 1,
    ease: "power2.inOut",
    scrollTo: { y: scrollTo, autoKill: true },
  });
}
