const fs = require('fs');
let content = fs.readFileSync('src/controls/AdditionsModal.tsx', 'utf8');

content = content.replace('export function AdditionsModal({', 'import { useI18n } from "../i18n";\n\nexport function AdditionsModal({');
content = content.replace('export function AdditionsModal({ open, onClose }: AdditionsModalProps) {', 'export function AdditionsModal({ open, onClose }: AdditionsModalProps) {\n  const language = useI18n((state) => state.language);\n  const t = useI18n((state) => state.t);');

content = content.replace('const additions = [', 'const getAdditions = (lang: string) => lang === "es" ? [');
content = content.replace('];\n\nexport function AdditionsModal', '] : [\n  {\n    icon: <HistoryIcon color="primary" />,\n    title: "Results in History",\n    description: "The history now saves and displays the total numerical result (= X) obtained by the 3D physics in each roll, along with the re-roll option.",\n  },\n  {\n    icon: <AutoAwesomeIcon color="warning" />,\n    title: "Bless with 3D Preview",\n    description: "Bless button and counter in the modifiers bar. Extra d4 dice appear in the 3D physical tray before rolling and duplicate correctly if you roll with Advantage or Disadvantage.",\n  },\n  {\n    icon: <BlockIcon color="error" />,\n    title: "Damage Action (Ignore Bless)",\n    description: "When saving or editing rolls, you can mark them with the \\"Ignore Bless\\" switch. When loading a damage roll, Bless will automatically be deactivated.",\n  },\n  {\n    icon: <BookmarkIcon color="info" />,\n    title: "Organized Rolls",\n    description: "Edit names, reassign characters or add categories (Attacks, Damage, Saves, Skills, etc.) visible in the quick access side panel.",\n  },\n  {\n    icon: <FileDownloadIcon color="success" />,\n    title: "Load Rolls in Tray",\n    description: "Loading saved rolls from the manager or BeyondOwl loads the dice exactly into the 3D physical tray to be thrown manually, instead of resolving automatically.",\n  }\n];\n\nexport function AdditionsModal');

content = content.replace('additions.map', 'getAdditions(language).map');
content = content.replace(/"Novedades y Cambios \\(Changelog\\)"/g, 't.additions');
content = content.replace(/>Novedades y Cambios \(Changelog\)</g, '>{t.additions}<');

fs.writeFileSync('src/controls/AdditionsModal.tsx', content);
