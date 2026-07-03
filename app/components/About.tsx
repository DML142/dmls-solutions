"use client";
import { forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import CRTPostEffect from "./CRTPostEffect";

const About = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="fixed top-full left-0 w-full h-screen bg-black z-30 select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#000000"]} />

        <Text
          position={[0, 0.4, 0]}
          fontSize={0.28}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {"> About Me"}
        </Text>

        <Text
          position={[0, -0.2, 0]}
          fontSize={0.14}
          color="#cccccc"
          maxWidth={3.2}
          textAlign="center"
          lineHeight={1.4}
          anchorX="center"
          anchorY="middle"
        >
          [System initialized. Screen rendered through a WebGL context, isolated from global HTML filters.]
        </Text>

        <EffectComposer>
          <CRTPostEffect />
        </EffectComposer>
      </Canvas>
    </div>
  );
});

About.displayName = "AboutMeSection";

export default About;
