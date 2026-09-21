import { useEffect } from "react";
import { useDiceRollStore } from "../dice/store";
import { useDiceControlsStore, Advantage } from "../controls/store";
import { getDiceToRoll } from "../controls/store";
import { parseDiceString } from "../utils/compendiumParser";
import { DiceRoll } from "../types/DiceRoll";


export function Beyond20Listener() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Allow receiving testing messages from our own window or from Beyond20
      if (event.data?.type === "Beyond20_Roll") {
        console.log("Beyond20_Roll Event Received:", event.data);
        let request = event.data.data;
        if (!request) return;

        // Si viene de un RenderedRoll (owl20 o nuestro bridge), la tirada real está dentro de .request
        if (request.action === "rendered-roll" && request.request) {
            request = request.request;
        }

        // Parse advantage
        let advantage: Advantage = null;
        if (request.advantage === 3) advantage = "ADVANTAGE";
        else if (request.advantage === 4) advantage = "DISADVANTAGE";
        else if (request.advantage === 1) advantage = "ADVANTAGE";

        const diceSet = useDiceControlsStore.getState().diceSet;
        const availableDice = diceSet.dice;

        const allCounts: Record<string, number> = {};
        const allDiceById: Record<string, any> = {};
        let totalBonus = 0;
        let isDamage = false;

        // Determine what to roll based on request type
        if (request.type === "attack" || request.type === "spell-attack") {
          // Check if we should roll attack
          if (request.rollAttack !== false && request["to-hit"]) {
            let toHit = request["to-hit"];
            if (!toHit.startsWith("+") && !toHit.startsWith("-")) toHit = "+" + toHit;
            const parsed = parseDiceString(`1d20${toHit}`, availableDice);
            if (parsed) {
              Object.assign(allCounts, parsed.counts);
              Object.assign(allDiceById, parsed.diceById);
              totalBonus += parsed.bonus;
            }
          }
          // Note: If request.rollDamage is true, Beyond20 rolls damage with it.
          // For 3D dice, summing attack and damage in one number is bad, so we 
          // might want to prioritize attack, and ignore damage if attack is rolled.
          // We will just roll attack if it's an attack event for now.
        } else if (request.type === "damage" || request.rollDamage) {
          isDamage = true;
          if (request.damages && Array.isArray(request.damages)) {
            for (const dmg of request.damages) {
               // dmg is like "1d8+3" or "2d6-1"
               const parsed = parseDiceString(dmg, availableDice);
               if (parsed) {
                 for (const [id, count] of Object.entries(parsed.counts)) {
                   allCounts[id] = (allCounts[id] || 0) + count;
                 }
                 Object.assign(allDiceById, parsed.diceById);
                 totalBonus += parsed.bonus;
               }
            }
          }
        } else if (["skill", "ability", "saving-throw", "initiative", "death-save"].includes(request.type)) {
           // Standard 1d20 rolls
           let toHit = request["to-hit"] || "+0";
           if (!toHit.startsWith("+") && !toHit.startsWith("-")) toHit = "+" + toHit;
           const parsed = parseDiceString(`1d20${toHit}`, availableDice);
           if (parsed) {
             Object.assign(allCounts, parsed.counts);
             Object.assign(allDiceById, parsed.diceById);
             totalBonus += parsed.bonus;
           }
        }

        // Critical overrides (double the base damage dice)
        if (request.rollCritical && isDamage) {
           for (const id in allCounts) {
             allCounts[id] *= 2;
           }
        }

        // Generate the DiceRoll payload
        const dice = getDiceToRoll(
          allCounts,
          advantage,
          allDiceById,
          isDamage ? false : undefined, // Ignore bless for damage
          0
        );

        const roll: DiceRoll = {
          dice,
          bonus: totalBonus,
        };

        if (dice.length > 0) {
          // Optional: Send this via OBR.broadcast instead of rolling directly
          // For now, let's just trigger the local roll directly to test it out!
          useDiceRollStore.getState().startRoll(roll);
        } else {
          console.warn("Beyond20 event did not contain valid dice to roll:", request);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
