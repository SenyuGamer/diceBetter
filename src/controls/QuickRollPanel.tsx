import { useState, useRef } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTheme, alpha } from "@mui/material/styles";
import SimpleBar from "simplebar-react";

import CasinoIcon from "@mui/icons-material/CasinoRounded";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownwardRounded";

import { useSavedRollsStore, SavedRoll } from "./savedRolls";
import { getDiceToRoll, useDiceControlsStore } from "./store";
import { useDiceRollStore } from "../dice/store";
import { DicePreview } from "../previews/DicePreview";
import { Advantage } from "./store";

export function QuickRollPanel() {
  const groups = useSavedRollsStore((state) => state.groups);
  const favoriteGroups = useSavedRollsStore((state) => state.favoriteGroups);
  const savedRolls = useSavedRollsStore((state) => state.savedRolls);

  const visibleGroups = groups.filter((g) => favoriteGroups.includes(g));

  if (visibleGroups.length === 0) {
    return null;
  }

  return (
    <SimpleBar
      style={{
        maxHeight: "100vh",
        width: "60px",
        minWidth: "60px",
        overflowY: "auto",
        position: "relative" as const,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <Stack p={0.5} gap={0.5} alignItems="center">
        {visibleGroups.map((group) => {
          const groupRolls = savedRolls.filter((r) => r.group === group);
          if (groupRolls.length === 0) return null;
          return (
            <QuickRollGroup key={group} group={group} rolls={groupRolls} />
          );
        })}
      </Stack>
    </SimpleBar>
  );
}

function QuickRollGroup({
  group,
  rolls,
}: {
  group: string;
  rolls: SavedRoll[];
}) {
  const theme = useTheme();

  return (
    <Stack alignItems="center" gap={0.5} width="100%">
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.65rem",
          fontWeight: "bold",
          textAlign: "center",
          lineHeight: 1.1,
          color: theme.palette.text.primary,
          maxWidth: "56px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          px: 0.25,
          mt: 0.5,
          mb: 0.5,
        }}
      >
        {group}
      </Typography>

      {/* Categorized rendering */}
      {(() => {
        const knownMapping: Record<string, string> = {
          "attack": "Ataques",
          "Acciones y Ataques": "Ataques",
          "Ataques": "Ataques",
          "damage": "Daño",
          "Armas y Daño": "Daño",
          "skill": "Habilidades",
          "save": "Salvación",
          "Tiradas de Salvación": "Salvación",
          "check": "Atributos",
          "Pruebas de Característica": "Atributos",
          "other": "Otros",
        };

        const groupedRolls: Record<string, SavedRoll[]> = {};
        for (const roll of rolls) {
          let cat = roll.category || "Otros";
          if (knownMapping[cat]) {
            cat = knownMapping[cat];
          }
          if (!groupedRolls[cat]) {
            groupedRolls[cat] = [];
          }
          groupedRolls[cat].push(roll);
        }

        const standardOrder = ["Ataques", "Daño", "Salvación", "Habilidades", "Atributos"];
        const customCategories = Object.keys(groupedRolls)
          .filter(c => !standardOrder.includes(c) && c !== "Otros")
          .sort();

        return (
          <>
            {standardOrder.map(cat => groupedRolls[cat] ? renderCategory(cat, groupedRolls[cat]) : null)}
            {customCategories.map(cat => renderCategory(cat, groupedRolls[cat]))}
            {groupedRolls["Otros"] ? renderCategory("Otros", groupedRolls["Otros"]) : null}
          </>
        );
      })()}

      <Box
        component="div"
        sx={{
          width: "70%",
          height: "1px",
          bgcolor: alpha(theme.palette.divider, 0.3),
          my: 0.5,
        }}
      />
    </Stack>
  );

  function renderCategory(title: string, catRolls: SavedRoll[]) {
    if (catRolls.length === 0) return null;
    return (
      <Stack alignItems="center" gap={0.5} width="100%">
        <Typography 
          variant="caption" 
          sx={{ 
            fontSize: "0.55rem", 
            color: theme.palette.text.disabled, 
            lineHeight: 1,
            textTransform: "uppercase",
            mt: 0.25
          }}
        >
          {title}
        </Typography>
        {catRolls.map((roll) => (
          <QuickRollItem key={roll.id} roll={roll} />
        ))}
      </Stack>
    );
  }
}

