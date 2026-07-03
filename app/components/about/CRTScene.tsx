"use client";
import { useEffect, useRef } from "react";
import { Group, MathUtils } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import CRTMenu from "./CRTMenu";
import BioTerminal from "./BioTerminal";

// Content is authored for a ~3.6-unit-wide layout; the margin keeps it off the warped edges.
const DESIGN_WIDTH = 4.0;
const MENU_HALF_HEIGHT = 0.18;
// Fixed viewport-space gap between the menu and the top edge, independent of
// content scale, so the menu stays pinned near the top on very tall/narrow
// screens (mobile full-bleed) instead of drifting toward vertical center.
const TOP_MARGIN = 0.3;

export default function CRTScene() {
  const groupRef = useRef<Group>(null);
  const menuRef = useRef<Group>(null);
  const bioRef = useRef<Group>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / DESIGN_WIDTH);

  // Track the pointer across the whole window (not just the canvas),
  // normalized to [-1, 1] like r3f's own pointer.
  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      pointerRef.current.x = (clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(clientY / window.innerHeight) * 2 + 1;
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    // Damped gentle tilt toward the pointer.
    group.rotation.x = MathUtils.damp(group.rotation.x, -pointerRef.current.y * 0.02, 4, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, pointerRef.current.x * 0.035, 4, delta);

    // Menu is pinned a fixed gap below the viewport's top edge.
    const menuLocalY = (viewport.height / 2 - TOP_MARGIN) / scale;
    if (menuRef.current) {
      menuRef.current.position.y = MathUtils.damp(menuRef.current.position.y, menuLocalY, 6, delta);
    }

    // Bio box centers itself in whatever space is left between the menu
    // and the bottom of the viewport, instead of sitting a fixed gap below
    // the menu (which left a lot of dead space on tall/mobile screens).
    if (bioRef.current) {
      const menuBottomWorld = (menuLocalY - MENU_HALF_HEIGHT) * scale;
      const viewportBottomWorld = -viewport.height / 2;
      const bioLocalY = (menuBottomWorld + viewportBottomWorld) / 2 / scale;
      bioRef.current.position.y = MathUtils.damp(bioRef.current.position.y, bioLocalY, 6, delta);
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <group ref={menuRef}>
        <CRTMenu />
      </group>
      <group ref={bioRef}>
        <BioTerminal />
      </group>
    </group>
  );
}
