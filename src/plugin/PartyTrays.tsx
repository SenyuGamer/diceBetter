import OBR, { Player } from "@owlbear-rodeo/sdk";
import { useEffect, useMemo, useState } from "react";

import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/ChevronLeftRounded";

import { SlideTransition } from "../controls/SlideTransition";
import { PlayerTray } from "./PlayerTray";
import { PlayerAvatar } from "./PlayerAvatar";
import { getPluginId } from "./getPluginId";

export function PartyTrays() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [focusedTray, setFocusTray] = useState<string | null>(null);

  useEffect(() => {
    OBR.party.getPlayers().then(setPlayers);
  }, []);
  useEffect(() => OBR.party.onChange(setPlayers), []);

  const focusedPlayer = useMemo(() => {
    if (focusedTray) {
      return players.find((player) => player.connectionId === focusedTray);
    } else {
      return;
    }
  }, [players, focusedTray]);

  const theme = useTheme();

  // Setup a broadcast channel so the popover can open a tray
  useEffect(() => {
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel(getPluginId("focused-tray"));
      channel.onmessage = (event) => {
        setFocusTray(event.data);
      };
      return () => {
        channel.close();
      };
    }
  }, []);

  if (players.length === 0) {
    return null;
  }

  return (
    <>
      {players.map((player) => (
        <PlayerAvatar
          key={player.connectionId}
          player={player}
          onSelect={() => setFocusTray(player.connectionId)}
        />
      ))}
      <Dialog
        open={Boolean(focusedPlayer)}
        onClose={() => setFocusTray(null)}
        fullScreen
        TransitionComponent={SlideTransition}
        hideBackdrop
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            backgroundImage: "none",
          },
        }}
        // Keep mounted to allow the canvas to be ready
        // during the open animation
        keepMounted
      >
        <Stack
          position="relative"
          width="100%"
          height="100%"
          overflow="hidden"
        >
          <PlayerTray player={focusedPlayer} />
          <IconButton
            onClick={() => setFocusTray(null)}
            sx={{
              position: "absolute",
              left: 16,
              top: 16,
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Dialog>
    </>
  );
}
