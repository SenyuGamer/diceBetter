import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/CloseRounded";
import MouseIcon from "@mui/icons-material/MouseRounded";
import BookmarkIcon from "@mui/icons-material/BookmarkRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeRounded";
import HistoryIcon from "@mui/icons-material/HistoryRounded";
import VolumeUpIcon from "@mui/icons-material/VolumeUpRounded";
import FileDownloadIcon from "@mui/icons-material/FileDownloadRounded";
import SpeedIcon from "@mui/icons-material/SpeedRounded";
import PaletteIcon from "@mui/icons-material/PaletteRounded";
import BlockIcon from "@mui/icons-material/BlockRounded";
import LanguageIcon from "@mui/icons-material/LanguageRounded";
import FolderZipIcon from "@mui/icons-material/FolderZipRounded";

import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDebugStore } from "../debug/store";
import { useI18n } from "../i18n";

interface AdditionsModalProps {
  open: boolean;
  onClose: () => void;
}

const getAdditions = (lang: string) => {
  if (lang === "es") {
    return [
      {
        icon: <LanguageIcon color="primary" />,
        title: "Internacionalización (Inglés)",
        description:
          "La extensión ahora detecta automáticamente el idioma de tu navegador web y traduce toda la interfaz al Inglés o Español.",
      },
      {
        icon: <FolderZipIcon color="success" />,
        title: "Grupos Plegables",
        description:
          "Ahora puedes colapsar o expandir los grupos en el menú de tiradas guardadas, y la extensión recordará tu elección entre sesiones.",
      },
      {
        icon: <HistoryIcon color="primary" />,
        title: "Resultados en el Historial",
        description:
          "El historial ahora guarda y muestra el resultado numérico total (= X) obtenido por la física 3D en cada tirada, junto a la opción de volver a tirar (↺).",
      },
      {
        icon: <AutoAwesomeIcon color="warning" />,
        title: "Bendición (Bless) con Previsualización 3D",
        description:
          "Botón y contador de Bless en la barra de modificadores. Los dados d4 extra aparecen en la bandeja física 3D antes de tirar y se duplican correctamente si tiras con Ventaja o Desventaja.",
      },
      {
        icon: <BlockIcon color="error" />,
        title: "Acción de Daño (Ignorar Bless)",
        description:
          "Al guardar o editar tiradas, puedes marcarlas con el switch 'Ignorar Bless (Tirada de daño)'. Al cargar una tirada de daño, Bless se desactivará automáticamente para no sumarse al daño.",
      },
      {
        icon: <PaletteIcon color="secondary" />,
        title: "Preservación de Colores y Estilos",
        description:
          "Al guardar y cargar tiradas personalizadas, se conservan exactamente los mismos materiales, colores y estilos de dados seleccionados.",
      },
      {
        icon: <FileDownloadIcon color="success" />,
        title: "Exportar e Importar Personajes (.json)",
        description:
          "En el modal de tiradas guardadas, ahora puedes exportar grupos enteros de tiradas a archivos .json y compartirlos o importarlos en cualquier momento.",
      },
      {
        icon: <VolumeUpIcon color="warning" />,
        title: "Sonidos de Crítico (Nat 20) y Pifia (Nat 1)",
        description:
          "Efectos de audio sintetizados: fanfarria ascendente al sacar un 20 natural en d20, y sonido descendente al sacar una pifia (1).",
      },
      {
        icon: <SpeedIcon color="action" />,
        title: "Modo Rendimiento (Simplificar 3D)",
        description:
          "Opción para ocultar las bandejas 3D flotantes de las tiradas de otros jugadores y mostrar solo una notificación de texto con el desglose del resultado.",
      },
      {
        icon: <EditIcon color="action" />,
        title: "Categorías y Edición Dinámica",
        description:
          "Edita nombres, reasigna personajes o añade categorías (Ataques, Daño, Salvación, Habilidades, etc.) visibles también en el panel lateral de acceso rápido.",
      },
      {
        icon: <BookmarkIcon color="action" />,
        title: "Cargar Tiradas en la Bandeja",
        description:
          "Al pulsar una tirada guardada o de acceso rápido, los dados se cargan en la bandeja para que puedas revisar bonificadores o sumar dados antes de lanzar.",
      },
      {
        icon: <MouseIcon color="action" />,
        title: "Restar dados con clic derecho",
        description:
          "Haz clic derecho sobre un dado en la barra lateral para restar unidades. Clic izquierdo sigue sumando.",
      },
    ];
  }

  return [
    {
      icon: <LanguageIcon color="primary" />,
      title: "Internationalization (English)",
      description:
        "The extension now automatically detects your web browser language and translates the entire interface to English or Spanish.",
    },
    {
      icon: <FolderZipIcon color="success" />,
      title: "Collapsible Groups",
      description:
        "You can now collapse or expand groups in the saved rolls menu, and the extension will remember your choice between sessions.",
    },
    {
      icon: <HistoryIcon color="primary" />,
      title: "Results in History",
      description:
        "The history now saves and displays the total numerical result (= X) obtained by the 3D physics in each roll, along with the re-roll option (↺).",
    },
    {
      icon: <AutoAwesomeIcon color="warning" />,
      title: "Bless with 3D Preview",
      description:
        "Bless button and counter in the modifiers bar. Extra d4 dice appear in the 3D physical tray before rolling and duplicate correctly if you roll with Advantage or Disadvantage.",
    },
    {
      icon: <BlockIcon color="error" />,
      title: "Damage Action (Ignore Bless)",
      description:
        "When saving or editing rolls, you can mark them with the 'Ignore Bless' switch. When loading a damage roll, Bless will automatically be deactivated.",
    },
    {
      icon: <PaletteIcon color="secondary" />,
      title: "Color and Style Preservation",
      description:
        "When saving and loading custom rolls, the exact same materials, colors, and dice styles selected are preserved.",
    },
    {
      icon: <FileDownloadIcon color="success" />,
      title: "Export and Import Characters (.json)",
      description:
        "In the saved rolls modal, you can now export entire groups of rolls to .json files and share or import them at any time.",
    },
    {
      icon: <VolumeUpIcon color="warning" />,
      title: "Crit (Nat 20) and Fumble (Nat 1) Sounds",
      description:
        "Synthesized audio effects: ascending fanfare when rolling a natural 20 on a d20, and descending sound when rolling a fumble (1).",
    },
    {
      icon: <SpeedIcon color="action" />,
      title: "Performance Mode (Simplify 3D)",
      description:
        "Option to hide floating 3D trays from other players' rolls and show only a text notification with the result breakdown.",
    },
    {
      icon: <EditIcon color="action" />,
      title: "Categories and Dynamic Editing",
      description:
        "Edit names, reassign characters or add categories (Attacks, Damage, Saves, Skills, etc.) also visible in the quick access side panel.",
    },
    {
      icon: <BookmarkIcon color="action" />,
      title: "Load Rolls into Tray",
      description:
        "When clicking a saved or quick access roll, the dice are loaded into the tray so you can check bonuses or add dice before rolling.",
    },
    {
      icon: <MouseIcon color="action" />,
      title: "Subtract dice with right click",
      description:
        "Right-click on a die in the sidebar to subtract units. Left-click continues to add.",
    },
  ];
};

export function AdditionsModal({ open, onClose }: AdditionsModalProps) {
  const photoStudioEnabled = useDebugStore((state) => state.photoStudioEnabled);
  const togglePhotoStudio = useDebugStore((state) => state.togglePhotoStudio);

  const language = useI18n((state) => state.language);
  const t = useI18n((state) => state.t);
  const additions = getAdditions(language);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {t.additions}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List disablePadding>
          {additions.map((addition, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {addition.icon}
              </ListItemIcon>
              <ListItemText
                primary={addition.title}
                secondary={addition.description}
              />
            </ListItem>
          ))}
        </List>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <FormControlLabel
            control={
              <Switch
                checked={photoStudioEnabled}
                onChange={togglePhotoStudio}
                color="secondary"
              />
            }
            label="Modo Debug (Photo Studio)"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
