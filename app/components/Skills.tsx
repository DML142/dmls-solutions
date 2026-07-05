"use client";
import { useMemo, useRef } from "react";
import { Vector2 } from "three";
import { Canvas } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import SkillsScene from "./skills/SkillsScene";
import SkillsGlow from "./skills/SkillsGlow";
import SkillsTextCard from "./skills/SkillsTextCard";
import { useSkillsScrollProgress } from "../hooks/useSkillsScrollProgress";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progressRef, activePhase, cardRef } = useSkillsScrollProgress(sectionRef);
  // Small, fixed UV offset — kept subtle so it reads as a lens fringe, not a glitch.
  const chromaticOffset = useMemo(() => new Vector2(0.0006, 0.0006), []);

  return (
    <section
      ref={sectionRef}
      id="skills-section"
      className="relative z-20 w-full h-[600vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <SkillsGlow sectionRef={sectionRef} />
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <SkillsScene progressRef={progressRef} />
          {/* Bloom for a soft glow on the bright logos, plus a faint
              chromatic aberration fringe for a bit of lens character. */}
          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration offset={chromaticOffset} radialModulation modulationOffset={0.3} />
          </EffectComposer>
        </Canvas>
        {/* Opacity on this wrapper is scrub-driven by useSkillsScrollProgress. */}
        <div ref={cardRef} style={{ opacity: 0 }}>
          <SkillsTextCard activePhase={activePhase} />
        </div>
      </div>
    </section>
  );
}
