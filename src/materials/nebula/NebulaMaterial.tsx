import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

export function NebulaMaterial({
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
        emissive={new THREE.Color("#441188")}
        emissiveMap={albedoMap}
        emissiveIntensity={0.2}
        roughness={0.5}
        metalness={0.1}
        {...(props as any)}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      aoMap={ormMap}
      roughnessMap={ormMap}
      metalnessMap={ormMap}
      normalMap={normalMap}
      emissive={new THREE.Color("#441188")}
      emissiveMap={albedoMap}
      emissiveIntensity={0.2}
      iridescence={0.2}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[100, 400]}
      clearcoat={0.2}
      clearcoatRoughness={0.4}
      {...(props as any)}
    />
  );
}
