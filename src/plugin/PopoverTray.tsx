import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Player } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ButtonBase from "@mui/material/ButtonBase";

import environment from "../environment.hdr";
import { usePlayerDice } from "./usePlayerDice";
import { PlayerDiceRoll } from "./PlayerDiceRoll";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";
import { Tray } from "../tray/Tray";
import { TraySuspense } from "../tray/TraySuspense";
import { AnimatedPlayerCamera } from "./AnimatedPlayerCamera";
import { useSimplify3D } from "./useSimplify3D";

export function PopoverTray({
  player,
  onToggle,
  onOpen,
  bottomOffset,
}: {
  player: Player;
  onToggle: (connectionId: string, show: boolean) => void;
  onOpen: (connectionId: string) => void;
  bottomOffset?: number;
}) {
  const { diceRoll, finalValue, finishedRolling, finishedRollTransforms } =
    usePlayerDice(player);

  const theme = useTheme();
  const { simplify } = useSimplify3D();

  const hidden = !diceRoll || diceRoll.hidden;

  const [timedOut, setTimedOut] = useState(finishedRolling);

  useEffect(() => {
    if (finishedRolling) {
      const timeout = setTimeout(() => {
        setTimedOut(true);
      }, 5000);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      setTimedOut(false);
    }
  }, [finishedRolling]);

  const shown = !hidden && !timedOut;
  useEffect(() => {
    if (shown) {
      onToggle(player.connectionId, true);
    }
  }, [shown]);

  function handleClick() {
    if (shown) {
      setTimedOut(true);
      onOpen(player.connectionId);
    }
  }

  return (
    <Box component="div" position="absolute" right={16} bottom={bottomOffset ?? 16} sx={{ transition: 'bottom 0.3s' }}>
      <Slide
        in={shown}
        onExited={() => onToggle(player.connectionId, false)}
        direction="up"
      >
        <ButtonBase onClick={handleClick}>
          <Paper
            elevation={8}
            sx={{
              width: "250px",
              height: simplify ? "32px" : "282px",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(34, 38, 57, 0.8)"
                  : "rgba(255, 255, 255, 0.4)",
            }}
          >
            {!simplify && (
              <Box component="div" height="250px" width="250px">
                <TraySuspense>
                  <Canvas frameloop="demand">
                    <AudioListenerProvider volume={0.25}>
                      <Environment files={environment} />
                      <Tray />
                      <PlayerDiceRoll player={player} />
                      <AnimatedPlayerCamera
                        rollTransforms={
                          finishedRolling ? finishedRollTransforms : undefined
                        }
                      />
                    </AudioListenerProvider>
                  </Canvas>
                </TraySuspense>
              </Box>
            )}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              textAlign="center"
              lineHeight="32px"
              sx={{
                bgcolor: "background.default",
              }}
              noWrap
            >
              {player?.name}
              {finishedRolling && (
                <span>
                  {" | "}
                  {diceRoll?.bonus ? (
                    <>
                      {finalValue} ({finalValue !== null ? finalValue - diceRoll.bonus : 0} {diceRoll.bonus > 0 ? "+" : "-"} {Math.abs(diceRoll.bonus)})
                    </>
                  ) : (
                    finalValue
                  )}
                </span>
              )}
            </Typography>
          </Paper>
        </ButtonBase>
      </Slide>
    </Box>
  );
}
