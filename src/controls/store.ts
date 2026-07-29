import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { diceSets } from "../sets/diceSets";
import { Dice } from "../types/Dice";
import { DiceSet } from "../types/DiceSet";
import { Die } from "../types/Die";
import { generateDiceId } from "../helpers/generateDiceId";

export type Advantage = "ADVANTAGE" | "DISADVANTAGE" | null;
export type DiceCounts = Record<string, number>;

interface DiceControlsState {
  diceSet: DiceSet;
  diceById: Record<string, Die>;
  defaultDiceCounts: DiceCounts;
  diceCounts: DiceCounts;
  diceBonus: number;
  diceAdvantage: Advantage;
  diceHidden: boolean;
  diceRollPressTime: number | null;
  fairnessTesterOpen: boolean;
  blessActive: boolean;
  blessCount: number;
  changeDiceSet: (diceSet: DiceSet) => void;
  resetDiceCounts: () => void;
  setDiceCounts: (counts: DiceCounts, savedDiceById?: Record<string, Die>) => void;
  changeDieCount: (id: string, count: number) => void;
  incrementDieCount: (id: string) => void;
  decrementDieCount: (id: string) => void;
  setDiceAdvantage: (advantage: Advantage) => void;
  setDiceBonus: (bonus: number) => void;
  toggleDiceHidden: () => void;
  setDiceRollPressTime: (time: number | null) => void;
  toggleFairnessTester: () => void;
  setBlessActive: (active: boolean) => void;
  setBlessCount: (count: number) => void;
}

const initialSet = diceSets[0];
const initialDiceCounts = getDiceCountsFromSet(initialSet);
const initialDiceById = getDiceByIdFromSet(initialSet);

export const useDiceControlsStore = create<DiceControlsState>()(
  immer((set) => ({
    diceSet: initialSet,
    diceById: initialDiceById,
    defaultDiceCounts: initialDiceCounts,
    diceCounts: initialDiceCounts,
    diceBonus: 0,
    diceAdvantage: null,
    diceHidden: false,
    diceRollPressTime: null,
    fairnessTesterOpen: false,
    blessActive: false,
    blessCount: 1,
    changeDiceSet(diceSet) {
      set((state) => {
        const counts: DiceCounts = {};
        const prevCounts = state.diceCounts;
        const prevDice = state.diceSet.dice;
        for (let i = 0; i < diceSet.dice.length; i++) {
          const die = diceSet.dice[i];
          const prevDie = prevDice[i];
          // Carry over count if the index and die type match
          if (prevDie && prevDie.type === die.type) {
            counts[die.id] = prevCounts[prevDie.id] || 0;
          } else {
            counts[die.id] = 0;
          }
        }
        state.diceCounts = counts;
        state.diceSet = diceSet;
        state.defaultDiceCounts = getDiceCountsFromSet(diceSet);
        state.diceById = getDiceByIdFromSet(diceSet);
      });
    },
    resetDiceCounts() {
      set((state) => {
        state.diceCounts = { ...state.defaultDiceCounts };
      });
    },
    setDiceCounts(counts, savedDiceById) {
      set((state) => {
        const newCounts = { ...state.defaultDiceCounts };
        
        if (savedDiceById) {
          // Map counts by die type (so it works across different dice sets)
          for (const currentDie of state.diceSet.dice) {
            const savedDieId = Object.keys(counts).find(id => savedDiceById[id]?.type === currentDie.type);
            if (savedDieId) {
              newCounts[currentDie.id] = counts[savedDieId];
            }
          }
        } else {
          // Direct ID mapping
          for (const [id, count] of Object.entries(counts)) {
            newCounts[id] = count;
          }
        }
        
        state.diceCounts = newCounts;
      });
    },
    changeDieCount(id, count) {
      set((state) => {
        if (id in state.diceCounts) {
          state.diceCounts[id] = count;
        }
      });
    },
    incrementDieCount(id) {
      set((state) => {
        if (id in state.diceCounts) {
          state.diceCounts[id] += 1;
        }
      });
    },
    decrementDieCount(id) {
      set((state) => {
        if (id in state.diceCounts) {
          state.diceCounts[id] = Math.max(0, state.diceCounts[id] - 1);
        }
      });
    },
    setDiceBonus(bonus) {
      set((state) => {
        state.diceBonus = bonus;
      });
    },
    setDiceAdvantage(advantage) {
      set((state) => {
        state.diceAdvantage = advantage;
      });
    },
    toggleDiceHidden() {
      set((state) => {
        state.diceHidden = !state.diceHidden;
      });
    },
    setDiceRollPressTime(time) {
      set((state) => {
        state.diceRollPressTime = time;
      });
    },
    toggleFairnessTester() {
      set((state) => {
        state.fairnessTesterOpen = !state.fairnessTesterOpen;
      });
    },
    setBlessActive(active) {
      set((state) => {
        state.blessActive = active;
      });
    },
    setBlessCount(count) {
      set((state) => {
        state.blessCount = count;
      });
    },
  }))
);

