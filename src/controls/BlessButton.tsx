import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeRounded";

import { DieBless } from "./DieBless";
import { useDiceControlsStore } from "./store";
import { useDiceRollStore } from "../dice/store";

export function BlessButton() {
  const [open, setOpen] = useState(false);

  const blessActive = useDiceControlsStore((state) => state.blessActive);
  const setBlessActive = useDiceControlsStore((state) => state.setBlessActive);
  const blessCount = useDiceControlsStore((state) => state.blessCount);
  const setBlessCount = useDiceControlsStore((state) => state.setBlessCount);

  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const roll = useDiceRollStore((state) => state.roll);
  function clearRollIfNeeded() {
    if (roll) clearRoll();
  }

  return (
    <>
      <Tooltip
        title={blessActive ? `Bless ×${blessCount} (activo)` : "Bless"}
        placement="right"
        disableInteractive
      >
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ color: blessActive ? "warning.main" : "inherit" }}
        >
          <AutoAwesomeIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          Bless
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          <DieBless
            active={blessActive}
            count={blessCount}
            onActiveChange={(active) => {
              setBlessActive(active);
              clearRollIfNeeded();
            }}
            onCountChange={(count) => {
              setBlessCount(count);
              clearRollIfNeeded();
            }}
            onIncrease={() => {
              setBlessCount(blessCount + 1);
              clearRollIfNeeded();
            }}
            onDecrease={() => {
              setBlessCount(Math.max(1, blessCount - 1));
              clearRollIfNeeded();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
