import create from "zustand";

type Language = "es" | "en";

interface Translations {
  savedRolls: string;
  globalHistory: string;
  recentRolls: string;
  advantage: string;
  disadvantage: string;
  bonus: string;
  damage: string;
  attacks: string;
  saves: string;
  skills: string;
  attributes: string;
  hide: string;
  newGroup: string;
  favorites: string;
  groups: string;
  noRollsInGroup: string;
  roll: string;
  cancel: string;
  save: string;
  load: string;
  edit: string;
  delete: string;
  rename: string;
  searchRolls: string;
  groupName: string;
  abilityChecks: string;
  actionsAttacks: string;
  savingThrows: string;
  weaponsDamage: string;
  normalRoll: string;
  clear: string;
  exportGroup: string;
  addRoll: string;
  category: string;
  name: string;
  create: string;
  options: string;
  tools: string;
  fairnessTester: string;
  additions: string;
  bless: string;
  showRoll: string;
  hideRoll: string;
  adv: string;
  dis: string;
  importCharacter: string;
  saveCurrentRoll: string;
  history: string;
  noHistory: string;
  rollDiceToAdd: string;
}

const es: Translations = {
  savedRolls: "Tiradas Guardadas",
  globalHistory: "Historial Global",
  recentRolls: "Mis Tiradas",
  advantage: "Ventaja",
  disadvantage: "Desventaja",
  bonus: "Bonus",
  damage: "Daño",
  attacks: "Ataques",
  saves: "Salvación",
  skills: "Habilidades",
  attributes: "Atributos",
  hide: "Ocultar",
  newGroup: "Nuevo Grupo",
  favorites: "Favoritos",
  groups: "Grupos",
  noRollsInGroup: "Sin tiradas en este grupo",
  roll: "Tirar",
  cancel: "Cancelar",
  save: "Guardar",
  load: "Cargar",
  edit: "Editar",
  delete: "Eliminar",
  rename: "Renombrar",
  searchRolls: "Buscar tiradas o grupos...",
  groupName: "Nombre del grupo...",
  abilityChecks: "Pruebas de Característica",
  actionsAttacks: "Acciones y Ataques",
  savingThrows: "Tiradas de Salvación",
  weaponsDamage: "Armas y Daño",
  normalRoll: "Tirada Normal",
  clear: "Limpiar",
  exportGroup: "Exportar Grupo",
  addRoll: "Añadir Tirada",
  category: "Categoría",
  name: "Nombre",
  create: "Crear",
  options: "Opciones",
  tools: "Herramientas",
  fairnessTester: "Verificador de Equidad",
  additions: "Adiciones (Mod)",
  bless: "Bendición",
  showRoll: "Mostrar Tirada",
  hideRoll: "Ocultar Tirada",
  adv: "Ven",
  dis: "Des",
  importCharacter: "Importar PJ",
  saveCurrentRoll: "Guardar tirada actual",
  history: "Historial",
  noHistory: "Sin historial",
  rollDiceToAdd: "Lanza los dados para agregarlos al historial.",
};

const en: Translations = {
  savedRolls: "Saved Rolls",
  globalHistory: "Global History",
  recentRolls: "My Rolls",
  advantage: "Advantage",
  disadvantage: "Disadvantage",
  bonus: "Bonus",
  damage: "Damage",
  attacks: "Attacks",
  saves: "Saves",
  skills: "Skills",
  attributes: "Attributes",
  hide: "Hide",
  newGroup: "New Group",
  favorites: "Favorites",
  groups: "Groups",
  noRollsInGroup: "No rolls in this group",
  roll: "Roll",
  cancel: "Cancel",
  save: "Save",
  load: "Load",
  edit: "Edit",
  delete: "Delete",
  rename: "Rename",
  searchRolls: "Search rolls or groups...",
  groupName: "Group name...",
  abilityChecks: "Ability Checks",
  actionsAttacks: "Actions & Attacks",
  savingThrows: "Saving Throws",
  weaponsDamage: "Weapons & Damage",
  normalRoll: "Normal Roll",
  clear: "Clear",
  exportGroup: "Export Group",
  addRoll: "Add Roll",
  category: "Category",
  name: "Name",
  create: "Create",
  options: "Options",
  tools: "Tools",
  fairnessTester: "Fairness Tester",
  additions: "Additions (Mod)",
  bless: "Bless",
  showRoll: "Show Roll",
  hideRoll: "Hide Roll",
  adv: "Adv",
  dis: "Dis",
  importCharacter: "Import Character",
  saveCurrentRoll: "Save current roll",
  history: "History",
  noHistory: "No History",
  rollDiceToAdd: "Roll dice to add to the roll history.",
};

interface I18nStore {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const getBrowserLanguage = (): Language => {
  const lang = navigator.language.split("-")[0];
  return lang === "es" ? "es" : "en";
};

export const useI18n = create<I18nStore>((set) => ({
  language: getBrowserLanguage(),
  t: getBrowserLanguage() === "es" ? es : en,
  setLanguage: (lang: Language) => set({ language: lang, t: lang === "es" ? es : en }),
}));
