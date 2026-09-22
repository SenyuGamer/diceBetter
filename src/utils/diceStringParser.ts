import { Die } from "../types/Die";

export interface ParsedAction {
  name: string;
  counts: Record<string, number>;
  bonus: number;
  diceById: Record<string, Die>;
  category?: string;
}

// Parses string like "1d20 + 4" or "2d6 - 1" or "1d8"
export function parseDiceString(str: string, availableDice: Die[]): ParsedAction | null {
  const regex = /(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/;
  const match = str.match(regex);
  if (!match) return null;

  const count = parseInt(match[1]);
  const faces = parseInt(match[2]);
  const sign = match[3];
  const bonusVal = match[4] ? parseInt(match[4]) : 0;
  
  let bonus = bonusVal;
  if (sign === "-") bonus = -bonus;

  const dieType = `D${faces}`;
  const die = availableDice.find(d => d.type === dieType);
  if (!die) return null;

  const counts: Record<string, number> = {};
  counts[die.id] = count;
  
  const diceById: Record<string, Die> = {};
  diceById[die.id] = die;

  return {
    name: "", // filled by caller
    counts,
    bonus,
    diceById,
  };
}
