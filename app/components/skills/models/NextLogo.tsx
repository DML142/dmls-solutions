"use client";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";

const MODEL_PATH = "/models/nextjs.glb";

type NextLogoGLTF = GLTF & {
  nodes: {
    Circle_1: THREE.Mesh;
    Circle_2: THREE.Mesh;
  };
  materials: {
    NextBlack: THREE.MeshStandardMaterial;
    NextWhite: THREE.MeshStandardMaterial;
  };
};

export default function NextLogo(props: ThreeElements["group"]) {
  const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as NextLogoGLTF;
  return (
    <group {...props} dispose={null}>
      <group position={[0.072, 0, -0.072]} scale={0.071}>
        <mesh geometry={nodes.Circle_1.geometry} material={materials.NextBlack} />
        <mesh geometry={nodes.Circle_2.geometry} material={materials.NextWhite} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
