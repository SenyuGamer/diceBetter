import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useMemo } from "react";

// Use a very large wall size and thickness to avoid the possibility
// of the dice teleporting through the dice tray
const WALL_THICKNESS = 50;
const WALL_SIZE = 100;

export function TrayColliders({ scale = 1, ...props }: JSX.IntrinsicElements["group"] & { scale?: number }) {
  const s = typeof scale === 'number' ? scale : 1;
  const floorY = -WALL_THICKNESS + 0.005 * s;
  const roofY = WALL_THICKNESS + 1.5 * s;
  
  // Apotema interior del hexágono (radio al centro de cada pared): ~0.866
  // Para que CylinderGeometry cree un hexágono con apotema 0.866, el radio (vértice) debe ser 1.0.
  const radius = 1.0 * s;

  // Creamos la geometría de las paredes una sola vez
  const wallsGeometry = useMemo(() => {
    // openEnded = true para que sea un tubo sin tapas
    const geom = new THREE.CylinderGeometry(radius, radius, 10, 6, 1, true);
    // Rotate so the flat sides align with the z-axis (just like the visual tray)
    geom.rotateY(Math.PI / 6); 
    return geom;
  }, [radius]);

  return (
    <group {...props}>
      {/* Floor of the tray */}
      <RigidBody
        type="fixed"
        friction={10}
        restitution={0.5}
        userData={{ material: "LEATHER" }}
      >
        <CuboidCollider
          args={[WALL_SIZE, WALL_THICKNESS, WALL_SIZE]}
          position={[0, floorY, 0]}
        />
      </RigidBody>

      {/* 6 Walls of the hexagonal tray (unified trimesh) */}
      <RigidBody
        type="fixed"
        friction={1}
        restitution={0.9}
        colliders="trimesh"
        userData={{ material: "WOOD" }}
      >
        <mesh geometry={wallsGeometry} position={[0, 0, 0]} visible={false}>
          <meshBasicMaterial side={THREE.DoubleSide} />
        </mesh>
      </RigidBody>

      {/* Roof to prevent dice from flying out */}
      <RigidBody type="fixed">
        <CuboidCollider
          args={[WALL_SIZE, WALL_THICKNESS, WALL_SIZE]}
          position={[0, roofY, 0]}
        />
      </RigidBody>
    </group>
  );
}
