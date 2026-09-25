const fs = require('fs');
let content = fs.readFileSync('src/controls/DiceHistory.tsx', 'utf8');

content = content.replace('export function DiceHistory() {', 'import { useI18n } from "../i18n";\n\nexport function DiceHistory() {\n  const t = useI18n((state) => state.t);');
content = content.replace(/"Mis Tiradas Recientes"/g, 't.recentRolls');
content = content.replace(/"Mis Tiradas"/g, 't.recentRolls');

fs.writeFileSync('src/controls/DiceHistory.tsx', content);
