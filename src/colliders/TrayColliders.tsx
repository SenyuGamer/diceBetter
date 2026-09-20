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
  const wallX = WALL_THICKNESS + 0.46 * s;
  const wallZ = WALL_THICKNESS + 0.96 * s;

  return (
    <group {...props}>
      {/* Floor of the tray */}
      {/* Use a large friction and restitution to simulate a bouncy material */}
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
      {/* Walls of the tray */}
      {/* Use a small friction to simulate a wooden material */}
      {/* Use a high restitution to reduce the change that the dice will rest up against the wall */}
      <RigidBody
        type="fixed"
        friction={1}
        restitution={0.9}
        userData={{ material: "WOOD" }}
      >
        {/* Bottom wall */}
        <CuboidCollider
          args={[WALL_SIZE, WALL_THICKNESS, WALL_SIZE]}
          position={[0, floorY, wallZ]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {/* Top wall */}
        <CuboidCollider
          args={[WALL_SIZE, WALL_THICKNESS, WALL_SIZE]}
          position={[0, floorY, -wallZ]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {/* Right wall */}
        <CuboidCollider
          args={[WALL_SIZE, WALL_THICKNESS, WALL_SIZE]}
          position={[wallX, floorY, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />
        {/* Left wall */}
        <CuboidCollider
          args={[WALL_SIZE, WALL_THICKNESS, WALL_SIZE]}
          position={[-wallX, floorY, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />
        {/* Roof */}
        <CuboidCollider
          args={[WALL_SIZE, WALL_THICKNESS, WALL_SIZE]}
          position={[0, roofY, 0]}
        />
      </RigidBody>
    </group>
  );
}
