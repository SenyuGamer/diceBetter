import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

export function GemstoneMaterial({
  simplify,
  ...props
}: JSX.IntrinsicElements["meshPhysicalMaterial"] & { simplify?: boolean }) {
  const [albedoMap, ormMap, normalMap] = useTexture(
    [albedo, orm, normal],
    (textures) => gltfTexture(textures, ["SRGB", "LINEAR", "LINEAR"])
  );

  if (simplify) {
    return (
      <meshStandardMaterial
        map={albedoMap}
        color={new THREE.Color("#00ff66")} // Emerald tint
        roughness={0.5}
        metalness={0.1}
        {...props}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      color={new THREE.Color("#00ff66")} // Emerald tint
      aoMap={ormMap}
      roughnessMap={ormMap}
      metalnessMap={ormMap}
      normalMap={normalMap}
      metalness={0.2}
      roughness={0.4}
      clearcoat={0.3}
      clearcoatRoughness={0.2}
      iridescence={0.1}
      iridescenceIOR={1.5}
      {...props}
    />
  );
}
