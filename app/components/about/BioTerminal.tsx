"use client";
import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Frame from "./Frame";
import { TERMINAL_FONT } from "./theme";

const BOX_WIDTH = 3.5;
const BOX_HEIGHT = 2.3;

const BIO_TEXT =
  "I'm DML_142, or Max, 18 year old fullstack web developer from Ukraine. " +
  "I know Ukrainian, Russian and English languages, I can write, read and speak them. " +
  "My hobby is reading books and web development. Currently I'm in active job search. " +
  "I have good communication and co-work skills, also I can build structured fullstack " +
  "applications with AI. I started learning programming in 2017 and working with Node.js in 2023.";

function BlinkingCursor({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.visible = Math.floor(clock.elapsedTime * 2.4) % 2 === 0;
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.065, 0.12]} />
      <meshBasicMaterial color="#8cffab" />
    </mesh>
  );
}

interface BioTerminalProps {
  position?: [number, number, number];
}

export default function BioTerminal({ position = [0, 0, 0] }: BioTerminalProps) {
  return (
    <group position={position}>
      <Text
        position={[-BOX_WIDTH / 2, BOX_HEIGHT / 2 + 0.17, 0]}
        font={TERMINAL_FONT}
        fontSize={0.13}
        color="#8cffab"
        anchorX="left"
        anchorY="middle"
      >
        {"> about_me.txt"}
      </Text>
      <BlinkingCursor position={[-BOX_WIDTH / 2 + 0.85, BOX_HEIGHT / 2 + 0.17, 0]} />

      <Frame width={BOX_WIDTH} height={BOX_HEIGHT} />

      <Text
        position={[0, 0, 0]}
        font={TERMINAL_FONT}
        fontSize={0.15}
        lineHeight={1.4}
        maxWidth={BOX_WIDTH - 0.35}
        textAlign="left"
        color="#9effb4"
        anchorX="center"
        anchorY="middle"
      >
        {BIO_TEXT}
      </Text>
    </group>
  );
}
