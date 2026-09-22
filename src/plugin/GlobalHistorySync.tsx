import OBR, { Player } from "@owlbear-rodeo/sdk";
import { useEffect, useRef } from "react";
import { useGlobalHistoryStore, GlobalRoll } from "../controls/globalHistoryStore";
import { getPluginId } from "./getPluginId";
import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import { DiceRoll } from "../types/DiceRoll";

import { getDieFromDice } from "../helpers/getDieFromDice";

const HISTORY_KEY = getPluginId("global_history");

export function GlobalHistorySync({ readOnly = false }: { readOnly?: boolean }) {
  const pushGlobalRoll = useGlobalHistoryStore((state) => state.pushGlobalRoll);
  const updateGlobalRollResult = useGlobalHistoryStore((state) => state.updateGlobalRollResult);
  
  const knownRolls = useRef<Record<string, { id: string, completed: boolean }>>({});

  useEffect(() => {
    function syncToRoom() {
      // We only write to room if we are the ones updating it, handled in the roll logic.
    }

    function handleRoomMetadataChange(metadata: Record<string, any>) {
      const roomHistory = metadata[HISTORY_KEY] as GlobalRoll[];
      if (roomHistory && Array.isArray(roomHistory)) {
        // Sync local store with room history
        for (const roll of roomHistory) {
           if (!knownRolls.current[roll.id]) {
             knownRolls.current[roll.id] = { id: roll.id, completed: roll.result !== undefined };
             pushGlobalRoll(roll);
           } else if (roll.result !== undefined && !knownRolls.current[roll.id].completed) {
             knownRolls.current[roll.id].completed = true;
             updateGlobalRollResult(roll.id, roll.result);
           }
        }
      }
    }

    function handlePlayersChange(players: Player[]) {
      for (const player of players) {
        const roll = player.metadata[getPluginId("roll")] as DiceRoll | undefined;
        const rollValues = player.metadata[getPluginId("rollValues")] as Record<string, number | null> | undefined;

        if (roll && roll.recentRollId && !roll.hidden) {
          const isCompleted = rollValues 
            ? Object.values(rollValues).every((v) => v !== null) && Object.keys(rollValues).length > 0
            : false;

          let finalValue: number | null = null;
          if (isCompleted && rollValues) {
             finalValue = getCombinedDiceValue(roll, rollValues as Record<string, number>);
          }

          // If we haven't seen this roll id yet, create the entry
          if (!knownRolls.current[roll.recentRollId]) {
            knownRolls.current[roll.recentRollId] = { id: roll.recentRollId, completed: false };

            const counts: Record<string, number> = {};
            const diceById: Record<string, any> = {};
            const parsedDice = getDieFromDice(roll);
            for (const die of parsedDice) {
                counts[die.id] = (counts[die.id] || 0) + 1;
                diceById[die.id] = die;
            }

            const newRoll: GlobalRoll = {
              id: roll.recentRollId,
              playerName: player.name,
              playerColor: player.color,
              counts,
              bonus: roll.bonus || 0,
              advantage: null,
              diceById,
              timestamp: Date.now()
            };

            pushGlobalRoll(newRoll);

            // Persist to room metadata ONLY if we are the one who rolled this!
            if (!readOnly && player.id === OBR.player.id) {
               OBR.room.getMetadata().then((meta) => {
                  let history = [...((meta[HISTORY_KEY] || []) as GlobalRoll[])];
                  history.push(newRoll);
                  if (history.length > 15) history = history.slice(history.length - 15);
                  OBR.room.setMetadata({ [HISTORY_KEY]: history });
               });
            }
          }

          // If it just completed, calculate the total and update
          if (isCompleted && !knownRolls.current[roll.recentRollId].completed && finalValue !== null) {
             knownRolls.current[roll.recentRollId].completed = true;
             updateGlobalRollResult(roll.recentRollId, finalValue);

             // Update room metadata ONLY if we are the one who rolled this!
             if (!readOnly && player.id === OBR.player.id) {
               OBR.room.getMetadata().then((meta) => {
                  let history = [...((meta[HISTORY_KEY] || []) as GlobalRoll[])];
                  const existingIndex = history.findIndex(r => r.id === roll.recentRollId);
                  if (existingIndex !== -1) {
                     history[existingIndex] = { ...history[existingIndex], result: finalValue as number };
                     OBR.room.setMetadata({ [HISTORY_KEY]: history });
                  }
               });
             }
          }
        }
      }
    }

    if (OBR.isAvailable) {
      OBR.party.onChange(handlePlayersChange);
      
      // Also check the local player
      OBR.player.onChange((player) => {
         handlePlayersChange([player]);
      });
      
      // Check room metadata
      OBR.room.onMetadataChange(handleRoomMetadataChange);

      // Initial check
      OBR.room.getMetadata().then(handleRoomMetadataChange);

      OBR.party.getPlayers().then(players => {
         OBR.player.getName().then(name => {
             OBR.player.getColor().then(color => {
                 OBR.player.getMetadata().then(metadata => {
                     const p = { id: OBR.player.id, name, color, metadata, connectionId: "", role: "PLAYER", selection: undefined };
                     handlePlayersChange([...players, p as unknown as Player]);
                 });
             });
         });
      });
    }
  }, [pushGlobalRoll, updateGlobalRollResult]);

  return null;
}
