import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import albedo from "../glass/albedo.jpg";
import normal from "../glass/normal.jpg";
import mask from "../glass/mask.png";
import { gltfTexture } from "../../helpers/gltfTexture";

export function MagmaMaterial({
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
      matRef.current.emissiveIntensity = 2.0 + Math.sin(t * 2.5) * 1.5;
    }
  });

  if (simplify) {
    return (
      <meshStandardMaterial
        map={albedoMap}
        color={new THREE.Color("#050000")}
        emissive={new THREE.Color("#ff2a00")}
        emissiveMap={maskMap}
        emissiveIntensity={1.0}
        roughness={0.6}
        metalness={0.2}
        {...(props as any)}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      ref={matRef}
      color={new THREE.Color("#050000")}
      emissive={new THREE.Color("#ff2a00")}
      emissiveMap={maskMap}
      roughness={0.4}
      metalness={0.9}
      normalMap={normalMap}
      normalScale={new THREE.Vector2(1.5, 1.5)}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
      {...(props as any)}
    />
  );
}
