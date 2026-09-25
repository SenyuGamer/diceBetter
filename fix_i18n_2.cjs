const fs = require('fs');
let content = fs.readFileSync('src/controls/QuickRollPanel.tsx', 'utf8');

content = content.replace('export function QuickRollPanel({', 'import { useI18n } from "../i18n";\n\nexport function QuickRollPanel({');
content = content.replace('export function QuickRollPanel({ open, onClose }: QuickRollPanelProps) {', 'export function QuickRollPanel({ open, onClose }: QuickRollPanelProps) {\n  const t = useI18n((state) => state.t);');

content = content.replace(/"damage": "Daño"/g, '"damage": t.damage');
content = content.replace(/"Armas y Daño": "Daño"/g, '"Armas y Daño": t.damage');
content = content.replace(/"Tiradas de Salvación": "Salvación"/g, '"Tiradas de Salvación": t.saves');
content = content.replace(/\["Ataques", "Daño", "Salvación", "Habilidades", "Atributos"\]/g, '[t.attacks, t.damage, t.saves, t.skills, t.attributes]');
content = content.replace(/>Tirada normal</g, '>{t.normalRoll}<');

content = content.replace(/\"Ventaja\"/g, 't.advantage');
content = content.replace(/\"Desventaja\"/g, 't.disadvantage');

fs.writeFileSync('src/controls/QuickRollPanel.tsx', content);
