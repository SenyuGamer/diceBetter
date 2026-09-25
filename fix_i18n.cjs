const fs = require('fs');
let content = fs.readFileSync('src/controls/SavedRollsModal.tsx', 'utf8');

content = content.replace('export function SavedRollsModal({ open, onClose }: SavedRollsModalProps) {', 'export function SavedRollsModal({ open, onClose }: SavedRollsModalProps) {\n  const t = useI18n((state) => state.t);');

content = content.replace(/>Tiradas Guardadas</g, '>{t.savedRolls}<');
content = content.replace(/'Tiradas Guardadas'/g, 't.savedRolls');
content = content.replace(/"Tiradas Guardadas"/g, 't.savedRolls');

content = content.replace(/"Buscar tiradas o grupos..."/g, 't.searchRolls');
content = content.replace(/"Nombre del grupo..."/g, 't.groupName');
content = content.replace(/>\+ Nuevo Grupo</g, '>+ {t.newGroup}<');
content = content.replace(/>Crear</g, '>{t.create}<');
content = content.replace(/>Cancelar</g, '>{t.cancel}<');
content = content.replace(/>Favoritos</g, '>{t.favorites}<');
content = content.replace(/>Sin tiradas en este grupo</g, '>{t.noRollsInGroup}<');
content = content.replace(/>Exportar Grupo</g, '>{t.exportGroup}<');
content = content.replace(/>Añadir Tirada</g, '>{t.addRoll}<');
content = content.replace(/"Categoría"/g, 't.category');
content = content.replace(/"Nombre"/g, 't.name');

content = content.replace(/"Cargar con Ventaja"/g, 't.advantage');
content = content.replace(/"Cargar con Desventaja"/g, 't.disadvantage');
content = content.replace(/>Ventaja</g, '>{t.advantage}<');
content = content.replace(/>Desventaja</g, '>{t.disadvantage}<');

content = content.replace(/\["Acciones y Ataques", "Pruebas de Característica", "Tiradas de Salvación", "Armas y Daño"\]/g, '[t.actionsAttacks, t.abilityChecks, t.savingThrows, t.weaponsDamage]');

fs.writeFileSync('src/controls/SavedRollsModal.tsx', content);
