import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { DiceCounts } from "./store";
import { Die } from "../types/Die";
import { Advantage } from "./store";

export interface GlobalRoll {
  id: string; // The recentRollId from the roll
  playerName: string;
  playerColor: string;
  counts: DiceCounts;
  bonus: number;
  advantage: Advantage;
  diceById: Record<string, Die>;
  result?: number;
  timestamp: number;
}

interface GlobalHistoryState {
  globalRolls: GlobalRoll[];
  pushGlobalRoll: (roll: GlobalRoll) => void;
  updateGlobalRollResult: (id: string, result: number) => void;
}

export const useGlobalHistoryStore = create<GlobalHistoryState>()(
  immer((set) => ({
    globalRolls: [],
    pushGlobalRoll(roll) {
      set((state) => {
        // Prevent duplicate pushes
        if (!state.globalRolls.some(r => r.id === roll.id)) {
          if (state.globalRolls.length >= 15) {
            state.globalRolls.splice(0, state.globalRolls.length - 14); // Keep last 14 to make room for 1
          }
          state.globalRolls.push(roll);
        }
      });
    },
    updateGlobalRollResult(id, result) {
      set((state) => {
        const roll = state.globalRolls.find((r) => r.id === id);
        if (roll) {
          roll.result = result;
        }
      });
    },
  }))
);
