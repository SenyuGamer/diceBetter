const fs = require('fs');
let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace('  dis: string;\n}', '  dis: string;\n  importCharacter: string;\n}');
i18n = i18n.replace('  dis: "Des",\n};', '  dis: "Des",\n  importCharacter: "Importar PJ",\n};');
i18n = i18n.replace('  dis: "Dis",\n};', '  dis: "Dis",\n  importCharacter: "Import Character",\n};');
fs.writeFileSync('src/i18n.ts', i18n);
