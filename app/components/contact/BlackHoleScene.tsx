"use client";
import { useMemo, useRef } from "react";
import { Group } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { AccretionDiskMaterial } from "../../effects/AccretionDiskMaterial";

const EVENT_HORIZON_RADIUS = 0.85;

const DISK_INNER = 1.0;
const DISK_OUTER = 3.4;
// Mostly edge-on, tipped just enough that the camera sees the disk's top
// surface, matching the reference image's shallow viewing angle.
const DISK_TILT_X = -(Math.PI / 2 - 0.22);

const HALO_INNER = 0.9;
const HALO_OUTER = 1.5;
const HALO_TILT_X = -0.12;

// Authored footprint of the whole composition (disk diameter x halo height),
// used to shrink the scene on narrow viewports like object-fit: contain —
// the same clamp pattern as CRTScene/SkillsScene.
const DESIGN_WIDTH = 7.2;
const DESIGN_HEIGHT = 3.6;

function BlackHole() {
  const groupRef = useRef<Group>(null);
  const { viewport } = useThree();

  const diskMaterial = useMemo(
    () => new AccretionDiskMaterial({ innerRadius: DISK_INNER, outerRadius: DISK_OUTER, intensity: 1.0 }),
    []
  );
  const haloMaterial = useMemo(
    () => new AccretionDiskMaterial({ innerRadius: HALO_INNER, outerRadius: HALO_OUTER, intensity: 0.75 }),
    []
  );

  useFrame((_, delta) => {
    diskMaterial.update(delta);
    haloMaterial.update(delta);
    if (groupRef.current) {
      // Desktop/landscape: contain, like About/Skills. Portrait/mobile: fit
      // to height only and let the disk overflow past the screen's edges
      // horizontally (section has overflow-hidden) — a small centered black
      // hole reads worse on a narrow phone screen than a large clipped one.
      const isPortrait = viewport.width < viewport.height;
      const scale = isPortrait
        ? viewport.height / DESIGN_HEIGHT
        : Math.min(1, viewport.width / DESIGN_WIDTH, viewport.height / DESIGN_HEIGHT);
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[EVENT_HORIZON_RADIUS, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <mesh rotation={[DISK_TILT_X, 0, 0]} material={diskMaterial}>
        <ringGeometry args={[DISK_INNER, DISK_OUTER, 128, 1]} />
      </mesh>

      {/* Near-face-on ring hugging the silhouette: reads as the disk's light
          bending over the poles without a true lensing simulation. */}
      <mesh rotation={[HALO_TILT_X, 0, 0]} material={haloMaterial}>
        <ringGeometry args={[HALO_INNER, HALO_OUTER, 128, 1]} />
      </mesh>
    </group>
  );
}

export default function BlackHoleScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <BlackHole />
        <EffectComposer>
          <Bloom intensity={1.1} luminanceThreshold={0.25} luminanceSmoothing={0.8} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
