import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useRef } from "react";
import { useDiceRollStore } from "../dice/store";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { getPluginId } from "./getPluginId";

/** Sync the current dice roll to the plugin */
export function DiceRollSync() {
  const prevIds = useRef<string[]>([]);
  const prevThrows = useRef<any>(null);
  const prevCompleted = useRef<boolean>(false);
  useEffect(
    () =>
      useDiceRollStore.subscribe((state) => {
        let changed = false;
        if (!state.roll) {
          changed = true;
          prevIds.current = [];
          prevThrows.current = null;
          prevCompleted.current = false;
        } else {
          const ids = getDieFromDice(state.roll).map((die) => die.id);
          // Check array length for early change check
          if (prevIds.current.length !== ids.length) {
            changed = true;
            prevCompleted.current = false;
          }
          // Check the ids have changed
          else if (!ids.every((id, index) => id === prevIds.current[index])) {
            changed = true;
            prevCompleted.current = false;
          }
          // Check if we started a reroll (rollThrows changed)
          else if (state.rollThrows !== prevThrows.current) {
            changed = true;
            prevCompleted.current = false;
          }
          // Check if we just completed a roll (only sync completion once)
          else if (
            !prevCompleted.current &&
            Object.keys(state.rollValues).length > 0 &&
            Object.values(state.rollValues).every((value) => value !== null)
          ) {
            changed = true;
            prevCompleted.current = true;
          }
          prevIds.current = ids;
          prevThrows.current = state.rollThrows;
        }

        if (changed) {
          // Hide values if needed
          const throws = state.roll?.hidden ? undefined : state.rollThrows;
          const values = state.roll?.hidden ? undefined : state.rollValues;
          const transforms = state.roll?.hidden
            ? undefined
            : state.rollTransforms;
          const cocked = state.roll?.hidden
            ? undefined
            : state.rollCocked;
            
          OBR.player.setMetadata({
            [getPluginId("roll")]: state.roll,
            [getPluginId("rollThrows")]: throws,
            [getPluginId("rollValues")]: values,
            [getPluginId("rollTransforms")]: transforms,
            [getPluginId("rollCocked")]: cocked,
          });
        }
      }),
    []
  );

  return null;
}
