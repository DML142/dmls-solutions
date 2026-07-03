"use client";
import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
      const triggerPoint = 300;

      // Arrow fills in smoothly over the first `triggerPoint` px of scroll.
      gsap.to(arrowFillRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: scrollContentRef.current,
          start: "top top",
          end: `+=${triggerPoint}`,
          scrub: true,
        },
      });

      // Past that point, the About monitor slides up from under the hero
      // and the global navbar tucks away above the viewport (the CRT scene
      // has its own in-screen menu); scrolling back reverses both.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: scrollContentRef.current,
            start: `+=${triggerPoint} top`,
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(
          aboutRef.current,
          { yPercent: 0 },
          { yPercent: -100, duration: 0.7, ease: "power2.inOut" }
        )
        .to(".site-navbar", { yPercent: -100, duration: 0.5, ease: "power2.inOut" }, 0);
    });

    return () => ctx.revert();
  }, [scrollContentRef, arrowFillRef, aboutRef]);
}
