import * as THREE from "three";
import { useMemo } from "react";
import { TrayMaterial } from "../materials/tray/TrayMaterial";

type SquareTrayProps = JSX.IntrinsicElements["group"] & {
  scale?: number | [number, number, number] | THREE.Vector3;
};

/**
 * Square dice tray constructed procedurally in Three.js
 * Size: ~2x2 units, Height of walls: ~0.35 units
 */
export function SquareTray({ scale = 1, ...props }: SquareTrayProps) {
  const s = typeof scale === "number" ? scale : (Array.isArray(scale) ? scale[0] : 1);

  // 1. Geometría del fondo cuadrado (fieltro / cuero interior)
  const floorGeometry = useMemo(() => {
    // Caja plana para el suelo.
    // Usaremos un CylinderGeometry de 4 lados para facilitar el match con los colliders.
    // Radio = 1.0. Un cilindro de 4 lados es un cuadrado rotado 45 grados.
    const geom = new THREE.CylinderGeometry(0.98, 0.98, 0.04, 4);
    return geom;
  }, []);

  // 2. Geometría de las 4 paredes de madera
  const wallGeometries = useMemo(() => {
    // Si el radio del cuadrado inscrito es R=1.0, el lado del cuadrado es L = R * sqrt(2) * 2 / 2 = R * sqrt(2)
    // Wait, if radius is 1.0 (from center to vertex), the side length is sqrt(1^2 + 1^2) = 1.414.
    // Lado del cuadrado = 1.414
    const wallLength = 1.45; // un poco más para empalmar
    const wallThickness = 0.08;
    const wallHeight = 0.35;
    return {
      wallLength,
      wallThickness,
      wallHeight,
    };
  }, []);

  // Apotema (distancia del centro al centro de la pared)
  // Para un cuadrado con R=1.0 (circunscrito), apotema = R * cos(45 deg) = 1.0 * 0.707 = 0.707
  const apothem = 0.707;

  return (
    <group {...props} scale={s} dispose={null}>
      {/* Suelo cuadrado de terciopelo/cuero */}
      <mesh geometry={floorGeometry} position={[0, -0.02, 0]} rotation={[0, Math.PI / 4, 0]} receiveShadow>
        <TrayMaterial color="#1a202c" roughness={0.8} />
      </mesh>

      {/* 4 Paredes de madera del cuadrado */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i * Math.PI) / 2; // 90 grados por cara
        // Como el primer vértice del cilindro está en x=0, rotarlo 45 grados lo pone en diagonal.
        // Las caras (paredes) están en los ángulos 0, 90, 180, 270 respecto al centro rotado.
        const x = Math.sin(angle) * (apothem + wallGeometries.wallThickness / 2);
        const z = Math.cos(angle) * (apothem + wallGeometries.wallThickness / 2);

        return (
          <mesh
            key={i}
            position={[x, wallGeometries.wallHeight / 2 - 0.02, z]}
            rotation={[0, angle, 0]}
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
      <mesh position={[0, -0.05, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.04, 4]} />
        <meshStandardMaterial color="#1f140e" roughness={0.5} />
      </mesh>
    </group>
  );
}
