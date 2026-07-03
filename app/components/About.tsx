"use client";
import { forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import CRTPostEffect from "./CRTPostEffect";
import CRTScene from "./about/CRTScene";

const About = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="fixed top-full left-0 w-full h-screen z-30 select-none bg-black flex justify-center"
    >
      {/* Full height always. Phones stay full-bleed on both axes; tablets get
          a portrait 3:4 monitor; desktop widens to a landscape 4:3 monitor
          instead of staying phone-narrow on wide screens. */}
      <div className="relative h-full w-full sm:w-auto sm:aspect-[3/4] lg:aspect-[4/3] overflow-hidden bg-black">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ antialias: true }}>
          <color attach="background" args={["#000000"]} />
          <CRTScene />
          <EffectComposer>
            <CRTPostEffect />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
});

About.displayName = "AboutMeSection";

export default About;
