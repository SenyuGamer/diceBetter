import OBR, { Player } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";

import { PopoverTray } from "./PopoverTray";
import { getPluginId } from "./getPluginId";
import { useSimplify3D } from "./useSimplify3D";

export function PopoverTrays() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    OBR.party.getPlayers().then(setPlayers);
  }, []);
  useEffect(() => OBR.party.onChange(setPlayers), []);

  const { simplify } = useSimplify3D();
  const [visibleTrays, setVisibleTrays] = useState<string[]>([]);

  useEffect(() => {
    const playerIds = players.map((p) => p.connectionId);
    setVisibleTrays((visible) =>
      visible.filter((id) => playerIds.includes(id))
    );
  }, [players]);

  function handleTrayToggle(connectionId: string, shown: boolean) {
    if (shown) {
      setVisibleTrays((visible) =>
        visible.includes(connectionId) ? visible : [...visible, connectionId]
      );
    } else {
      setVisibleTrays((visible) => visible.filter((id) => id !== connectionId));
    }
  }

  function handleTrayOpen(connectionId: string) {
    if (window.BroadcastChannel) {
      OBR.action.open();
      const channel = new BroadcastChannel(getPluginId("focused-tray"));
      channel.postMessage(connectionId);
      channel.close();
    }
  }

  const hidden = visibleTrays.length === 0;

  useEffect(() => {
    if (hidden) {
      OBR.popover.setHeight(getPluginId("popover"), 0);
      OBR.popover.setWidth(getPluginId("popover"), 0);
    } else {
      const trayHeight = simplify ? 48 : 298;
      // Height = (Tray height + Margin 16) * number of trays
      OBR.popover.setHeight(getPluginId("popover"), visibleTrays.length * trayHeight);
      // Width = Tray 250 + Margin 16
      OBR.popover.setWidth(getPluginId("popover"), 266);
    }
  }, [hidden, visibleTrays.length, simplify]);

  return (
    <Box
      component="div"
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      top="0"
      overflow="hidden"
    >
      {players.map((player) => {
        const index = visibleTrays.indexOf(player.connectionId);
        const trayHeight = simplify ? 48 : 298;
        const bottomOffset = index !== -1 ? 16 + index * trayHeight : 16;
        return (
          <PopoverTray
            key={player.connectionId}
            player={player}
            onToggle={handleTrayToggle}
            onOpen={handleTrayOpen}
            bottomOffset={bottomOffset}
          />
        );
      })}
    </Box>
  );
}
