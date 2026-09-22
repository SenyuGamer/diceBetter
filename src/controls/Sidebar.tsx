import { useState } from "react";

import SimpleBar from "simplebar-react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";

import HelpOutlineIcon from "@mui/icons-material/HelpOutlineRounded";
import BookmarkIcon from "@mui/icons-material/BookmarkRounded";
import MenuBookIcon from "@mui/icons-material/MenuBookRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessIcon from "@mui/icons-material/ExpandLessRounded";
import CasinoIcon from "@mui/icons-material/CasinoRounded";
import TuneIcon from "@mui/icons-material/TuneRounded";
import BuildIcon from "@mui/icons-material/BuildRounded";
import SpeedIcon from "@mui/icons-material/SpeedRounded";

import { DiceSetPicker } from "./DiceSetPicker";
import { DicePicker } from "./DicePicker";
import { DiceHidden } from "./DiceHidden";
import { DiceExtras } from "./DiceExtras";
import { BlessButton } from "./BlessButton";
import { DiceHistory } from "./DiceHistory";
import { GlobalHistory } from "./GlobalHistory";
import { useDiceControlsStore } from "./store";
import { AdditionsModal } from "./AdditionsModal";
import { SavedRollsModal } from "./SavedRollsModal";

import { FairnessTesterButton } from "../tests/FairnessTesterButton";

import { PluginGate } from "../plugin/PluginGate";
import { DiceRollSync } from "../plugin/DiceRollSync";
import { GlobalHistorySync } from "../plugin/GlobalHistorySync";
import { PartyTrays } from "../plugin/PartyTrays";
import { ResizeObserver as PluginResizeObserver } from "../plugin/ResizeObserver";

/** A small collapsible section header that fits in the 60px sidebar */
function SidebarSection({
  icon,
  label,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <Tooltip title={label} placement="right" disableInteractive>
        <ButtonBase
          onClick={onToggle}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 0.5,
            gap: 0,
            opacity: open ? 1 : 0.6,
            transition: "opacity 0.2s",
            "&:hover": { opacity: 1 },
          }}
        >
          {icon}
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 12 }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 12 }} />
          )}
        </ButtonBase>
      </Tooltip>
      <Collapse in={open} unmountOnExit>
        {children}
      </Collapse>
    </>
  );
}

export function Sidebar() {
  const [diceOpen, setDiceOpen] = useState(true);
  const [modOpen, setModOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const [additionsOpen, setAdditionsOpen] = useState(false);
  const [savedRollsOpen, setSavedRollsOpen] = useState(false);

  const simplify = useDiceControlsStore(state => state.simplify3D);
  const toggleSimplify = useDiceControlsStore(state => state.toggleSimplify3D);

  return (
    <SimpleBar
      style={{
        maxHeight: "100vh",
        width: "60px",
        minWidth: "60px",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      <Stack p={1} gap={0.5} alignItems="center">

        {/* ── Sección: Dados ── */}
        <SidebarSection
          icon={<CasinoIcon fontSize="small" />}
          label="Dados"
          open={diceOpen}
          onToggle={() => setDiceOpen((v) => !v)}
        >
          <Stack gap={1} alignItems="center" pb={1}>
            <DiceSetPicker />
            <Divider flexItem sx={{ mx: 1 }} />
            <DicePicker />
            <Divider flexItem sx={{ mx: 1 }} />
            <DiceHidden />
          </Stack>
        </SidebarSection>

        <Divider flexItem sx={{ mx: 1 }} />

        {/* ── Sección: Modificadores ── */}
        <SidebarSection
          icon={<TuneIcon fontSize="small" />}
          label="Modificadores"
          open={modOpen}
          onToggle={() => setModOpen((v) => !v)}
        >
          <Stack gap={1} alignItems="center" pb={1}>
            {/* 1. Bonus + Ventaja */}
            <DiceExtras />
            {/* 2. Toggle Rendimiento */}
            <Tooltip title="Modo Rendimiento (3D Simplificado)" placement="right" disableInteractive>
              <IconButton 
                onClick={toggleSimplify} 
                sx={
                  simplify 
                    ? { bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } }
                    : undefined
                }
              >
                <SpeedIcon />
              </IconButton>
            </Tooltip>
            {/* 3. Bless */}
            <BlessButton />
          </Stack>
        </SidebarSection>

        <Divider flexItem sx={{ mx: 1 }} />

        {/* ── Sección: Herramientas ── */}
        <SidebarSection
          icon={<BuildIcon fontSize="small" />}
          label="Herramientas"
          open={toolsOpen}
          onToggle={() => setToolsOpen((v) => !v)}
        >
          <Stack gap={1} alignItems="center" pb={1}>
            <DiceHistory />
            <GlobalHistory />
            <Tooltip title="Tiradas Guardadas" placement="right" disableInteractive>
              <IconButton
                id="saved-rolls-button"
                onClick={() => setSavedRollsOpen(true)}
              >
                <BookmarkIcon />
              </IconButton>
            </Tooltip>
            <FairnessTesterButton />
            <Tooltip title="Novedades y Cambios (Changelog)" placement="right" disableInteractive>
              <IconButton
                id="additions-button"
                onClick={() => setAdditionsOpen(true)}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </SidebarSection>

        <PluginGate>
          <Divider flexItem sx={{ mx: 1 }} />
          <DiceRollSync />
          <GlobalHistorySync readOnly={true} />
          <PartyTrays />
          <PluginResizeObserver />
        </PluginGate>

      </Stack>

      <AdditionsModal
        open={additionsOpen}
        onClose={() => setAdditionsOpen(false)}
      />
      <SavedRollsModal
        open={savedRollsOpen}
        onClose={() => setSavedRollsOpen(false)}
      />
    </SimpleBar>
  );
}
