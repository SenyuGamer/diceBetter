import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

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
import { getDiceToRoll, useDiceControlsStore } from "../controls/store";
import { useDiceRollStore } from "../dice/store";
import { getDieFromDice } from "../helpers/getDieFromDice";

function useTrayScale() {
  const counts = useDiceControlsStore((state) => state.diceCounts);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const diceById = useDiceControlsStore((state) => state.diceById);
  const blessActive = useDiceControlsStore((state) => state.blessActive);
  const blessCount = useDiceControlsStore((state) => state.blessCount);

  const previewRoll = useMemo(() => {
    return {
      dice: getDiceToRoll(counts, advantage, diceById, blessActive, blessCount),
    };
  }, [counts, advantage, diceById, blessActive, blessCount]);
  
  const previewDiceCount = useMemo(() => getDieFromDice(previewRoll).length, [previewRoll]);

  const activeRoll = useDiceRollStore((state) => state.roll);
  const activeDiceCount = useMemo(() => activeRoll ? getDieFromDice(activeRoll).length : 0, [activeRoll]);

  const currentCount = Math.max(previewDiceCount, activeDiceCount);
  
  if (currentCount > 20) return 2.0;
  if (currentCount > 10) return 1.5;
  return 1.0;
}

/** Dice tray that controls the dice roll store */
export function InteractiveTray() {
  const allowOrbit = useDebugStore((state) => state.allowOrbit);
  const trayScale = useTrayScale();

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
              scale={[2.2 * trayScale, 2.2 * trayScale]}
              position={[0, 0, 0]}
              blur={0.5}
              opacity={0.5}
              far={1}
              color="#222222"
            />
            <Tray scale={trayScale} />
            <PreviewDiceRoll trayScale={trayScale} />
            <InteractiveDiceRoll trayScale={trayScale} />
            <PerspectiveCamera
              makeDefault
              fov={28}
              position={[0, 4.3 * trayScale, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />

            {allowOrbit && <OrbitControls />}
          </AudioListenerProvider>
        </Canvas>
      </TraySuspense>
      <DiceRollControls />
      <FairnessTester />
    </Box>
  );
}
