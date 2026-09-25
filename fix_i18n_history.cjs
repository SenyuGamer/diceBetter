const fs = require('fs');

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace('  saveCurrentRoll: string;\n}', '  saveCurrentRoll: string;\n  history: string;\n  noHistory: string;\n  rollDiceToAdd: string;\n}');
i18n = i18n.replace('  saveCurrentRoll: "Guardar tirada actual",\n};', '  saveCurrentRoll: "Guardar tirada actual",\n  history: "Historial",\n  noHistory: "Sin historial",\n  rollDiceToAdd: "Lanza los dados para agregarlos al historial.",\n};');
i18n = i18n.replace('  saveCurrentRoll: "Save current roll",\n};', '  saveCurrentRoll: "Save current roll",\n  history: "History",\n  noHistory: "No History",\n  rollDiceToAdd: "Roll dice to add to the roll history.",\n};');
fs.writeFileSync('src/i18n.ts', i18n);

let dh = fs.readFileSync('src/controls/DiceHistory.tsx', 'utf8');
if (!dh.includes('import { useI18n }')) {
  dh = dh.replace('export function DiceHistory() {', 'import { useI18n } from "../i18n";\n\nexport function DiceHistory() {\n  const t = useI18n((state) => state.t);');
}
dh = dh.replace('title="History"', 'title={t.history}');
dh = dh.replace('>No History<', '>{t.noHistory}<');
dh = dh.replace(/Roll dice to add to the roll history\./g, '{t.rollDiceToAdd}');
fs.writeFileSync('src/controls/DiceHistory.tsx', dh);
