const fs = require('fs');

// i18n.ts
let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace('  bless: string;\n}', '  bless: string;\n  showRoll: string;\n  hideRoll: string;\n  adv: string;\n  dis: string;\n}');
i18n = i18n.replace('  bless: "Bendición",\n};', '  bless: "Bendición",\n  showRoll: "Mostrar Tirada",\n  hideRoll: "Ocultar Tirada",\n  adv: "Ven",\n  dis: "Des",\n};');
i18n = i18n.replace('  bless: "Bless",\n};', '  bless: "Bless",\n  showRoll: "Show Roll",\n  hideRoll: "Hide Roll",\n  adv: "Adv",\n  dis: "Dis",\n};');
fs.writeFileSync('src/i18n.ts', i18n);

// DiceHidden.tsx
let dh = fs.readFileSync('src/controls/DiceHidden.tsx', 'utf8');
dh = dh.replace('export function DiceHidden() {', 'import { useI18n } from "../i18n";\n\nexport function DiceHidden() {\n  const t = useI18n((state) => state.t);');
dh = dh.replace(/title={hidden \? \"Show Roll\" \: \"Hide Roll\"}/, 'title={hidden ? t.showRoll : t.hideRoll}');
fs.writeFileSync('src/controls/DiceHidden.tsx', dh);

// DieAdvantage.tsx
let da = fs.readFileSync('src/controls/DieAdvantage.tsx', 'utf8');
da = da.replace('export function DieAdvantage({ advantage, onChange }: DieAdvantageProps) {', 'import { useI18n } from "../i18n";\n\nexport function DieAdvantage({ advantage, onChange }: DieAdvantageProps) {\n  const t = useI18n((state) => state.t);');
da = da.replace(/>Dis</, '>{t.dis}<');
da = da.replace(/>Adv</, '>{t.adv}<');
fs.writeFileSync('src/controls/DieAdvantage.tsx', da);
