import React from "react";
import { useDiceRollStore } from "./store";
import { DiceTransform } from "../types/DiceTransform";

export function CockedMarkersRenderer({
  rollCocked,
  rollTransforms
}: {
  rollCocked: Record<string, boolean>;
  rollTransforms: Record<string, DiceTransform | null>;
}) {
  return (
    <>
      {Object.entries(rollCocked).map(([id, isCocked]) => {
        if (!isCocked) return null;
        const transform = rollTransforms[id];
        if (!transform) return null;

        // Position the marker slightly above the die's world position
        return (
          <mesh key={id} position={[transform.position.x, transform.position.y + 0.6, transform.position.z]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={5} />
          </mesh>
        );
      })}
    </>
  );
}

export function CockedMarkers() {
  const rollCocked = useDiceRollStore((state) => state.rollCocked);
  const rollTransforms = useDiceRollStore((state) => state.rollTransforms);

  return <CockedMarkersRenderer rollCocked={rollCocked} rollTransforms={rollTransforms} />;
}
