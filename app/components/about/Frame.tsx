interface FrameProps {
  width: number;
  height: number;
  thickness?: number;
  color?: string;
  position?: [number, number, number];
}

export default function Frame({
  width,
  height,
  thickness = 0.018,
  color = "#35e065",
  position = [0, 0, 0],
}: FrameProps) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width + thickness, thickness]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, -height / 2, 0]}>
        <planeGeometry args={[width + thickness, thickness]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[-width / 2, 0, 0]}>
        <planeGeometry args={[thickness, height + thickness]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[width / 2, 0, 0]}>
        <planeGeometry args={[thickness, height + thickness]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
