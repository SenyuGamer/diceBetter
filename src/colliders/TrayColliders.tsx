import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useMemo } from "react";

const WALL_THICKNESS = 50;
const WALL_SIZE = 100;

export function TrayColliders({ scale = 1, ...props }: JSX.IntrinsicElements["group"] & { scale?: number }) {
  const s = typeof scale === 'number' ? scale : 1;
  const floorY = -WALL_THICKNESS + 0.005 * s;
  const roofY = WALL_THICKNESS + 1.5 * s;
  
  const innerRadius = 1.0 * s;

  // Create a thick hexagonal wall using ExtrudeGeometry to prevent high-speed tunneling
  const wallsGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Outer hexagon (very large to prevent tunneling)
    const outerRadius = 20; 
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      if (i === 0) shape.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      else shape.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
    }
    shape.closePath();

    // Inner hexagon (the actual tray boundary)
    const hole = new THREE.Path();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      if (i === 0) hole.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
      else hole.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
    }
    hole.closePath();
    shape.holes.push(hole);

    // Extrude the 2D shape into a 3D thick wall
    const extrudeSettings = { depth: 15, bevelEnabled: false };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // ExtrudeGeometry extrudes along the Z axis by default. We need it along the Y axis.
    geom.rotateX(Math.PI / 2);
    
    // Rotate to match the visual tray's orientation
    geom.rotateY(Math.PI / 6);
    
    // Translate down so it covers the floor upwards
    geom.translate(0, 5, 0);
    
    return geom;
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

      {/* 6 Thick Walls of the hexagonal tray (unified trimesh) */}
      <RigidBody
        type="fixed"
        friction={1}
        restitution={0.9}
        colliders="trimesh"
        userData={{ material: "WOOD" }}
      >
        {/* Do not use visible={false} because Rapier might ignore it. Use opacity 0 instead. */}
        <mesh geometry={wallsGeometry} position={[0, 0, 0]}>
          <meshBasicMaterial transparent opacity={0} depthWrite={false} color="red" />
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
