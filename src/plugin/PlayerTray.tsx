import { useState, useEffect, useRef } from "react";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Player } from "@owlbear-rodeo/sdk";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Tooltip from "@mui/material/Tooltip";

import HiddenIcon from "@mui/icons-material/VisibilityOffRounded";

import environment from "../environment.hdr";
import { GradientOverlay } from "../controls/GradientOverlay";
import { DiceResults } from "../controls/DiceResults";
import { usePlayerDice } from "./usePlayerDice";
import { PlayerDiceRoll } from "./PlayerDiceRoll";
import { DiceRoll } from "../types/DiceRoll";
import { Die, isDie } from "../types/Die";
import { isDice } from "../types/Dice";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";
import { Tray } from "../tray/Tray";
import { useDebugStore } from "../debug/store";
import { TraySuspense } from "../tray/TraySuspense";

export function PlayerTray({
  player,
}: {
  player?: Player; // Make player optional to allow for preloading of the tray
}) {
  const allowOrbit = useDebugStore((state) => state.allowOrbit);

  return (
    <Box component="div" position="relative" display="flex">
      <Box
        component="div"
        borderRadius={0.5}
        height="100vh"
        width="calc(100vh / 2)"
        overflow="hidden"
        position="relative"
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
              <PlayerDiceRoll player={player} />
              <PerspectiveCamera
                makeDefault
                fov={28}
                position={[0, 4.3, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              {allowOrbit && <OrbitControls />}
            </AudioListenerProvider>
          </Canvas>
        </TraySuspense>
      </Box>
      <PlayerTrayResults player={player} />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          pointerEvents: "none",
          padding: 3,
        }}
        component="div"
      >
        <Typography
          variant="h6"
          color="rgba(255, 255, 255, 0.7)"
          textAlign="center"
        >
          {player?.name}
        </Typography>
      </Box>
    </Box>
  );
}

function PlayerTrayResults({ player }: { player?: Player }) {
  const { diceRoll, finalValue, finishedRollValues, finishedRolling } =
    usePlayerDice(player);

  const [resultsExpanded, setResultsExpanded] = useState(false);
  const lastRolledDiceRef = useRef<string | null>(null);

  useEffect(() => {
    if (finishedRolling && diceRoll && finishedRollValues) {
      // Prevent playing the sound multiple times for the same roll instance
      const rollId = JSON.stringify(finishedRollValues);
      if (lastRolledDiceRef.current === rollId) return;
      lastRolledDiceRef.current = rollId;

      let hasCrit = false;
      let hasFumble = false;

      const allDice: Die[] = [];
      const extractDice = (d: DiceRoll) => {
        d.dice.forEach(item => {
          if (isDie(item)) {
            allDice.push(item);
          } else if (isDice(item)) {
            extractDice(item);
          }
        });
      };
      extractDice(diceRoll);

      for (const die of allDice) {
        if (die.type === "D20") {
          const val = finishedRollValues[die.id];
          if (val === 20) hasCrit = true;
          if (val === 1) hasFumble = true;
        }
      }

      if (hasCrit) {
        playCritSound();
      } else if (hasFumble) {
        playFumbleSound();
      }
    }
  }, [finishedRolling, diceRoll, finishedRollValues]);

  return (
    <>
      {diceRoll?.hidden && (
        <Backdrop open sx={{ position: "absolute" }}>
          <Tooltip title="Hidden Roll">
            <HiddenIcon htmlColor="white" />
          </Tooltip>
        </Backdrop>
      )}
      {finalValue !== null && (
        <>
          <Fade in>
            <GradientOverlay top height={resultsExpanded ? 500 : undefined} />
          </Fade>
          <GradientOverlay />
          <Fade in>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                pointerEvents: "none",
                padding: 3,
              }}
              component="div"
            >
              <Stack
                direction="row"
                justifyContent="center"
                width="100%"
                alignItems="start"
              >
                {finishedRolling &&
                  diceRoll &&
                  finishedRollValues &&
                  finalValue !== null && (
                    <DiceResults
                      diceRoll={diceRoll}
                      rollValues={finishedRollValues}
                      expanded={resultsExpanded}
                      onExpand={setResultsExpanded}
                    />
                  )}
              </Stack>
            </Box>
          </Fade>
        </>
      )}
    </>
  );
}

// -----------------------------------------------------------------------------
// Web Audio API Sound Synthesizers for Crit and Fumble
// -----------------------------------------------------------------------------
function playCritSound() {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const playTone = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };
  
  const now = ctx.currentTime;
  // A happy major arpeggio
  playTone(523.25, now, 0.2); // C5
  playTone(659.25, now + 0.1, 0.2); // E5
  playTone(783.99, now + 0.2, 0.2); // G5
  playTone(1046.50, now + 0.3, 0.6); // C6
}

function playFumbleSound() {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const playTone = (freq1: number, freq2: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq1, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq2, startTime + duration);
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    // Optional filter for less harsh sound
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1000;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };
  
  const now = ctx.currentTime;
  // A sad descending "womp womp"
  playTone(300, 200, now, 0.4);
  playTone(200, 100, now + 0.4, 0.8);
}
