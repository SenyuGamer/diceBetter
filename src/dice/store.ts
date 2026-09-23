import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { WritableDraft } from "immer/dist/types/types-external";

import { DiceRoll } from "../types/DiceRoll";
import { isDie } from "../types/Die";
import { isDice } from "../types/Dice";
import { getDieFromDice } from "../helpers/getDieFromDice";
import { DiceTransform } from "../types/DiceTransform";
import { getRandomDiceThrow } from "../helpers/DiceThrower";
import { generateDiceId } from "../helpers/generateDiceId";
import { DiceThrow } from "../types/DiceThrow";

interface DiceRollState {
  roll: DiceRoll | null;
  /**
   * A mapping from the die ID to its roll result.
   * A value of `null` means the die hasn't finished rolling yet.
   */
  rollValues: Record<string, number | null>;
  /**
   * A mapping from the die ID to its final roll transform.
   * A value of `null` means the die hasn't finished rolling yet.
   */
  rollTransforms: Record<string, DiceTransform | null>;
  /**
   * A mapping from the die ID to its initial roll throw state.
   */
  rollThrows: Record<string, DiceThrow>;
  /**
   * A mapping from the die ID to a boolean indicating if it is cocked.
   */
  rollCocked: Record<string, boolean>;
  startRoll: (roll: DiceRoll, speedMultiplier?: number, trayScale?: number) => void;
  clearRoll: (ids?: string) => void;
  /** Reroll select ids of dice or reroll all dice by passing `undefined` */
  reroll: (ids?: string[], manualThrows?: Record<string, DiceThrow>) => void;
  finishDieRoll: (id: string, number: number, transform: DiceTransform, isCocked: boolean) => void;
}

export const useDiceRollStore = create<DiceRollState>()(
  immer((set) => ({
    roll: null,
    rollValues: {},
    rollTransforms: {},
    rollThrows: {},
    rollCocked: {},
    startRoll: (roll, speedMultiplier?: number, activeTrayScale?: number) =>
      set((state) => {
        // Embed the activeTrayScale so other players know what size tray to use
        roll.trayScale = activeTrayScale || 1.0;
        state.roll = roll;
        state.rollValues = {};
        state.rollTransforms = {};
        state.rollThrows = {};
        state.rollCocked = {};
        // Set all values to null
        const dice = getDieFromDice(roll);
        const spawnScale = dice.length > 20 ? 1.6 : dice.length > 10 ? 1.2 : 0.8;
        for (const die of dice) {
          state.rollValues[die.id] = null;
          state.rollTransforms[die.id] = null;
          state.rollThrows[die.id] = getRandomDiceThrow(speedMultiplier, spawnScale);
        }
      }),
    clearRoll: () =>
      set((state) => {
        state.roll = null;
        state.rollValues = {};
        state.rollTransforms = {};
        state.rollThrows = {};
        state.rollCocked = {};
      }),
    reroll: (ids, manualThrows) => {
      set((state) => {
        if (state.roll) {
          rerollDraft(
            state.roll,
            ids,
            manualThrows,
            state.rollValues,
            state.rollTransforms,
            state.rollThrows,
            state.rollCocked
          );
        }
      });
    },
    finishDieRoll: (id, number, transform, isCocked) => {
      set((state) => {
        state.rollValues[id] = number;
        state.rollTransforms[id] = transform;
        state.rollCocked[id] = isCocked;
      });
    },
  }))
);

/** Recursively update the ids of a draft to reroll dice */
function rerollDraft(
  diceRoll: WritableDraft<DiceRoll>,
  ids: string[] | undefined,
  manualThrows: Record<string, DiceThrow> | undefined,
  rollValues: WritableDraft<Record<string, number | null>>,
  rollTransforms: WritableDraft<Record<string, DiceTransform | null>>,
  rollThrows: WritableDraft<Record<string, DiceThrow>>,
  rollCocked: WritableDraft<Record<string, boolean>>
) {
  for (let dieOrDice of diceRoll.dice) {
    if (isDie(dieOrDice)) {
      if (!ids || ids.includes(dieOrDice.id)) {
        delete rollValues[dieOrDice.id];
        delete rollTransforms[dieOrDice.id];
        delete rollThrows[dieOrDice.id];
        delete rollCocked[dieOrDice.id];
        const manualThrow = manualThrows?.[dieOrDice.id];
        const id = generateDiceId();
        dieOrDice.id = id;
        rollValues[id] = null;
        rollTransforms[id] = null;
        if (manualThrow) {
          rollThrows[id] = manualThrow;
        } else {
          const allDice = getDieFromDice(diceRoll as DiceRoll);
          const trayScale = allDice.length > 20 ? 2.0 : allDice.length > 10 ? 1.5 : 1.0;
          rollThrows[id] = getRandomDiceThrow(undefined, trayScale);
        }
      }
    } else if (isDice(dieOrDice)) {
      rerollDraft(
        dieOrDice,
        ids,
        manualThrows,
        rollValues,
        rollTransforms,
        rollThrows,
        rollCocked
      );
    }
  }
}
