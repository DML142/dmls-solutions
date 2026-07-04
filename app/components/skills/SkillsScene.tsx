"use client";
import { RefObject, useMemo, useRef } from "react";
import { Box3, DoubleSide, Group, Mesh, Vector3 } from "three";
import { Center } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import NextLogo from "./models/NextLogo";
import NestLogo from "./models/NestLogo";
import ThreeLogo from "./models/ThreeLogo";
import {
  SkillPhaseIndex,
  LOGO_DIRECTIONS,
  getLogoProgress,
  getLogoTransform,
} from "../../lib/skillsPhases";

// World-space size every logo is normalized to (camera at z=4 with fov 50
// sees ~3.7 world units of height at z=0, so this fills roughly 2/3 of it).
const TARGET_SIZE = 2.4;
const DESIGN_WIDTH = 4;
const DESIGN_HEIGHT = 4;

// The exported glTF models lie flat, so each gets a -90deg tilt about X to
// stand upright facing the camera.
const FACE_CAMERA_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0];

// Next.js and Three.js were authored so the tilt brings their artwork toward
// the camera mirror-reversed; a scale flip on X corrects the handedness.
const MIRROR_X: [number, number, number] = [-1, 1, 1];

// Unlike the others, NestJS uses no mirror. Its handedness is corrected by a
// half-turn baked into the model geometry (see NestLogo); that turn leaves its
// single lit face pointing away, so the scene renders it double-sided to keep
// it visible.
const NEST_MIRROR: [number, number, number] = [1, 1, 1];

interface SkillsSceneProps {
  progressRef: RefObject<number>;
}

export default function SkillsScene({ progressRef }: SkillsSceneProps) {
  const nextRef = useRef<Group>(null);
  const nestRef = useRef<Group>(null);
  const threeRef = useRef<Group>(null);
  // Per-logo scale factor bringing its measured bounding box to TARGET_SIZE;
  // measured once on the first frame, while the group is still unscaled and
  // unrotated by the tumble.
  const normFactors = useRef<Record<SkillPhaseIndex, number | null>>({ 0: null, 1: null, 2: null });
  const measureBox = useMemo(() => new Box3(), []);
  const measureSize = useMemo(() => new Vector3(), []);
  const { viewport } = useThree();

  useFrame(() => {
    const progress = progressRef.current;
    const responsiveScale = Math.min(1, viewport.width / DESIGN_WIDTH, viewport.height / DESIGN_HEIGHT);
    const effectiveSize = TARGET_SIZE * responsiveScale;
    // Push logos far enough that they clear the actual viewport edge on any
    // screen width (half the visible world + a full logo of margin), so on
    // wide monitors an off-stage logo isn't still peeking in from the side.
    const offstageX = viewport.width / 2 + effectiveSize;

    const groups: [Group | null, SkillPhaseIndex][] = [
      [nextRef.current, 0],
      [nestRef.current, 1],
      [threeRef.current, 2],
    ];

    for (const [group, logoIndex] of groups) {
      if (!group) continue;

      if (normFactors.current[logoIndex] === null) {
        // NestJS's filled-curve mesh is single-sided with its lit face turned
        // away (see NestLogo); rendering both sides is what makes it visible.
        // Harmless for the others. Done once, on the measurement frame.
        group.traverse((obj) => {
          if (obj instanceof Mesh) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            for (const m of mats) {
              if (m) m.side = DoubleSide;
            }
          }
        });
        group.scale.setScalar(1);
        group.updateWorldMatrix(true, true);
        measureBox.setFromObject(group);
        measureBox.getSize(measureSize);
        const maxDim = Math.max(measureSize.x, measureSize.y, measureSize.z);
        if (Number.isFinite(maxDim) && maxDim > 0) {
          normFactors.current[logoIndex] = TARGET_SIZE / maxDim;
        } else {
          continue;
        }
      }

      const logoProgress = getLogoProgress(progress, logoIndex);
      const direction = LOGO_DIRECTIONS[logoIndex];
      const { x, rotationX, rotationY, rotationZ } = getLogoTransform(logoProgress, direction, offstageX);
      group.position.x = x;
      group.rotation.set(rotationX, rotationY, rotationZ);
      group.scale.setScalar(responsiveScale * (normFactors.current[logoIndex] ?? 1));
    }
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 3]} intensity={1.5} />
      <group ref={nextRef}>
        <Center>
          <group rotation={FACE_CAMERA_ROTATION} scale={MIRROR_X}>
            <NextLogo />
          </group>
        </Center>
      </group>
      <group ref={nestRef}>
        <Center>
          <group rotation={FACE_CAMERA_ROTATION} scale={NEST_MIRROR}>
            <NestLogo />
          </group>
        </Center>
      </group>
      <group ref={threeRef}>
        <Center>
          <group rotation={FACE_CAMERA_ROTATION} scale={MIRROR_X}>
            <ThreeLogo />
          </group>
        </Center>
      </group>
    </>
  );
}
