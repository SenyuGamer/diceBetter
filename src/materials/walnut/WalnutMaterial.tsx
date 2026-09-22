import { useTexture } from "@react-three/drei";

import albedo from "./albedo.jpg";
import orm from "./orm.jpg";
import normal from "./normal.jpg";
import { gltfTexture } from "../../helpers/gltfTexture";

export function WalnutMaterial({
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
        roughness={0.7}
        metalness={0}
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
      roughness={1.0}
      metalness={0.0}
      {...(props as any)}
    />
  );
}
