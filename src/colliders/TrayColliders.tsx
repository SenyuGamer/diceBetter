import { CuboidCollider, RigidBody } from "@react-three/rapier";

// Use a very large wall size and thickness to avoid the possibility
// of the dice teleporting through the dice tray
const WALL_THICKNESS = 50;
const WALL_SIZE = 100;
const FLOOR_Y = -WALL_THICKNESS + 0.005; // Push the floor up a little for better contact shadows
const ROOF_Y = WALL_THICKNESS + 1.5;
const WALL_X = WALL_THICKNESS + 0.46; // Move the wall in a bit to account for the wood thickness
const WALL_Z = WALL_THICKNESS + 0.96;

export function TrayColliders({ scale = 1, ...props }: JSX.IntrinsicElements["group"] & { scale?: number }) {
  const s = typeof scale === 'number' ? scale : 1;
  const floorY = -WALL_THICKNESS + 0.005 * s;
  const roofY = WALL_THICKNESS + 1.5 * s;
  
  // Apotema interior del hexágono (radio al centro de cada pared): ~0.866
  const apothem = 0.866 * s;

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

      {/* 6 Walls of the hexagonal tray */}
      <RigidBody
        type="fixed"
        friction={1}
        restitution={0.9}
        userData={{ material: "WOOD" }}
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * Math.PI) / 3; // 60 grados por cara
          const dist = apothem + WALL_THICKNESS;
          const x = Math.sin(angle) * dist;
          const z = Math.cos(angle) * dist;

          return (
            <CuboidCollider
              key={i}
              args={[WALL_SIZE, WALL_SIZE, WALL_THICKNESS]}
              position={[x, floorY, z]}
              rotation={[0, angle, 0]}
            />
          );
        })}

        {/* Roof to prevent dice from flying out */}
        <CuboidCollider
          args={[WALL_SIZE, WALL_THICKNESS, WALL_SIZE]}
          position={[0, roofY, 0]}
        />
      </RigidBody>
    </group>
  );
}
