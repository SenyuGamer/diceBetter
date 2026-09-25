/**
 * Scraper minimalista para D&D Beyond.
 * Solo lee los números que DDB ya ha calculado en el DOM visible.
 */

window.BeyondOwlScraper = {
  getRollDataFromElement: function(element) {
    function extractMod(el, fallbackEl) {
      const text = el ? el.textContent : (fallbackEl ? fallbackEl.textContent : "");
      const match = text.match(/([+-]\s*\d+)/);
      return match ? match[1].replace(/\s/g, '') : "+0";
    }

    // 1. Ataque (To-Hit)
    if (element.closest(".ct-combat-attack__tohit, .ddbc-combat-attack__tohit, .ct-spells-spell__tohit, .ddbc-spells-spell__tohit")) {
      const row = element.closest(".ct-combat-attack, .ddbc-combat-attack, .ct-spells-spell, .ddbc-spells-spell");
      const nameEl = row.querySelector(".ct-combat-attack__name, .ddbc-combat-attack__name, .ct-spell-name, .ddbc-spell-name, .ct-spells-spell__name, .ddbc-spells-spell__name");
      const name = nameEl ? nameEl.textContent.replace(/\n/g, ' ').trim() : "Ataque";
      
      const toHitEl = element.closest(".ct-combat-attack__tohit, .ddbc-combat-attack__tohit, .ct-spells-spell__tohit, .ddbc-spells-spell__tohit") || row;
      const toHit = extractMod(toHitEl, row);

      return {
        action: "roll",
        type: "attack",
        name: name + " (Ataque)",
        "to-hit": toHit,
        rollAttack: true,
        rollDamage: false
      };
    }

    // 2. Daño de Armas y Hechizos
    if (element.closest(".ct-combat-attack__damage, .ddbc-combat-attack__damage, .ddbc-combat-item-attack__damage, .ct-spells-spell__damage, .ddbc-spells-spell__damage")) {
      const row = element.closest(".ct-combat-attack, .ddbc-combat-attack, .ddbc-combat-item-attack, .ct-spells-spell, .ddbc-spells-spell");
      const nameEl = row.querySelector(".ct-combat-attack__name, .ddbc-combat-attack__name, .ddbc-combat-item-attack__name, .ct-spell-name, .ddbc-spell-name, .ct-spells-spell__name, .ddbc-spells-spell__name");
      const name = nameEl ? nameEl.textContent.replace(/\n/g, ' ').trim() : "Ataque";
      
      const isVersatile = !!element.querySelector(".ddbc-damage--versatile");
      
      let htmlRaw = element.innerHTML || "";
      let spacedText = htmlRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      
      const damageRegex = /(\d+)\s*d\s*(\d+)\s*(?:([+-])\s*(\d+))?/gi;
      const matches = Array.from(spacedText.matchAll(damageRegex));
      
      let targetMatch = matches[0];
      let suffix = isVersatile ? " (Versátil)" : " (Daño)";

      if (targetMatch) {
        const damages = [];
        // Añadir el daño principal (del botón)
        const qty = parseInt(targetMatch[1], 10);
        const faces = parseInt(targetMatch[2], 10);
        const sign = targetMatch[3] === '-' ? -1 : 1;
        const flat = targetMatch[4] ? parseInt(targetMatch[4], 10) : 0;
        const bonus = sign * flat;
        damages.push(`${qty}d${faces}${bonus >= 0 && bonus !== 0 ? '+' + bonus : (bonus === 0 ? '' : bonus)}`);
        
        // Buscar daño extra en las notas de la fila
        const clonedRow = row.cloneNode(true);
        clonedRow.querySelectorAll('.integrated-dice__container').forEach(e => e.remove());
        const extraText = clonedRow.textContent;
        const extraMatches = Array.from(extraText.matchAll(damageRegex));
        extraMatches.forEach(m => {
           const eQty = parseInt(m[1], 10);
           const eFaces = parseInt(m[2], 10);
           const eSign = m[3] === '-' ? -1 : 1;
           const eFlat = m[4] ? parseInt(m[4], 10) : 0;
           const eBonus = eSign * eFlat;
           damages.push(`${eQty}d${eFaces}${eBonus >= 0 && eBonus !== 0 ? '+' + eBonus : (eBonus === 0 ? '' : eBonus)}`);
        });

        return {
          action: "roll",
          type: "damage",
          name: name + suffix,
          rollAttack: false,
          rollDamage: true,
          damages: damages
        };
      }
    }

    // 3. Habilidades (Skills)
    if (element.closest(".ct-skills__col--modifier, .ddbc-skills__col--modifier") || element.closest(".ct-skills__item, .ddbc-skills__item")) {
      const row = element.closest(".ct-skills__item, .ddbc-skills__item");
      const nameEl = row.querySelector(".ct-skills__col--skill, .ddbc-skills__col--skill");
      const name = nameEl ? nameEl.textContent.trim() : "Habilidad";
      
      const modEl = element.closest(".ct-skills__col--modifier, .ddbc-skills__col--modifier") || row.querySelector(".ct-skills__col--modifier, .ddbc-skills__col--modifier");
      const toHit = extractMod(modEl, row);

      // Detectar badges de ventaja
      const htmlString = row.innerHTML.toLowerCase();
      let advantage = 0; // 0=Normal, 3=Ventaja, 4=Desventaja
      if (htmlString.includes("disadvantage-icon") || htmlString.includes("disadvantage-indicator")) {
        advantage = 4;
      } else if (htmlString.includes("advantage-icon") || htmlString.includes("advantage-indicator")) {
        advantage = 3;
      }

      return {
        action: "roll",
        type: "skill",
        name: name,
        "to-hit": toHit,
        advantage: advantage
      };
    }

    // 4. Salvaciones (Saving Throws)
    if (element.closest(".ct-saving-throws-summary__ability, .ddbc-saving-throws-summary__ability")) {
      const row = element.closest(".ct-saving-throws-summary__ability, .ddbc-saving-throws-summary__ability");
      const nameEl = row.querySelector(".ct-saving-throws-summary__ability-name, .ddbc-saving-throws-summary__ability-name");
      const name = nameEl ? nameEl.textContent.trim() : "Salvación";
      
      const modEl = element.closest(".ct-saving-throws-summary__ability-modifier, .ddbc-saving-throws-summary__ability-modifier") || row.querySelector(".ct-saving-throws-summary__ability-modifier, .ddbc-saving-throws-summary__ability-modifier");
      const toHit = extractMod(modEl, row);

      // Detectar badges
      const htmlString = row.innerHTML.toLowerCase();
      let advantage = 0;
      if (htmlString.includes("disadvantage-icon") || htmlString.includes("disadvantage-indicator")) {
        advantage = 4;
      } else if (htmlString.includes("advantage-icon") || htmlString.includes("advantage-indicator")) {
        advantage = 3;
      }

      return {
        action: "roll",
        type: "saving-throw",
        name: name + " (Salvación)",
        "to-hit": toHit,
        advantage: advantage
      };
    }

    // 5. Iniciativa
    if (element.closest(".ct-combat__summary-group--initiative, .ddbc-combat__summary-group--initiative")) {
      const row = element.closest(".ct-combat__summary-group--initiative, .ddbc-combat__summary-group--initiative");
      const toHit = extractMod(element, row);

      const htmlString = row.innerHTML.toLowerCase();
      let advantage = 0;
      if (htmlString.includes("advantage-indicator") || htmlString.includes("advantage-icon")) {
        advantage = 3;
      }

      return {
        action: "roll",
        type: "initiative",
        name: "Iniciativa",
        "to-hit": toHit,
        advantage: advantage
      };
    }

    // 6. Ability Checks (Fuerza, Destreza, etc.)
    if (element.closest(".ddbc-ability-summary__primary") || element.closest(".ddbc-ability-summary__secondary") || element.closest(".ddbc-ability-summary, .ct-ability-summary")) {
      const row = element.closest(".ddbc-ability-summary, .ct-ability-summary");
      const nameEl = row ? row.querySelector(".ddbc-ability-summary__heading, .ct-ability-summary__heading") : null;
      let name = "Atributo";
      if (nameEl) {
        name = nameEl.textContent.trim().split('\n')[0].trim();
      }
      
      const modEl = element.closest(".ddbc-ability-summary__primary, .ddbc-ability-summary__secondary") || (row ? row.querySelector(".ddbc-ability-summary__primary, .ddbc-ability-summary__secondary") : null);
      const toHit = extractMod(modEl, row);

      return {
        action: "roll",
        type: "ability",
        name: name + " (Atributo)",
        "to-hit": toHit,
        advantage: 0 // A menos que detectemos el buff
      };
    }

    return null;
  }
};
