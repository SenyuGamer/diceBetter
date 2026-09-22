import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import albedo from "../glass/albedo.jpg";
import normal from "../glass/normal.jpg";
import mask from "../glass/mask.png";
import { gltfTexture } from "../../helpers/gltfTexture";

export function PlasmaMaterial({
  simplify,
  ...props
}: JSX.IntrinsicElements["meshPhysicalMaterial"] & { simplify?: boolean }) {
  const [albedoMap, maskMap, normalMap] = useTexture(
    [albedo, mask, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );
  
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  useFrame((state) => {
    if (matRef.current && !simplify) {
      const t = state.clock.elapsedTime;
      // Pulse quickly between 1.0 and 3.0
      matRef.current.emissiveIntensity = 2.0 + Math.sin(t * 10.0) * 1.0;
    }
  });

  if (simplify) {
    return (
      <meshStandardMaterial
        map={albedoMap}
        color={new THREE.Color("#001133")}
        emissive={new THREE.Color("#00ffff")}
        emissiveIntensity={1.0}
        emissiveMap={maskMap}
        roughness={0.5}
        metalness={0.5}
        {...props}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      ref={matRef}
      color={new THREE.Color("#001133")}
      emissive={new THREE.Color("#00ffff")}
      emissiveMap={maskMap}
      roughness={0.1}
      metalness={1.0}
      normalMap={normalMap}
      normalScale={new THREE.Vector2(2.0, 2.0)}
      clearcoat={1.0}
      clearcoatRoughness={0.0}
      iridescence={1.0}
      iridescenceIOR={1.5}
      {...props}
    />
  );
}