function QuickRollItem({ roll }: { roll: SavedRoll }) {
  const [expanded, setExpanded] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  const hidden = useDiceControlsStore((state) => state.diceHidden);
  const setDiceCounts = useDiceControlsStore((state) => state.setDiceCounts);
  const setBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);
  const clearRoll = useDiceRollStore((state) => state.clearRoll);

  function handleRoll(advantage: Advantage) {
    // We now just LOAD the roll into the tray, we don't start the roll instantly.
    clearRoll();
    setDiceCounts(roll.counts, roll.diceById);
    setBonus(roll.bonus);
    setAdvantage(advantage);
    setExpanded(false);
  }

  // Find the primary die to show as preview
  const primaryDie = Object.entries(roll.counts).reduce<{
    id: string;
    count: number;
  } | null>((best, [id, count]) => {
    if (count > 0 && (!best || count > best.count)) {
      return { id, count };
    }
    return best;
  }, null);

  const die = primaryDie ? roll.diceById[primaryDie.id] : null;

  return (
    <ClickAwayListener onClickAway={() => setExpanded(false)}>
      <Box
        component="div"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Roll name label */}
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.6rem",
            lineHeight: 1,
            maxWidth: "56px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: theme.palette.text.secondary,
            mb: 0.25,
          }}
        >
          {roll.name}
        </Typography>

        {/* Main die button */}
        <Tooltip
          title={expanded ? "Cargar tirada normal" : roll.name}
          placement="left"
          disableInteractive
        >
          <IconButton
            ref={anchorRef}
            onClick={() => {
              if (!expanded) {
                setExpanded(true);
              } else {
                handleRoll(null);
              }
            }}
            sx={{
              p: 0.25,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              zIndex: 2,
              transition: theme.transitions.create([
                "background-color",
                "transform",
                "box-shadow",
              ]),
              bgcolor: expanded
                ? alpha(theme.palette.primary.main, 0.2)
                : "transparent",
              boxShadow: expanded
                ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.4)}`
                : "none",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.25),
                transform: "scale(1.1)",
              },
            }}
          >
            {die ? (
              <DicePreview diceStyle={die.style} diceType={die.type} />
            ) : (
              <CasinoIcon />
            )}
          </IconButton>
        </Tooltip>

        {/* Floating arrow buttons using Popper to escape stacking contexts */}
        <Popper
          open={expanded}
          anchorEl={anchorRef.current}
          placement="left"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ]}
          style={{ zIndex: 1300 }} // high z-index to stay above everything (like dialogs)
        >
          <Stack
            direction="column"
            gap={0.5}
            sx={{
              animation: "fadeSlideIn 150ms ease-out",
              "@keyframes fadeSlideIn": {
                from: { opacity: 0, transform: "translateX(8px) scale(0.8)" },
                to: { opacity: 1, transform: "translateX(0) scale(1)" },
              },
            }}
          >
            {/* Advantage - top */}
            <Tooltip title="Ventaja" placement="left" disableInteractive>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoll("ADVANTAGE");
                }}
                sx={{
                  width: "40px",
                  height: "40px",
                  bgcolor: alpha(theme.palette.background.paper, 0.95),
                  border: `2px solid ${alpha(theme.palette.success.main, 0.5)}`,
                  color: theme.palette.success.main,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    transform: "scale(1.15)",
                  },
                  transition: theme.transitions.create([
                    "transform",
                    "background-color",
                  ]),
                }}
              >
                <ArrowUpwardIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
            </Tooltip>

            {/* Disadvantage - bottom */}
            <Tooltip title="Desventaja" placement="left" disableInteractive>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoll("DISADVANTAGE");
                }}
                sx={{
                  width: "40px",
                  height: "40px",
                  bgcolor: alpha(theme.palette.background.paper, 0.95),
                  border: `2px solid ${alpha(theme.palette.error.main, 0.5)}`,
                  color: theme.palette.error.main,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                    transform: "scale(1.15)",
                  },
                  transition: theme.transitions.create([
                    "transform",
                    "background-color",
                  ]),
                }}
              >
                <ArrowDownwardIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
