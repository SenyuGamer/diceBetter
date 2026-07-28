import { useState } from "react";

import SimpleBar from "simplebar-react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineRounded";
import BookmarkIcon from "@mui/icons-material/BookmarkRounded";
import MenuBookIcon from "@mui/icons-material/MenuBookRounded";

import { DiceSetPicker } from "./DiceSetPicker";
import { DicePicker } from "./DicePicker";
import { DiceExtras } from "./DiceExtras";
import { DiceHidden } from "./DiceHidden";
import { DiceHistory } from "./DiceHistory";
import { AdditionsModal } from "./AdditionsModal";
import { SavedRollsModal } from "./SavedRollsModal";
import { CompendiumModal } from "./CompendiumModal";

import { FairnessTesterButton } from "../tests/FairnessTesterButton";

import { PluginGate } from "../plugin/PluginGate";
import { DiceRollSync } from "../plugin/DiceRollSync";
import { PartyTrays } from "../plugin/PartyTrays";
import { ResizeObserver as PluginResizeObserver } from "../plugin/ResizeObserver";

export function Sidebar() {
  const [additionsOpen, setAdditionsOpen] = useState(false);
  const [savedRollsOpen, setSavedRollsOpen] = useState(false);
  const [compendiumOpen, setCompendiumOpen] = useState(false);

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
      <Stack p={1} gap={1} alignItems="center">
        <DiceSetPicker />
        <Divider flexItem sx={{ mx: 1 }} />
        <DicePicker />
        <Divider flexItem sx={{ mx: 1 }} />
        <DiceHidden />
        <DiceExtras />
        <DiceHistory />
        <Tooltip title="Tiradas Guardadas" placement="top" disableInteractive>
          <IconButton
            id="saved-rolls-button"
            onClick={() => setSavedRollsOpen(true)}
          >
            <BookmarkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Compendio (5 herramientas del bandido)" placement="top" disableInteractive>
          <IconButton
            id="compendium-button"
            onClick={() => setCompendiumOpen(true)}
          >
            <MenuBookIcon />
          </IconButton>
        </Tooltip>
        <FairnessTesterButton />
        <Tooltip title="Adiciones" placement="top" disableInteractive>
          <IconButton
            id="additions-button"
            onClick={() => setAdditionsOpen(true)}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <PluginGate>
          <Divider flexItem sx={{ mx: 1 }} />
          <DiceRollSync />
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
      <CompendiumModal
        open={compendiumOpen}
        onClose={() => setCompendiumOpen(false)}
      />
    </SimpleBar>
  );
}
