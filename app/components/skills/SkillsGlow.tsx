"use client";
import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WHITE = "#ffffff";
const NEST_PINK = "#e0234e";

// Phase boundaries at 1/3 and 2/3 of the overall scroll progress, with the
// crossfade straddling each one rather than snapping the instant the next
// logo's phase begins.
const BOUNDARY_1 = 1 / 3;
const BOUNDARY_2 = 2 / 3;
const TRANSITION_WIDTH = 0.08;

function ramp(edge0: number, edge1: number, x: number): number {
  return Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
}

// 0 = fully white, 1 = fully NestJS pink.
function pinkBlend(progress: number): number {
  const rampUp = ramp(BOUNDARY_1 - TRANSITION_WIDTH, BOUNDARY_1 + TRANSITION_WIDTH, progress);
  const rampDown = 1 - ramp(BOUNDARY_2 - TRANSITION_WIDTH, BOUNDARY_2 + TRANSITION_WIDTH, progress);
  return Math.min(rampUp, rampDown);
}

interface SkillsGlowProps {
  sectionRef: RefObject<HTMLElement | null>;
}

// A small, soft circular glow centered on the otherwise pure-black stage,
// tinted by whichever phase is active (white for Next.js/Other, NestJS
// red-pink for NestJS).
export default function SkillsGlow({ sectionRef }: SkillsGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !glowRef.current) return;
    const glow = glowRef.current;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.4,
      onUpdate: (self) => {
        const color = gsap.utils.interpolate(WHITE, NEST_PINK, pinkBlend(self.progress));
        glow.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
      },
    });

    return () => trigger.kill();
  }, [sectionRef]);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-2xl"
      style={{ background: `radial-gradient(circle, ${WHITE} 0%, transparent 70%)` }}
    />
  );
}
