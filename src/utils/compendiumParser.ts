import { CompendiumMonster, CompendiumItem } from "./compendiumFetcher";
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

export function parseMonster(monster: CompendiumMonster, availableDice: Die[]): ParsedAction[] {
  const actions: ParsedAction[] = [];
  const actionNames = new Set<string>(); // avoid duplicates if same attack has multiple hits

  const extractActions = (entriesList: any[]) => {
    if (!entriesList) return;
    for (const action of entriesList) {
      if (!action.entries) continue;
      
      const text = JSON.stringify(action.entries);
      
      // Hit (Attack roll)
      const hitMatch = text.match(/\{@hit ([-+]?\d+)\}/);
      if (hitMatch) {
        const bonus = parseInt(hitMatch[1]);
        const d20 = availableDice.find(d => d.type === "D20");
        if (d20) {
          const atkName = `${action.name} (Ataque)`;
          if (!actionNames.has(atkName)) {
            actions.push({
              name: atkName,
              counts: { [d20.id]: 1 },
              bonus,
              diceById: { [d20.id]: d20 },
              category: "Acciones y Ataques",
            });
            actionNames.add(atkName);
          }
        }
      }

      // Damage or generic dice rolls
      const diceMatches = Array.from(text.matchAll(/\{@(?:damage|dice) ([^}]+)\}/g));
      let dmgIdx = 1;
      for (const m of diceMatches) {
        const parsed = parseDiceString(m[1], availableDice);
        if (parsed) {
          const suffix = diceMatches.length > 1 ? ` (Daño ${dmgIdx++})` : ` (Daño)`;
          parsed.name = `${action.name}${suffix}`;
          parsed.category = "Acciones y Ataques";
          
          if (!actionNames.has(parsed.name)) {
            actions.push(parsed);
            actionNames.add(parsed.name);
          }
        }
      }
    }
  };

  extractActions(monster.action || []);
  extractActions(monster.trait || []);
  extractActions(monster.reaction || []);
  extractActions(monster.legendary || []);

  const d20 = availableDice.find(d => d.type === "D20");
  if (d20) {
    const stats: Record<string, string> = {
      str: "Fuerza",
      dex: "Destreza",
      con: "Constitución",
      int: "Inteligencia",
      wis: "Sabiduría",
      cha: "Carisma",
    };

    for (const [key, label] of Object.entries(stats)) {
      const statVal = (monster as any)[key] as number | undefined;
      if (statVal !== undefined) {
        const mod = Math.floor((statVal - 10) / 2);
        
        // Prueba de Característica (Check)
        actions.push({
          name: `${label}`,
          counts: { [d20.id]: 1 },
          bonus: mod,
          diceById: { [d20.id]: d20 },
          category: "Pruebas de Característica",
        });

        // Tirada de Salvación (Save)
        // Check if there is an explicit save bonus (e.g. "+6")
        let saveBonus = mod;
        if (monster.save && monster.save[key]) {
          const explicitSave = monster.save[key];
          const parsedSave = parseInt(explicitSave.replace("+", ""));
          if (!isNaN(parsedSave)) {
            saveBonus = parsedSave;
          }
        }
        
        actions.push({
          name: `${label}`,
          counts: { [d20.id]: 1 },
          bonus: saveBonus,
          diceById: { [d20.id]: d20 },
          category: "Tiradas de Salvación",
        });
      }
    }
  }

  return actions;
}

export function parseItem(item: CompendiumItem, availableDice: Die[]): ParsedAction[] {
  const actions: ParsedAction[] = [];
  
  if (item.dmg1) {
    const parsed = parseDiceString(item.dmg1, availableDice);
    if (parsed) {
      parsed.name = `${item.name} (Daño)`;
      parsed.category = "Armas y Daño";
      actions.push(parsed);
    }
  }
  
  if (item.dmg2) {
    const parsed = parseDiceString(item.dmg2, availableDice);
    if (parsed) {
      parsed.name = `${item.name} (Versátil / 2M)`;
      parsed.category = "Armas y Daño";
      actions.push(parsed);
    }
  }

  return actions;
}