function getDiceCountsFromSet(diceSet: DiceSet) {
  const counts: Record<string, number> = {};
  for (const die of diceSet.dice) {
    counts[die.id] = 0;
  }
  return counts;
}

function getDiceByIdFromSet(diceSet: DiceSet) {
  const byId: Record<string, Die> = {};
  for (const die of diceSet.dice) {
    byId[die.id] = die;
  }
  return byId;
}

/** Generate new dice based off of a set of counts, advantage and die */
export function getDiceToRoll(
  counts: DiceCounts,
  advantage: Advantage,
  diceById: Record<string, Die>,
  blessActive?: boolean,
  blessCount?: number
) {
  const dice: (Die | Dice)[] = [];
  const countEntries = Object.entries(counts);
  let d4DieStyle: any = null;
  
  for (const [id, count] of countEntries) {
    const die = diceById[id];
    if (!die) {
      continue;
    }
    
    // Find a D4 style to use for bless
    if (die.type === "D4") {
      d4DieStyle = die.style;
    }
    
    const { style, type } = die;
    for (let i = 0; i < count; i++) {
      if (advantage === null) {
        if (type === "D100") {
          // Push a d100 and d10 when rolling a d100
          dice.push({
            dice: [
              { id: generateDiceId(), style, type: "D100" },
              { id: generateDiceId(), style, type: "D10" },
            ],
          });
        } else {
          dice.push({ id: generateDiceId(), style, type });
        }
      } else {
        // Rolling with advantage or disadvantage
        const combination = advantage === "ADVANTAGE" ? "HIGHEST" : "LOWEST";
        if (type === "D100") {
          // Push 2 d100s and d10s
          dice.push({
            dice: [
              {
                dice: [
                  { id: generateDiceId(), style, type: "D100" },
                  { id: generateDiceId(), style, type: "D10" },
                ],
              },
              {
                dice: [
                  { id: generateDiceId(), style, type: "D100" },
                  { id: generateDiceId(), style, type: "D10" },
                ],
              },
            ],
            combination,
          });
        } else {
          dice.push({
            dice: [
              { id: generateDiceId(), style, type },
              { id: generateDiceId(), style, type },
            ],
            combination,
          });
        }
      }
    }
  }

  // Handle Bless injections
  if (blessActive && blessCount && blessCount > 0) {
    // If we didn't find a d4 style in the selected dice, find one in the set or use a fallback
    if (!d4DieStyle) {
      const anyD4 = Object.values(diceById).find(d => d.type === "D4");
      d4DieStyle = anyD4 ? anyD4.style : "GALAXY"; // fallback style if none found
    }
    
    for (let i = 0; i < blessCount; i++) {
      if (advantage === null) {
        dice.push({ id: generateDiceId(), style: d4DieStyle, type: "D4" });
      } else {
        const combination = advantage === "ADVANTAGE" ? "HIGHEST" : "LOWEST";
        dice.push({
          dice: [
            { id: generateDiceId(), style: d4DieStyle, type: "D4" },
            { id: generateDiceId(), style: d4DieStyle, type: "D4" },
          ],
          combination,
        });
      }
    }
  }

  return dice;
}
