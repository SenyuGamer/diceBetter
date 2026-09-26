import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function ResponsiveCamera({ 
  trayScale, 
  baseFov = 15, 
  baseY = 8.5 
}: { 
  trayScale: number;
  baseFov?: number;
  baseY?: number;
}) {
  const { size } = useThree();
  const aspect = size.width / size.height;
  
  // If portrait (aspect < 1), we pull the camera back 
  // so the horizontal width visible matches what it would be at aspect=1.
  const aspectMultiplier = aspect < 1 ? (1 / aspect) : 1;

  return (
    <PerspectiveCamera
      makeDefault
      fov={baseFov}
      position={[0, baseY * trayScale * aspectMultiplier, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}
