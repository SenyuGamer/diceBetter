import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

export function IronMaterial({
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
        color={new THREE.Color("#ffffff")} // Silver/Iron
        roughness={0.6}
        metalness={0.8}
        {...(props as any)}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      color={new THREE.Color("#ffffff")} // Silver/Iron
      aoMap={ormMap}
      roughnessMap={ormMap}
      metalnessMap={ormMap}
      normalMap={normalMap}
      metalness={0.9}
      roughness={0.5}
      clearcoat={0.1}
      clearcoatRoughness={0.5}
      {...(props as any)}
    />
  );
}
