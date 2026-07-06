"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

interface WaveButtonProps {
  children?: string;
  theme?: "light" | "dark";
  onClick?: () => void;
}

export default function WaveButton({ children = "CONTACT NOW", theme = "light", onClick }: WaveButtonProps) {
  const isDark = theme === "dark";
  const btnRef  = useRef<HTMLButtonElement>(null);
  const waveRef = useRef<SVGSVGElement>(null);
  const invRef  = useRef<HTMLSpanElement>(null);
  const tlRef   = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const btn  = btnRef.current;
    const wave = waveRef.current;
    const inv  = invRef.current;
    if (!btn || !wave || !inv) return;

    gsap.set(wave, { x: "-115%" });
    gsap.set(inv, { clipPath: "inset(0% 100% 0% 0%)" });

    const tl = gsap.timeline({ paused: true })
      .to(wave, { x: "0%", duration: 0.5, ease: "power2.inOut" })
      .to(inv, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.inOut" }, "<");

    tlRef.current = tl;

    let isTouch = false;

    const playAnimation = () => tl.play();
    const reverseAnimation = () => tl.reverse();

    const handleTouchStart = () => {
      isTouch = true;
      playAnimation();
    };

    const handleTouchEnd = () => {
      reverseAnimation();
    };

    const handleMouseEnter = () => {
      if (!isTouch) playAnimation();
    };

    const handleMouseLeave = () => {
      if (!isTouch) reverseAnimation();
      isTouch = false;
    };

    btn.addEventListener("touchstart", handleTouchStart, { passive: true });
    btn.addEventListener("touchend", handleTouchEnd);
    btn.addEventListener("touchcancel", handleTouchEnd);

    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("touchstart", handleTouchStart);
      btn.removeEventListener("touchend", handleTouchEnd);
      btn.removeEventListener("touchcancel", handleTouchEnd);
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mouseleave", handleMouseLeave);
      tl.kill();
    };
  }, []);

  const labelClasses = "text-[13px] font-bold tracking-[0.12em] select-none font-inherit";
  const waveFill = isDark ? "#ffffff" : "#000000";
  const borderClass = isDark ? "border-white" : "border-black";
  const bgClass = isDark ? "bg-black/15" : "bg-white/15";
  const labelColorClass = isDark ? "text-white" : "text-black";
  const inverseColorClass = isDark ? "text-black" : "text-white";

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center py-3.5 px-9 border-[1.5px] ${borderClass} rounded-lg ${bgClass} overflow-hidden cursor-pointer touch-manipulation`}
    >
      <svg
        ref={waveRef}
        aria-hidden="true"
        style={{ transform: "translateX(-115%)" }}
        className="absolute inset-0 w-[130%] h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 130 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 L112,0 C115,4 120,10 116,20 C112,30 117,36 112,40 L0,40 Z" fill={waveFill} />
      </svg>

      <span className={`${labelClasses} relative z-10 ${labelColorClass}`}>
        {children}
      </span>

      <span
        ref={invRef}
        aria-hidden="true"
        style={{
          clipPath: "inset(0% 100% 0% 0%)",
          transform: "translateZ(0)",
          willChange: "clip-path"
        }}
        className={`${labelClasses} absolute inset-0 flex items-center justify-center z-20 ${inverseColorClass} pointer-events-none`}
      >
        {children}
      </span>
    </button>
  );
}
