import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

const IRIDESCENCE_RANGE: [number, number] = [200, 600];

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
        color="#d8b4fe" // Brighter purple
        roughness={0.5}
        metalness={0.1}
        {...(props as any)}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      map={albedoMap}
      color="#d8b4fe" // Brighter purple so it absorbs less light
      aoMap={ormMap}
      roughnessMap={ormMap}
      metalnessMap={ormMap}
      normalMap={normalMap}
      clearcoat={0.2}
      clearcoatRoughness={0.3}
      iridescence={0.5}
      iridescenceIOR={2.0}
      iridescenceThicknessRange={IRIDESCENCE_RANGE}
      {...(props as any)}
    />
  );
}
