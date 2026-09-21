import OBR, { Player } from "@owlbear-rodeo/sdk";
import { useEffect, useRef } from "react";
import { useGlobalHistoryStore } from "../controls/globalHistoryStore";
import { getPluginId } from "./getPluginId";
import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import { DiceRoll } from "../types/DiceRoll";

import { getDieFromDice } from "../helpers/getDieFromDice";

export function GlobalHistorySync() {
  const pushGlobalRoll = useGlobalHistoryStore((state) => state.pushGlobalRoll);
  const updateGlobalRollResult = useGlobalHistoryStore((state) => state.updateGlobalRollResult);
  
  const knownRolls = useRef<Record<string, { id: string, completed: boolean }>>({});

  useEffect(() => {
    function handlePlayersChange(players: Player[]) {
      for (const player of players) {
        const roll = player.metadata[getPluginId("roll")] as DiceRoll | undefined;
        const rollValues = player.metadata[getPluginId("rollValues")] as Record<string, number | null> | undefined;

        if (roll && roll.recentRollId && !roll.hidden) {
          const isCompleted = rollValues 
            ? Object.values(rollValues).every((v) => v !== null) && Object.keys(rollValues).length > 0
            : false;

          // If we haven't seen this roll id yet, create the entry
          if (!knownRolls.current[roll.recentRollId]) {
            knownRolls.current[roll.recentRollId] = { id: roll.recentRollId, completed: false };

            // We need to figure out counts and diceById from roll.dice
            const counts: Record<string, number> = {};
            const diceById: Record<string, any> = {};
            const parsedDice = getDieFromDice(roll);
            for (const die of parsedDice) {
                counts[die.id] = (counts[die.id] || 0) + 1;
                diceById[die.id] = die;
            }

            pushGlobalRoll({
              id: roll.recentRollId,
              playerName: player.name,
              playerColor: player.color,
              counts,
              bonus: roll.bonus || 0,
              advantage: null, // the original advantage is lost in DiceRoll, we could try to infer it but null is fine
              diceById,
              timestamp: Date.now()
            });
          }

          // If it just completed, calculate the total and update
          if (isCompleted && !knownRolls.current[roll.recentRollId].completed && rollValues) {
             knownRolls.current[roll.recentRollId].completed = true;
             const finalValue = getCombinedDiceValue(roll, rollValues as Record<string, number>);
             if (finalValue !== null) {
               updateGlobalRollResult(roll.recentRollId, finalValue);
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

      // Initial check
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
