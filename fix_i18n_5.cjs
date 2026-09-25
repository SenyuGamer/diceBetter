const fs = require('fs');
let content = fs.readFileSync('src/controls/DiceExtras.tsx', 'utf8');

content = content.replace('export function DiceExtras() {', 'import { useI18n } from "../i18n";\n\nexport function DiceExtras() {\n  const t = useI18n((state) => state.t);');
content = content.replace(/"Bonus \/ Ventaja"/g, '`${t.bonus} / ${t.advantage}`');

fs.writeFileSync('src/controls/DiceExtras.tsx', content);
