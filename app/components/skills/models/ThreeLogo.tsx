"use client";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";

const MODEL_PATH = "/models/threejs.glb";

type ThreeLogoGLTF = GLTF & {
  nodes: {
    Plane: THREE.Mesh;
  };
  materials: {
    ThreeJS: THREE.MeshStandardMaterial;
  };
};

export default function ThreeLogo(props: ThreeElements["group"]) {
  const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as ThreeLogoGLTF;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Plane.geometry} material={materials.ThreeJS} position={[0.113, 0, -0.046]} scale={0.015} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
