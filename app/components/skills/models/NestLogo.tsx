"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";

const MODEL_PATH = "/models/nestjs.glb";

type NestLogoGLTF = GLTF & {
  nodes: {
    Curve: THREE.Mesh;
  };
  materials: {
    Nest: THREE.MeshStandardMaterial;
  };
};

export default function NestLogo(props: ThreeElements["group"]) {
  const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as NestLogoGLTF;

  // This mark is a single-sided filled curve. A half-turn baked into its
  // geometry about the vertical axis fixes its left-right handedness (it was
  // authored mirror-reversed); the scene renders it double-sided so the
  // turned-away lit face still shows.
  const geometry = useMemo(() => {
    const g = nodes.Curve.geometry.clone();
    g.rotateY(Math.PI);
    return g;
  }, [nodes]);

  return (
    <group {...props} dispose={null}>
      <mesh geometry={geometry} material={materials.Nest} position={[0.069, 0.031, -0.063]} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
