"use client";
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
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Curve.geometry} material={materials.Nest} position={[0.069, 0.031, -0.063]} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
