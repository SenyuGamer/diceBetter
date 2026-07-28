import { useMemo, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import CloseIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import PlayArrowIcon from "@mui/icons-material/PlayArrowRounded";
import SaveIcon from "@mui/icons-material/SaveRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownwardRounded";
import CheckIcon from "@mui/icons-material/CheckRounded";
import StarIcon from "@mui/icons-material/StarRounded";
import StarBorderIcon from "@mui/icons-material/StarBorderRounded";

import { SavedRoll, useSavedRollsStore } from "./savedRolls";
import { useDiceControlsStore, Advantage } from "./store";
import { useDiceRollStore } from "../dice/store";
import { DicePreview } from "../previews/DicePreview";

interface SavedRollsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SavedRollsModal({ open, onClose }: SavedRollsModalProps) {
  const groups = useSavedRollsStore((state) => state.groups);
  const savedRolls = useSavedRollsStore((state) => state.savedRolls);
  const removeRoll = useSavedRollsStore((state) => state.removeRoll);
  const removeGroup = useSavedRollsStore((state) => state.removeGroup);
  const renameGroup = useSavedRollsStore((state) => state.renameGroup);
  const favoriteGroups = useSavedRollsStore((state) => state.favoriteGroups);
  const toggleFavoriteGroup = useSavedRollsStore(
    (state) => state.toggleFavoriteGroup
  );
  const editRoll = useSavedRollsStore((state) => state.editRoll);

  const setDiceCounts = useDiceControlsStore((state) => state.setDiceCounts);
  const setBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);
  const clearRoll = useDiceRollStore((state) => state.clearRoll);

  function handleLoadSaved(roll: SavedRoll, overrideAdvantage: Advantage = roll.advantage) {
    clearRoll();
    setDiceCounts(roll.counts, roll.diceById);
    setBonus(roll.bonus);
    setAdvantage(overrideAdvantage);
    onClose();
  }

  // Group rename state
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editGroupValue, setEditGroupValue] = useState("");

  function handleStartRename(group: string) {
    setEditingGroup(group);
    setEditGroupValue(group);
  }

  function handleConfirmRename() {
    if (editingGroup && editGroupValue.trim()) {
      renameGroup(editingGroup, editGroupValue.trim());
    }
    setEditingGroup(null);
    setEditGroupValue("");
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Tiradas Guardadas
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack gap={2}>
          {/* Save current roll section */}
          <SaveCurrentRollForm groups={groups} onClose={onClose} />

          {groups.length === 0 && savedRolls.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              py={2}
            >
              No hay tiradas guardadas aún. Selecciona dados y guárdalos aquí.
            </Typography>
          )}

          {/* Groups accordion */}
          {groups.map((group) => {
            const groupRolls = savedRolls.filter((r) => r.group === group);
            return (
              <Accordion key={group} defaultExpanded disableGutters>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: 2 }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    flexGrow={1}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {editingGroup === group ? (
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <TextField
                          value={editGroupValue}
                          onChange={(e) => setEditGroupValue(e.target.value)}
                          size="small"
                          variant="standard"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleConfirmRename();
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmRename();
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ) : (
                      <>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {group}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({groupRolls.length})
                        </Typography>
                      </>
                    )}
                  </Stack>
                  {editingGroup !== group && (
                    <Stack direction="row" gap={0.5} mr={1}>
                      <Tooltip title={favoriteGroups.includes(group) ? "Quitar de acceso rápido" : "Acceso rápido"}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteGroup(group);
                          }}
                          sx={{
                            color: favoriteGroups.includes(group)
                              ? "warning.main"
                              : undefined,
                          }}
                        >
                          {favoriteGroups.includes(group) ? (
                            <StarIcon fontSize="small" />
                          ) : (
                            <StarBorderIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Renombrar grupo">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRename(group);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar grupo">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeGroup(group);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </AccordionSummary>
                <AccordionDetails sx={{ px: 1, pt: 0 }}>
                  {groupRolls.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                      py={1}
                    >
                      Sin tiradas en este grupo
                    </Typography>
                  ) : (
                    <Stack gap={0.5}>
                      {(() => {
                        // Agrupar por categoría
                        const rollsByCategory: Record<string, SavedRoll[]> = {};
                        groupRolls.forEach(roll => {
                          const cat = roll.category || "General";
                          if (!rollsByCategory[cat]) rollsByCategory[cat] = [];
                          rollsByCategory[cat].push(roll);
                        });

                        const categories = Object.keys(rollsByCategory).sort();

                        // Si solo hay "General", no renderizamos título
                        if (categories.length === 1 && categories[0] === "General") {
                          return groupRolls.map((roll) => (
                            <SavedRollChip
                              key={roll.id}
                              roll={roll}
                              groups={groups}
                              onLoad={(adv) => handleLoadSaved(roll, adv)}
                              onDelete={() => removeRoll(roll.id)}
                              onEdit={(updates) => editRoll(roll.id, updates)}
                            />
                          ));
                        }

                        return categories.map(cat => (
                          <Stack key={cat} gap={0.5} mb={1}>
                            <Typography variant="caption" color="primary.main" fontWeight="bold" sx={{ textTransform: "uppercase", ml: 0.5 }}>
                              {cat}
                            </Typography>
                            {rollsByCategory[cat].map((roll) => (
                              <SavedRollChip
                                key={roll.id}
                                roll={roll}
                                groups={groups}
                                onLoad={(adv) => handleLoadSaved(roll, adv)}
                                onDelete={() => removeRoll(roll.id)}
                                onEdit={(updates) => editRoll(roll.id, updates)}
                              />
                            ))}
                          </Stack>
                        ));
                      })()}
                    </Stack>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

function SavedRollChip({
  roll,
  groups,
  onLoad,
  onDelete,
  onEdit,
}: {
  roll: SavedRoll;
  groups: string[];
  onLoad: (adv: Advantage) => void;
  onDelete: () => void;
  onEdit: (updates: Partial<Omit<SavedRoll, "id">>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(roll.name);
  const [editGroup, setEditGroup] = useState(roll.group);
  const [editCategory, setEditCategory] = useState(roll.category || "");

  const currentCounts = useDiceControlsStore((state) => state.diceCounts);
  const currentBonus = useDiceControlsStore((state) => state.diceBonus);
  const currentAdvantage = useDiceControlsStore((state) => state.diceAdvantage);
  const currentDiceById = useDiceControlsStore((state) =>
    state.diceSet?.dice.reduce((acc, die) => {
      acc[die.id] = die;
      return acc;
    }, {} as Record<string, any>)
  );

  function handleSaveEdit() {
    if (editName.trim() && editGroup.trim()) {
      onEdit({
        name: editName.trim(),
        group: editGroup.trim(),
        category: editCategory.trim() || undefined,
      });
      setIsEditing(false);
    }
  }

  function handleOverwriteDice() {
    if (editName.trim() && editGroup.trim()) {
      onEdit({
        name: editName.trim(),
        group: editGroup.trim(),
        category: editCategory.trim() || undefined,
        counts: currentCounts,
        bonus: currentBonus,
        advantage: currentAdvantage,
        diceById: currentDiceById || roll.diceById,
      });
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <Box p={1} sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
        <Stack gap={1}>
          <TextField
            size="small"
            label="Nombre de la tirada"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
          />
          <Autocomplete
            freeSolo
            options={groups}
            value={editGroup}
            onChange={(_, newValue) => setEditGroup(newValue || "")}
            onInputChange={(_, newValue) => setEditGroup(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Grupo (Personaje / Monstruo)" size="small" />
            )}
          />
          <Autocomplete
            freeSolo
            options={["Acciones y Ataques", "Pruebas de Característica", "Tiradas de Salvación", "Armas y Daño"]}
            value={editCategory}
            onChange={(_, newValue) => setEditCategory(newValue || "")}
            onInputChange={(_, newValue) => setEditCategory(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Categoría (Opcional)" size="small" placeholder="Ej. Acciones, Habilidades..." />
            )}
          />
          <Stack direction="row" gap={1} justifyContent="flex-end">
            <Tooltip title="Actualizar dados con los seleccionados actualmente">
              <Button size="small" color="warning" onClick={handleOverwriteDice}>
                Usar Dados Actuales
              </Button>
            </Tooltip>
            <Button size="small" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button size="small" variant="contained" onClick={handleSaveEdit}>
              Guardar
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Chip
      sx={{
        height: "auto",
        py: 0.5,
        ".MuiChip-label": {
          flexGrow: 1,
          overflow: "hidden",
        },
        ".MuiChip-deleteIcon": {
          position: "absolute",
          right: 0,
        },
      }}
      label={
        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" pr={6}>
          <Tooltip title="Cargar Tirada Normal" disableInteractive>
            <Box 
              onClick={() => onLoad(null)} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                flexGrow: 1,
                '&:hover': { bgcolor: 'action.hover' } 
              }}
            >
              <Typography variant="body2" fontWeight="bold" mr={1}>
                {roll.name}
              </Typography>
              {Object.entries(roll.counts).map(([id, count]) => {
                const die = roll.diceById[id];
                if (!die || count === 0) return null;
                return (
                  <Stack key={id} direction="row" alignItems="center" gap={0.25} mr={0.5}>
                    {count}
                    <DicePreview
                      diceStyle={die.style}
                      diceType={die.type}
                      size="small"
                    />
                  </Stack>
                );
              })}
              {roll.bonus !== 0 && (
                <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  {roll.bonus > 0 && "+"}
                  {roll.bonus}
                </Typography>
              )}
            </Box>
          </Tooltip>

          <Stack direction="row" alignItems="center" gap={0.5}>
            <Tooltip title="Cargar con Ventaja" disableInteractive>
              <IconButton 
                size="small" 
                onClick={() => onLoad("ADVANTAGE")} 
                sx={{ 
                  bgcolor: "success.dark", 
                  color: "white", 
                  width: 24, height: 24,
                  "&:hover": { bgcolor: "success.main" }
                }}
              >
                <ArrowUpwardIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Cargar con Desventaja" disableInteractive>
              <IconButton 
                size="small" 
                onClick={() => onLoad("DISADVANTAGE")} 
                sx={{ 
                  bgcolor: "error.dark", 
                  color: "white", 
                  width: 24, height: 24,
                  "&:hover": { bgcolor: "error.main" }
                }}
              >
                <ArrowDownwardIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      }
      variant="filled"
      deleteIcon={
        <Stack direction="row" gap={0}>
          <Tooltip title="Editar (Mover de Personaje, Cambiar Nombre)" disableInteractive>
            <EditIcon
              fontSize="small"
              sx={{ cursor: "pointer", opacity: 0.7, "&:hover": { opacity: 1 } }}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar" disableInteractive>
            <DeleteIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            />
          </Tooltip>
        </Stack>
      }
      onDelete={() => {}} // dummy to show deleteIcon
    />
  );
}

function SaveCurrentRollForm({
  groups,
  onClose,
}: {
  groups: string[];
  onClose: () => void;
}) {
  const counts = useDiceControlsStore((state) => state.diceCounts);
  const bonus = useDiceControlsStore((state) => state.diceBonus);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const diceById = useDiceControlsStore((state) => state.diceById);
  const defaultDiceCounts = useDiceControlsStore(
    (state) => state.defaultDiceCounts
  );

  const addRoll = useSavedRollsStore((state) => state.addRoll);

  const hasDice = useMemo(
    () =>
      !Object.entries(defaultDiceCounts).every(
        ([type, count]) => counts[type] === count
      ) ||
      bonus !== 0 ||
      advantage !== null,
    [counts, defaultDiceCounts, bonus, advantage]
  );

  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [category, setCategory] = useState("");

  function handleSave() {
    if (!name.trim() || !group.trim()) return;
    addRoll({
      name: name.trim(),
      group: group.trim(),
      category: category.trim() || undefined,
      counts: { ...counts },
      bonus,
      advantage,
      diceById: { ...diceById },
    });
    setName("");
    setGroup("");
    setCategory("");
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: "action.hover",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Guardar tirada actual
      </Typography>

      {/* Preview of selected dice */}
      {hasDice ? (
        <Stack direction="row" alignItems="center" gap={0.5} mb={1.5} flexWrap="wrap">
          {Object.entries(counts).map(([id, count]) => {
            const die = diceById[id];
            if (!die || count === 0) return null;
            return (
              <Stack key={id} direction="row" alignItems="center" gap={0.25}>
                {count}
                <DicePreview
                  diceStyle={die.style}
                  diceType={die.type}
                  size="small"
                />
              </Stack>
            );
          })}
          {bonus !== 0 && (
            <Typography variant="body2">
              {bonus > 0 && "+"}
              {bonus}
            </Typography>
          )}
          {advantage !== null && (
            <Typography variant="body2">
              {advantage === "ADVANTAGE" ? "Ventaja" : "Desventaja"}
            </Typography>
          )}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Selecciona dados en la barra lateral para guardar una tirada.
        </Typography>
      )}

      <Stack gap={1.5}>
        <TextField
          label="Nombre de la tirada"
          placeholder="Ej: Ataque espada"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          fullWidth
          disabled={!hasDice}
        />
        <Autocomplete
          freeSolo
          options={groups}
          value={group}
          onInputChange={(_e, newValue) => setGroup(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Personaje / Monstruo"
              placeholder="Ej: Gandalf"
              size="small"
            />
          )}
          disabled={!hasDice}
        />
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasDice || !name.trim() || !group.trim()}
          size="small"
        >
          Guardar
        </Button>
      </Stack>
    </Box>
  );
}
