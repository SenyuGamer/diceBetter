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

interface AdditionsModalProps {
  open: boolean;
  onClose: () => void;
}

const additions = [
  {
    icon: <MouseIcon />,
    title: "Restar dados con click derecho",
    description:
      "Haz click derecho sobre un dado en la barra lateral para restar uno. Click izquierdo sigue sumando como siempre.",
  },
  {
    icon: <MenuBookIcon />,
    title: "Compendio Automático (5 herramientas del bandido)",
    description:
      "Usa el ícono de libro (📖) para buscar monstruos y objetos. La extensión calculará automáticamente sus tiradas de ataque, daño, pruebas y salvaciones, guardándolas organizadas en su propio grupo.",
  },
  {
    icon: <BookmarkIcon />,
    title: "Cargar Tiradas Guardadas",
    description:
      "Al seleccionar una tirada guardada (normal, con Ventaja o Desventaja), los dados se cargarán en tu bandeja y limpiarán la mesa. Así puedes añadir dados extra (ej. Bendición) o modificar el bonificador antes de lanzar.",
  },
  {
    icon: <EditIcon />,
    title: "Categorías y Edición",
    description:
      "Haz clic en el lápiz (✏️) al lado de una tirada guardada para cambiarle el nombre, moverla de personaje, o asignarle una Categoría personalizada (ej. Hechizos). Las tiradas se agruparán por su categoría automáticamente.",
  },
  {
    icon: <ReplayIcon />,
    title: "Volver a tirar desde el historial",
    description:
      "Cada entrada del historial ahora tiene un botón de repetir (↻) para volver a tirar rápidamente.",
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
        Adiciones
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
