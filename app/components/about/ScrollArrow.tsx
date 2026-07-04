"use client";
import { useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

const BLOCK = 0.045;
const CELL = BLOCK + 0.006;
// 5-3-1 pixel triangle (top to bottom, 1 = filled column) — a blocky
// downward chevron instead of a smooth vector arrow, to match the CRT's
// pixel-art aesthetic.
const ARROW_ROWS = [
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0],
];
// Two-frame sprite bounce: the arrow snaps between exactly two Y offsets on
// a hard cut (no easing), like an old pixel-art idle animation, rather than
// tweening smoothly.
const FRAME_DURATION = 0.45;
const BOUNCE_OFFSET = 0.035;

interface ScrollArrowProps {
  position?: [number, number, number];
}

export default function ScrollArrow({ position = [0, 0, 0] }: ScrollArrowProps) {
  const bounceRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!bounceRef.current) return;
    const frame = Math.floor(clock.elapsedTime / FRAME_DURATION) % 2;
    bounceRef.current.position.y = frame === 0 ? 0 : -BOUNCE_OFFSET;
  });

  const cols = ARROW_ROWS[0].length;
  const rows = ARROW_ROWS.length;

  return (
    <group position={position}>
      <group ref={bounceRef}>
        {ARROW_ROWS.flatMap((row, rowIndex) =>
          row.map((filled, colIndex) => {
            if (!filled) return null;
            const x = (colIndex - (cols - 1) / 2) * CELL;
            const y = ((rows - 1) / 2 - rowIndex) * CELL;
            return (
              <mesh key={`${rowIndex}-${colIndex}`} position={[x, y, 0]}>
                <planeGeometry args={[BLOCK, BLOCK]} />
                <meshBasicMaterial color="#2bff5a" />
              </mesh>
            );
          })
        )}
      </group>
    </group>
  );
}
