"use client";
import { useRef, useState } from "react";
import { Group } from "three";
import { Text, useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import Frame from "./Frame";
import { TERMINAL_FONT } from "./theme";

const MENU_WIDTH = 3.6;
const MENU_HEIGHT = 0.36;

interface MenuTarget {
  label: string;
  // "top" = hero, "bottom" = about; null = section not built yet
  target: "top" | "bottom" | null;
}

const ITEMS: MenuTarget[] = [
  { label: "HOME", target: "top" },
  { label: "ABOUT", target: "bottom" },
  { label: "SKILLS", target: null },
  { label: "CONTACT", target: null },
];

function navigate(item: MenuTarget) {
  if (item.target === null) return;
  const top = item.target === "top"
    ? 0
    : document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top, behavior: "smooth" });
}

interface MenuItemProps {
  label: string;
  x: number;
  cellWidth: number;
  onSelect: () => void;
}

function MenuItem({ label, x, cellWidth, onSelect }: MenuItemProps) {
  const fillRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const setHover = (on: boolean) => {
    setHovered(on);
    if (fillRef.current) {
      gsap.to(fillRef.current.scale, { x: on ? 1 : 0, duration: 0.28, ease: "power2.out" });
    }
  };

  return (
    <group position={[x, 0, 0]}>
      {/* Fill wrapper sits at the cell's left edge with the plane offset right,
          so animating scale.x sweeps the highlight left-to-right. */}
      <group ref={fillRef} position={[-cellWidth / 2, 0, 0.002]} scale={[0, 1, 1]}>
        <mesh position={[cellWidth / 2, 0, 0]}>
          <planeGeometry args={[cellWidth, MENU_HEIGHT]} />
          <meshBasicMaterial color="#2bff5a" />
        </mesh>
      </group>

      <Text
        position={[0, 0, 0.004]}
        font={TERMINAL_FONT}
        fontSize={0.14}
        letterSpacing={0.08}
        color={hovered ? "#00220a" : "#8cffab"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Invisible hit area on top so hover state doesn't flicker
          when the pointer crosses between the fill plane and the text. */}
      <mesh
        position={[0, 0, 0.006]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
        onClick={onSelect}
      >
        <planeGeometry args={[cellWidth, MENU_HEIGHT]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface CRTMenuProps {
  position?: [number, number, number];
}

export default function CRTMenu({ position = [0, 0, 0] }: CRTMenuProps) {
  const cellWidth = MENU_WIDTH / ITEMS.length;

  return (
    <group position={position}>
      <Frame width={MENU_WIDTH} height={MENU_HEIGHT} />

      {ITEMS.map((item, i) => (
        <MenuItem
          key={item.label}
          label={item.label}
          x={-MENU_WIDTH / 2 + cellWidth * (i + 0.5)}
          cellWidth={cellWidth}
          onSelect={() => navigate(item)}
        />
      ))}

      {[1, 2, 3].map((i) => (
        <mesh key={i} position={[-MENU_WIDTH / 2 + cellWidth * i, 0, 0.001]}>
          <planeGeometry args={[0.014, MENU_HEIGHT]} />
          <meshBasicMaterial color="#35e065" />
        </mesh>
      ))}
    </group>
  );
}
