"use client";
import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// These two values are baked into the hero runway's height
// (h-[calc(100vh+750px)] in Hero.tsx = 100vh + TRIGGER_POINT + LOCK_DISTANCE).
// That equality is what makes the About→Skills hand-off read as normal
// scrolling: the instant the lock ends, Skills' top edge (in normal flow)
// is exactly at the viewport bottom, flush with About's bottom edge.
export const TRIGGER_POINT = 300;
export const LOCK_DISTANCE = 450;

interface HeroScrollRefs {
  titleRef: RefObject<HTMLHeadingElement | null>;
  subtitleRef: RefObject<HTMLParagraphElement | null>;
  scrollContentRef: RefObject<HTMLDivElement | null>;
  arrowFillRef: RefObject<SVGSVGElement | null>;
  aboutRef: RefObject<HTMLDivElement | null>;
}

// Drives the hero's intro title/subtitle reveal and the scroll-triggered
// hand-off from the hero into the About monitor section.
export function useHeroScrollAnimation({
  titleRef,
  subtitleRef,
  scrollContentRef,
  arrowFillRef,
  aboutRef,
}: HeroScrollRefs) {
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.4 },
    });

    tl.from(titleRef.current, {
      yPercent: 100,
      opacity: 0,
    }).from(
      subtitleRef.current,
      {
        yPercent: 100,
        opacity: 0,
      },
      "-=1.0"
    );
  }, [titleRef, subtitleRef]);

  useEffect(() => {
    if (!scrollContentRef.current || !arrowFillRef.current || !aboutRef.current) return;

    const ctx = gsap.context(() => {
      // Arrow fills in smoothly over the first TRIGGER_POINT px of scroll.
      gsap.to(arrowFillRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: scrollContentRef.current,
          start: "top top",
          end: `+=${TRIGGER_POINT}`,
          scrub: true,
        },
      });

      // At the trigger point, the About monitor auto-raises over the hero
      // (plays on its own, not scrubbed) and the navbar tucks away; scrolling
      // back above the trigger point reverses both. This tween owns yPercent.
      const raiseTl = gsap
        .timeline({
          scrollTrigger: {
            trigger: scrollContentRef.current,
            start: `+=${TRIGGER_POINT} top`,
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(
          aboutRef.current,
          { yPercent: 0 },
          { yPercent: -100, duration: 0.7, ease: "power2.inOut" }
        )
        .to(".site-navbar", { yPercent: -100, duration: 0.5, ease: "power2.inOut" }, 0);

      // After LOCK_DISTANCE more px of scroll, About releases into the
      // browser's *native* scroll instead of continuing to be JS-animated:
      // at the exact release point it flips from position:fixed to
      // position:absolute at the document offset that visually matches
      // where the fixed version already was, with its transform cleared.
      // From then on the browser scrolls it exactly like any other
      // element — same rate as Skills scrolling in below it, by
      // construction, with zero per-frame lag possible. (A scrub tween
      // trying to mirror native scroll pixel-for-pixel on a fixed element
      // was the actual cause of the seam: GSAP's scrub applies on the next
      // animation frame, native scroll paints immediately, so under fast
      // wheel input About would lag a frame behind Skills and expose the
      // hero underneath through the gap.)
      // Fast scrolling can cross the raise trigger (TRIGGER_POINT) and this
      // release trigger in the same tick. The raise is time-based (0.7s),
      // so on a fast scroll it's still mid-animation when release's onEnter
      // fires — without forcing it to completion first, the still-running
      // raise tween keeps writing yPercent toward -100 *after* the swap to
      // position:absolute, landing on `top:releasePoint` + `translateY(-100%)`,
      // which computes to a negative document offset (releasePoint minus a
      // full viewport height) — off-screen above wherever you've scrolled
      // to, i.e. About goes invisible. Forcing raiseTl.progress(1) makes the
      // release deterministic regardless of scroll speed.
      const releasePoint = TRIGGER_POINT + LOCK_DISTANCE;
      ScrollTrigger.create({
        trigger: scrollContentRef.current,
        start: `+=${releasePoint} top`,
        onEnter: () => {
          if (!aboutRef.current) return;
          raiseTl.progress(1);
          gsap.set(aboutRef.current, { yPercent: 0, y: 0 });
          aboutRef.current.style.position = "absolute";
          aboutRef.current.style.top = `${releasePoint}px`;
          // The navbar tucked away at TRIGGER_POINT; reveal it again (in its
          // dark theme, handled separately in Navbar.tsx) once Skills starts.
          gsap.to(".site-navbar", { yPercent: 0, duration: 0.5, ease: "power2.inOut" });
        },
        onLeaveBack: () => {
          if (!aboutRef.current) return;
          aboutRef.current.style.position = "";
          aboutRef.current.style.top = "";
          gsap.set(aboutRef.current, { yPercent: -100 });
          gsap.to(".site-navbar", { yPercent: -100, duration: 0.5, ease: "power2.inOut" });
        },
      });
    });

    return () => ctx.revert();
  }, [scrollContentRef, arrowFillRef, aboutRef]);
}
