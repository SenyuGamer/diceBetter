import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

export function GalaxyMaterial({
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
        color={new THREE.Color("#6600ff")} // Deep purple magic tint
        roughness={0.5}
        metalness={0.1}
        {...props}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      color={new THREE.Color("#6600ff")} // Deep purple magic tint
      aoMap={ormMap}
      roughnessMap={ormMap}
      metalnessMap={ormMap}
      normalMap={normalMap}
      clearcoat={0.2}
      clearcoatRoughness={0.3}
      iridescence={0.5}
      iridescenceIOR={2.0}
      iridescenceThicknessRange={[200, 600]}
      {...props}
    />
  );
}
