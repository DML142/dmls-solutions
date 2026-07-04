"use client";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import SkillsScene from "./skills/SkillsScene";
import SkillsGlow from "./skills/SkillsGlow";
import SkillsTextCard from "./skills/SkillsTextCard";
import { useSkillsScrollProgress } from "../hooks/useSkillsScrollProgress";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progressRef, activePhase, cardRef } = useSkillsScrollProgress(sectionRef);

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
        </Canvas>
        {/* Opacity on this wrapper is scrub-driven by useSkillsScrollProgress. */}
        <div ref={cardRef} style={{ opacity: 0 }}>
          <SkillsTextCard activePhase={activePhase} />
        </div>
      </div>
    </section>
  );
}
