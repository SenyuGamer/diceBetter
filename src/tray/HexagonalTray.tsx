import * as THREE from "three";
import { useMemo } from "react";
import { TrayMaterial } from "../materials/tray/TrayMaterial";

type HexagonalTrayProps = JSX.IntrinsicElements["group"] & {
  scale?: number | [number, number, number] | THREE.Vector3;
};

/**
 * Hexagonal dice tray constructed procedurally in Three.js
 * Radius: ~1.0 unit, Height of walls: ~0.35 units
 */
export function HexagonalTray({ scale = 1, ...props }: HexagonalTrayProps) {
  const s = typeof scale === "number" ? scale : (Array.isArray(scale) ? scale[0] : 1);

  // 1. Geometría del fondo hexagonal (fieltro / cuero interior)
  const floorGeometry = useMemo(() => {
    // Cilindro de 6 lados. Radio 0.98 para encajar dentro del marco de madera
    const geom = new THREE.CylinderGeometry(0.98, 0.98, 0.04, 6);
    return geom;
  }, []);

  // 2. Geometría de las 6 paredes de madera
  const wallGeometries = useMemo(() => {
    // Lado de un hexágono regular con radio 1.0 es r = 1.0.
    // Ancho de pared un poco mayor para empalmar en las esquinas: ~1.16
    const wallLength = 1.155;
    const wallThickness = 0.08;
    const wallHeight = 0.35;
    return {
      wallLength,
      wallThickness,
      wallHeight,
    };
  }, []);

  // Radio apotema interior para colocar cada pared: R * cos(30 deg) = 1.0 * 0.866 = 0.866
  const apothem = 0.866;

  return (
    <group {...props} scale={s} dispose={null}>
      {/* Suelo hexagonal de terciopelo/cuero */}
      <mesh geometry={floorGeometry} position={[0, -0.02, 0]} receiveShadow>
        <TrayMaterial color="#1a202c" roughness={0.8} />
      </mesh>

      {/* 6 Paredes de madera del hexágono */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * Math.PI) / 3; // 60 grados por cara
        const x = Math.sin(angle) * (apothem + wallGeometries.wallThickness / 2);
        const z = Math.cos(angle) * (apothem + wallGeometries.wallThickness / 2);

        return (
          <mesh
            key={i}
            position={[x, wallGeometries.wallHeight / 2 - 0.02, z]}
            rotation={[0, angle + Math.PI / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry
              args={[
                wallGeometries.wallLength,
                wallGeometries.wallHeight,
                wallGeometries.wallThickness,
              ]}
            />
            {/* Madera noble para el borde exterior */}
            <meshStandardMaterial
              color="#2d1d13"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Base externa protectora */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.04, 6]} />
        <meshStandardMaterial color="#1f140e" roughness={0.5} />
      </mesh>
    </group>
  );
}
