"use client";
import { useRef } from "react";
import { Viaoda_Libre, Inter } from "next/font/google";
import Image from "next/image";
import About from "./About";
import { useStarField } from "../hooks/useStarField";
import { useHeroScrollAnimation } from "../hooks/useHeroScrollAnimation";

const viaodaLibre = Viaoda_Libre({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function HeroPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollContentRef = useRef<HTMLDivElement>(null);
  const arrowFillRef = useRef<SVGSVGElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useHeroScrollAnimation({ titleRef, subtitleRef, scrollContentRef, arrowFillRef, aboutRef });
  useStarField(canvasRef, textContainerRef);

  return (
    // Runway height = 100vh + TRIGGER_POINT + LOCK_DISTANCE (see
    // useHeroScrollAnimation). Skills sits in normal flow right after this
    // runway, so its top edge reaches the viewport bottom exactly when the
    // About lock ends — that alignment is what makes the About→Skills
    // hand-off feel like plain browser scrolling.
    <div ref={scrollContentRef} className="relative w-full h-[calc(100vh+750px)] bg-black">

      {/* Fixed hero viewport — stays in place while the page scrolls underneath */}
      <div className="fixed inset-0 w-full overflow-hidden bg-white flex flex-col items-center justify-center select-none touch-pan-y z-10">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

        <div className="absolute top-24 left-6 pointer-events-none z-20 rotate-90">
          <Image src="/vector1.png" alt="Corner pattern" width={60} height={60} priority loading="eager" />
        </div>
        <div className="absolute top-24 right-6 pointer-events-none z-20 -rotate-90 -scale-x-100">
          <Image src="/vector1.png" alt="Corner pattern" width={60} height={60} priority loading="eager" />
        </div>
        <div className="absolute bottom-6 left-6 pointer-events-none z-20 rotate-90 -scale-x-100">
          <Image src="/vector1.png" alt="Corner pattern" width={60} height={60} loading="eager" />
        </div>
        <div className="absolute bottom-6 right-6 pointer-events-none z-20 rotate-90 -scale-100">
          <Image src="/vector1.png" alt="Corner pattern" width={60} height={60} loading="eager" />
        </div>

        <div className="text-center z-0 flex flex-col items-center justify-center perspective-[1000px] transform-3d">
          <div ref={textContainerRef} className="will-change-transform transform-3d">
            <div className="overflow-hidden py-2 px-1 binding-box">
              <h1
                ref={titleRef}
                className={`${viaodaLibre.className} [text-shadow:0_3px_5px_rgba(0,0,0,0.55)] text-black text-6xl md:text-[84px] leading-tight tracking-normal will-change-transform`}
              >
                DML_142
              </h1>
            </div>

            <div className="overflow-hidden pb-2 mt-4 binding-box">
              <p
                ref={subtitleRef}
                className={`${inter.className} [text-shadow:0_3px_3px_rgba(0,0,0,0.55)] text-black lg:text-xl text-sm font-light tracking-wide opacity-80 will-change-transform`}
              >
                Web frontend|backend developer
              </p>
            </div>
            <p className="pl-3 h-full absolute bottom-0 text-black">
              Ready for hire
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
          <div className="relative w-5 h-6 mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full absolute inset-0">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>

            <svg
              ref={arrowFillRef}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full absolute inset-0"
              style={{ clipPath: "inset(100% 0% 0% 0%)" }}
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>

          <div className={`${inter.className} text-[10px] font-light tracking-[0.3em] uppercase opacity-50 text-black`}>
            Scroll Down
          </div>
        </div>

      </div>

      {/* About section — sits below the fold (top-[100%]) and slides up on scroll */}
      <About ref={aboutRef} />

    </div>
  );
}
