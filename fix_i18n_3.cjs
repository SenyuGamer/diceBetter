const fs = require('fs');
let content = fs.readFileSync('src/controls/GlobalHistory.tsx', 'utf8');

content = content.replace('export function GlobalHistory() {', 'import { useI18n } from "../i18n";\n\nexport function GlobalHistory() {\n  const t = useI18n((state) => state.t);');
content = content.replace(/"Historial Global"/g, 't.globalHistory');

fs.writeFileSync('src/controls/GlobalHistory.tsx', content);
