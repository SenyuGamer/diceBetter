import { CuboidCollider, RigidBody, TrimeshCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useMemo } from "react";

const WALL_THICKNESS = 50;
const WALL_SIZE = 100;

export function TrayColliders({ scale = 1, ...props }: JSX.IntrinsicElements["group"] & { scale?: number }) {
  const s = typeof scale === 'number' ? scale : 1;
  const floorY = -WALL_THICKNESS + 0.005 * s;
  const roofY = WALL_THICKNESS + 1.5 * s;
  
  const innerRadius = 1.0 * s;

  // Create explicit vertices and indices for the trimesh
  const { vertices, indices } = useMemo(() => {
    // 6-sided cylinder, open ended (hollow tube)
    // Height 20 is enough to cover from floor to roof
    const geom = new THREE.CylinderGeometry(innerRadius, innerRadius, 20, 6, 1, true);
    
    // Rotate 30 degrees to match visual hexagon
    geom.rotateY(Math.PI / 6);
    // Translate up to cover Y=0 to Y=20
    geom.translate(0, 10, 0);

    return {
      vertices: geom.attributes.position.array as Float32Array,
      indices: geom.index!.array as Uint32Array,
    };
  }, [innerRadius]);

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

      {/* 6 Walls of the hexagonal tray (explicit trimesh) */}
      <RigidBody
        type="fixed"
        friction={1}
        restitution={0.9}
        userData={{ material: "WOOD" }}
      >
        <TrimeshCollider args={[vertices, indices]} />
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
