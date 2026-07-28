import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

import Box from "@mui/material/Box";

import { InteractiveDiceRoll } from "../dice/InteractiveDiceRoll";
import { DiceRollControls } from "../controls/DiceRollControls";
import environment from "../environment.hdr";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";
import { Tray } from "./Tray";
import { useDebugStore } from "../debug/store";
import { TraySuspense } from "./TraySuspense";
import { PreviewDiceRoll } from "../dice/PreviewDiceRoll";
import { FairnessTester } from "../tests/FairnessTester";
import { useSavedRollsStore } from "../controls/savedRolls";

/** Smoothly adjusts camera distance based on favorites panel state */
function SmoothCamera() {
  const { camera } = useThree();
  
  // Read state to know if QuickRollPanel is visible
  const groups = useSavedRollsStore((state) => state.groups);
  const favoriteGroups = useSavedRollsStore((state) => state.favoriteGroups);
  const isPanelActive = groups.some((g) => favoriteGroups.includes(g));
  
  useFrame((_state, delta) => {
    // Zoom out (5.2) if panel is active, standard zoom (4.3) if inactive
    const targetY = isPanelActive ? 5.2 : 4.3;
    
    // Smoothly interpolate current camera Y to target Y
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 8, delta);
    camera.updateProjectionMatrix();
  });
  
  return null;
}

/** Dice tray that controls the dice roll store */
export function InteractiveTray() {
  const allowOrbit = useDebugStore((state) => state.allowOrbit);

  return (
    <Box
      component="div"
      borderRadius={1}
      height="100vh"
      width="100%"
      flexGrow={1}
      overflow="hidden"
      position="relative"
      id="interactive-tray"
      sx={{
        "& canvas": {
          touchAction: "manipulation",
          userSelect: "none",
        },
      }}
    >
      <TraySuspense>
        <Canvas frameloop="demand">
          <AudioListenerProvider>
            <Environment files={environment} />
            <ContactShadows
              resolution={256}
              scale={[1, 2]}
              position={[0, 0, 0]}
              blur={0.5}
              opacity={0.5}
              far={1}
              color="#222222"
            />
            <Tray />
            <PreviewDiceRoll />
            <InteractiveDiceRoll />
            <PerspectiveCamera
              makeDefault
              fov={28}
              position={[0, 4.3, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            <SmoothCamera />
            {allowOrbit && <OrbitControls />}
          </AudioListenerProvider>
        </Canvas>
      </TraySuspense>
      <DiceRollControls />
      <FairnessTester />
    </Box>
  );
}
