import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import normal from "./normal.jpg";
import mask from "./mask.png";
import { gltfTexture } from "../../helpers/gltfTexture";

const sheenColor = new THREE.Color("#4abff4");
const attenuationColor = new THREE.Color(43 / 255, 1, 115 / 255);

export function GlassMaterial({
  simplify,
  ...props
}: JSX.IntrinsicElements["meshPhysicalMaterial"] & { simplify?: boolean }) {
  const [albedoMap, maskMap, normalMap] = useTexture(
    [albedo, mask, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );

  if (simplify) {
    return (
      <meshStandardMaterial
        map={albedoMap}
        color={new THREE.Color("#bbddff")}
        roughnessMap={maskMap}
        metalnessMap={maskMap}
        roughness={1.0}
        metalness={0.5}
        {...props}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      sheenColor={new THREE.Color("#88ddff")}
      sheen={1}
      roughness={0.5}
      metalness={0.0}
      normalMap={normalMap}
      transmission={1}
      transmissionMap={maskMap}
      thickness={2.5}
      ior={1.31} // Ice IOR
      clearcoat={0.3}
      clearcoatRoughness={0.5}
      envMapIntensity={1.0}
      attenuationColor={new THREE.Color("#bbffff")}
      attenuationDistance={0.5}
      {...props}
    />
  );
}
