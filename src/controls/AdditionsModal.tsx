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
import ReplayIcon from "@mui/icons-material/ReplayRounded";
import MenuBookIcon from "@mui/icons-material/MenuBookRounded";
import EditIcon from "@mui/icons-material/EditRounded";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeRounded";
import HistoryIcon from "@mui/icons-material/HistoryRounded";
import VolumeUpIcon from "@mui/icons-material/VolumeUpRounded";
import FileDownloadIcon from "@mui/icons-material/FileDownloadRounded";
import SpeedIcon from "@mui/icons-material/SpeedRounded";
import PaletteIcon from "@mui/icons-material/PaletteRounded";
import BlockIcon from "@mui/icons-material/BlockRounded";

interface AdditionsModalProps {
  open: boolean;
  onClose: () => void;
}

const additions = [
  {
    icon: <HistoryIcon color="primary" />,
    title: "Resultados en el Historial",
    description:
      "El historial ahora guarda y muestra el resultado numérico total (= X) obtenido por la física 3D en cada tirada, junto a la opción de volver a tirar (↻).",
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
    icon: <MenuBookIcon color="info" />,
    title: "Compendio y Homebrew (TheGiddyLimit)",
    description:
      "Búsqueda automática de criaturas, armas, habilidades y salvaciones oficiales y colecciones Homebrew en formato 5etools, guardándolas listas para usar.",
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

export function AdditionsModal({ open, onClose }: AdditionsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Novedades y Cambios (Changelog)
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
      </DialogContent>
    </Dialog>
  );
}
