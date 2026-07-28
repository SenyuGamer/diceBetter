import { useState, useEffect, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import CloseIcon from "@mui/icons-material/CloseRounded";
import AddIcon from "@mui/icons-material/AddRounded";

import { fetchAllMonsters, fetchAllItems, CompendiumMonster, CompendiumItem } from "../utils/compendiumFetcher";
import { parseMonster, parseItem } from "../utils/compendiumParser";
import { useSavedRollsStore } from "./savedRolls";
import { useDiceControlsStore } from "./store";

interface CompendiumModalProps {
  open: boolean;
  onClose: () => void;
}

export function CompendiumModal({ open, onClose }: CompendiumModalProps) {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  
  const [monsters, setMonsters] = useState<CompendiumMonster[]>([]);
  const [items, setItems] = useState<CompendiumItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "warning" }>({ open: false, message: "", severity: "success" });

  const addRoll = useSavedRollsStore((state) => state.addRoll);
  const availableDice = useDiceControlsStore((state) => state.diceSet?.dice || []);

  useEffect(() => {
    if (open && monsters.length === 0 && items.length === 0) {
      let isMounted = true;
      setLoading(true);
      
      Promise.all([fetchAllMonsters(), fetchAllItems()])
        .then(([m, i]) => {
          if (isMounted) {
            setMonsters(m);
            setItems(i);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
        
      return () => { isMounted = false; };
    }
  }, [open]);

  const filteredMonsters = useMemo(() => {
    if (tab !== 0 || !query.trim()) return [];
    const q = query.toLowerCase();
    return monsters
      .filter((m) => m.name.toLowerCase().includes(q))
      .slice(0, 50); // limit to 50 for performance
  }, [monsters, query, tab]);

  const filteredItems = useMemo(() => {
    if (tab !== 1 || !query.trim()) return [];
    const q = query.toLowerCase();
    return items
      .filter((i) => i.name.toLowerCase().includes(q))
      .slice(0, 50);
  }, [items, query, tab]);

  function handleAddMonster(m: CompendiumMonster) {
    const actions = parseMonster(m, availableDice);
    if (actions.length === 0) {
      setSnackbar({ open: true, message: `No se encontraron tiradas extraíbles en ${m.name}.`, severity: "warning" });
      return;
    }
    
    const groupName = `${m.name} (${m.source})`;
    actions.forEach((a) => {
      addRoll({
        name: a.name,
        group: groupName,
        counts: a.counts,
        bonus: a.bonus,
        advantage: null,
        diceById: a.diceById,
      });
    });
    setSnackbar({ open: true, message: `¡${actions.length} tiradas agregadas a "${groupName}"!`, severity: "success" });
  }

  function handleAddItem(i: CompendiumItem) {
    const actions = parseItem(i, availableDice);
    if (actions.length === 0) {
      setSnackbar({ open: true, message: `No se encontraron tiradas extraíbles en ${i.name}.`, severity: "warning" });
      return;
    }
    
    const groupName = `${i.name} (${i.source})`;
    actions.forEach((a) => {
      addRoll({
        name: a.name,
        group: groupName,
        counts: a.counts,
        bonus: a.bonus,
        advantage: null,
        diceById: a.diceById,
      });
    });
    setSnackbar({ open: true, message: `¡${actions.length} tiradas agregadas a "${groupName}"!`, severity: "success" });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          Compendio (5 herramientas del bandido)
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
          <Tab label="Monstruos" />
          <Tab label="Objetos / Armas" />
        </Tabs>
      </Box>

      <DialogContent sx={{ minHeight: "400px" }}>
        <Stack gap={2}>
          <TextField
            autoFocus
            fullWidth
            placeholder={tab === 0 ? "Buscar monstruo (ej. Goblin)..." : "Buscar objeto (ej. Longsword)..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
          />

          {loading ? (
            <Stack alignItems="center" py={4}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" mt={2}>
                Descargando base de datos por primera vez...
              </Typography>
            </Stack>
          ) : !query.trim() ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              Escribe algo para buscar.
            </Typography>
          ) : (
            <Stack gap={1}>
              {tab === 0 && filteredMonsters.map((m, idx) => (
                <Stack
                  key={`${m.name}-${m.source}-${idx}`}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  p={1}
                  sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {m.name} <Typography component="span" variant="caption" color="text.secondary">({m.source})</Typography>
                  </Typography>
                  <Tooltip title="Agregar tiradas extraídas a mis Tiradas Guardadas">
                    <Button size="small" startIcon={<AddIcon />} onClick={() => handleAddMonster(m)}>
                      Agregar
                    </Button>
                  </Tooltip>
                </Stack>
              ))}

              {tab === 1 && filteredItems.map((i, idx) => (
                <Stack
                  key={`${i.name}-${i.source}-${idx}`}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  p={1}
                  sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {i.name} <Typography component="span" variant="caption" color="text.secondary">({i.source})</Typography>
                  </Typography>
                  <Tooltip title="Agregar tiradas extraídas a mis Tiradas Guardadas">
                    <Button size="small" startIcon={<AddIcon />} onClick={() => handleAddItem(i)}>
                      Agregar
                    </Button>
                  </Tooltip>
                </Stack>
              ))}

              {(tab === 0 && filteredMonsters.length === 0) || (tab === 1 && filteredItems.length === 0) ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No se encontraron resultados.
                </Typography>
              ) : null}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
