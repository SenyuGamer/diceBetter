const fs = require('fs');

let s = fs.readFileSync('src/controls/SavedRollsModal.tsx', 'utf8');
s = s.replace(/Sin tiradas en este grupo/g, '{t.noRollsInGroup}');
s = s.replace(/Guardar tirada actual/g, '{t.saveCurrentRoll}');
s = s.replace(/>\s*Cancelar\s*</g, '>{t.cancel}<');
s = s.replace(/>\s*Guardar\s*</g, '>{t.save}<');

fs.writeFileSync('src/controls/SavedRollsModal.tsx', s);

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
if (!i18n.includes('saveCurrentRoll')) {
  i18n = i18n.replace('  importCharacter: string;\n}', '  importCharacter: string;\n  saveCurrentRoll: string;\n}');
  i18n = i18n.replace('  importCharacter: "Importar PJ",\n};', '  importCharacter: "Importar PJ",\n  saveCurrentRoll: "Guardar tirada actual",\n};');
  i18n = i18n.replace('  importCharacter: "Import Character",\n};', '  importCharacter: "Import Character",\n  saveCurrentRoll: "Save current roll",\n};');
  fs.writeFileSync('src/i18n.ts', i18n);
}
