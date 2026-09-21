// content.js - BetterDice Exporter

// Crear el botón flotante
const btn = document.createElement("button");
btn.className = "betterdice-export-btn";
btn.innerText = "Exportar a BetterDice";
document.body.appendChild(btn);

btn.addEventListener("click", () => {
    try {
        const characterData = scrapeCharacter();
        downloadJSON(characterData);
        btn.innerText = "¡Exportado con éxito!";
        setTimeout(() => btn.innerText = "Exportar a BetterDice", 3000);
    } catch (err) {
        console.error(err);
        btn.innerText = "Error (Ver Consola)";
        setTimeout(() => btn.innerText = "Exportar a BetterDice", 3000);
    }
});

function scrapeCharacter() {
    // 1. Obtener Nombre del Personaje y Avatar
    const nameNode = document.querySelector(".ddbc-character-name, .ct-character-name");
    const charName = (nameNode && nameNode.textContent) ? nameNode.textContent.trim() : "Personaje_Desconocido";

    const avatarNode = document.querySelector(".ddbc-character-avatar__portrait, .ct-character-avatar__portrait");
    let avatarUrl = "";
    if (avatarNode) {
        const bgImage = window.getComputedStyle(avatarNode).backgroundImage;
        if (bgImage && typeof bgImage === 'string' && bgImage !== "none") {
            avatarUrl = bgImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        }
    }

    const rolls = [];

    // 2. Extraer Ataques (Armas y Hechizos en la pestaña "Actions")
    const attackRows = document.querySelectorAll(".ddbc-combat-attack, .ct-combat-attack");
    
    attackRows.forEach(row => {
        const nameEl = row.querySelector(".ddbc-combat-attack__name, .ct-combat-attack__name");
        if (!nameEl) return;
        const rawName = (nameEl.textContent || "").trim();
        const attackName = rawName.replace(/\n/g, ' ');

        // Ataque (To Hit)
        const toHitEl = row.querySelector(".ddbc-combat-attack__tohit, .ct-combat-attack__tohit");
        if (toHitEl) {
            const hitText = (toHitEl.textContent || "").trim();
            const match = hitText.match(/([+-]\s*\d+)/);
            if (match && match[1]) {
                const bonus = parseInt(match[1].replace(/\s/g, ''), 10);
                rolls.push({
                    name: attackName + " (Ataque)",
                    category: "Ataques",
                    counts: { "d20": 1 },
                    bonus: bonus,
                    advantage: null,
                    diceById: {
                        "d20": { id: "d20", style: "GALAXY", type: "D20" }
                    },
                    isDamage: false
                });
            }
        }

        // Daño (Damage)
        const damageEl = row.querySelector(".ddbc-combat-attack__damage, .ct-combat-attack__damage");
        if (damageEl) {
            const damageText = (damageEl.textContent || "").trim();
            const damageRegex = /(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/;
            const match = damageText.match(damageRegex);
            if (match && match[1] && match[2]) {
                const qty = parseInt(match[1], 10);
                const faces = parseInt(match[2], 10);
                const sign = match[3] === '-' ? -1 : 1;
                const flat = match[4] ? parseInt(match[4], 10) : 0;
                const bonus = sign * flat;
                
                const typeName = `D${faces}`;
                const dieId = `d${faces}`;
                
                const counts = {};
                counts[dieId] = qty;
                const diceById = {};
                diceById[dieId] = { id: dieId, style: "GALAXY", type: typeName };

                rolls.push({
                    name: attackName + " (Daño)",
                    category: "Daño",
                    counts: counts,
                    bonus: bonus,
                    advantage: null,
                    diceById: diceById,
                    isDamage: true
                });
            }
        }
    });

    // 2.5 Extraer Tiradas de Salvación (Saving Throws) del propio personaje
    const saves = document.querySelectorAll(".ddbc-saving-throws-summary__ability, .ct-saving-throws-summary__ability");
    saves.forEach(save => {
        const nameEl = save.querySelector(".ddbc-saving-throws-summary__ability-name, .ct-saving-throws-summary__ability-name");
        const modEl = save.querySelector(".ddbc-saving-throws-summary__ability-modifier, .ct-saving-throws-summary__ability-modifier");
        
        if (nameEl && modEl) {
            const saveName = (nameEl.textContent || "").trim();
            const modText = (modEl.textContent || "").trim();
            const match = modText.match(/([+-]\s*\d+)/);
            if (match && match[1]) {
                const bonus = parseInt(match[1].replace(/\s/g, ''), 10);
                rolls.push({
                    name: saveName + " (Salvación)",
                    category: "Tiradas de Salvación",
                    counts: { "d20": 1 },
                    bonus: bonus,
                    advantage: null,
                    diceById: { "d20": { id: "d20", style: "GALAXY", type: "D20" } },
                    isDamage: false
                });
            }
        }
    });

    // 2.6 Extraer Habilidades (Skills)
    const skills = document.querySelectorAll(".ddbc-skills__item, .ct-skills__item");
    skills.forEach(skill => {
        const nameEl = skill.querySelector(".ddbc-skills__col--skill, .ct-skills__col--skill");
        const modEl = skill.querySelector(".ddbc-skills__col--modifier, .ct-skills__col--modifier");
        
        if (nameEl && modEl) {
            const skillName = (nameEl.textContent || "").trim();
            const modText = (modEl.textContent || "").trim();
            const match = modText.match(/([+-]\s*\d+)/);
            if (match && match[1]) {
                const bonus = parseInt(match[1].replace(/\s/g, ''), 10);
                rolls.push({
                    name: skillName,
                    category: "Habilidades",
                    counts: { "d20": 1 },
                    bonus: bonus,
                    advantage: null,
                    diceById: { "d20": { id: "d20", style: "GALAXY", type: "D20" } },
                    isDamage: false
                });
            }
        }
    });

    // 3. Devolver JSON estructurado para BetterDice
    return {
        type: "better-dice-mod-pj",
        version: 1,
        group: charName,
        rolls: rolls
    };
}

function downloadJSON(data) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const safeName = (data.group || "Personaje").replace(/\s+/g, '_');
    downloadAnchorNode.setAttribute("download", `${safeName}.json`);
    document.body.appendChild(downloadAnchorNode); // requerido para Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
