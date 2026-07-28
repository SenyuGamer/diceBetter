import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { Advantage, DiceCounts } from "./store";
import { Die } from "../types/Die";

export interface SavedRoll {
  id: string;
  name: string;
  group: string;
  counts: DiceCounts;
  bonus: number;
  advantage: Advantage;
  diceById: Record<string, Die>;
  category?: string;
}

interface SavedRollsState {
  groups: string[];
  favoriteGroups: string[];
  savedRolls: SavedRoll[];
  addRoll: (roll: Omit<SavedRoll, "id">) => void;
  removeRoll: (id: string) => void;
  addGroup: (name: string) => void;
  removeGroup: (name: string) => void;
  renameGroup: (oldName: string, newName: string) => void;
  toggleFavoriteGroup: (name: string) => void;
  editRoll: (id: string, updates: Partial<Omit<SavedRoll, "id">>) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export const useSavedRollsStore = create<SavedRollsState>()(
  persist(
    immer((set) => ({
      groups: [],
      favoriteGroups: [],
      savedRolls: [],
      addRoll(roll) {
        set((state) => {
          // Auto-create group if it doesn't exist
          if (!state.groups.includes(roll.group)) {
            state.groups.push(roll.group);
          }
          state.savedRolls.push({ ...roll, id: generateId() });
        });
      },
      removeRoll(id) {
        set((state) => {
          const index = state.savedRolls.findIndex((r) => r.id === id);
          if (index !== -1) {
            state.savedRolls.splice(index, 1);
          }
        });
      },
      editRoll(id, updates) {
        set((state) => {
          const index = state.savedRolls.findIndex((r) => r.id === id);
          if (index !== -1) {
            const current = state.savedRolls[index];
            Object.assign(current, updates);
            
            // Auto-create group if it doesn't exist
            if (updates.group && !state.groups.includes(updates.group)) {
              state.groups.push(updates.group);
            }
          }
        });
      },
      addGroup(name) {
        set((state) => {
          if (!state.groups.includes(name)) {
            state.groups.push(name);
          }
        });
      },
      removeGroup(name) {
        set((state) => {
          state.groups = state.groups.filter((g) => g !== name);
          state.favoriteGroups = state.favoriteGroups.filter((g) => g !== name);
          state.savedRolls = state.savedRolls.filter((r) => r.group !== name);
        });
      },
      renameGroup(oldName, newName) {
        set((state) => {
          const idx = state.groups.indexOf(oldName);
          if (idx !== -1) {
            state.groups[idx] = newName;
          }
          const favIdx = state.favoriteGroups.indexOf(oldName);
          if (favIdx !== -1) {
            state.favoriteGroups[favIdx] = newName;
          }
          for (const roll of state.savedRolls) {
            if (roll.group === oldName) {
              roll.group = newName;
            }
          }
        });
      },
      toggleFavoriteGroup(name) {
        set((state) => {
          const idx = state.favoriteGroups.indexOf(name);
          if (idx !== -1) {
            state.favoriteGroups.splice(idx, 1);
          } else {
            state.favoriteGroups.push(name);
          }
        });
      },
    })),
    {
      name: "dice-saved-rolls",
    }
  )
);
