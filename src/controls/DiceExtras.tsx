import { useState } from "react";

import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";

import { DieBonus } from "./DieBonus";
import { DieAdvantage } from "./DieAdvantage";
import { DieBless } from "./DieBless";
import { useDiceControlsStore } from "./store";
import { useDiceRollStore } from "../dice/store";
import { useSimplify3D } from "../plugin/useSimplify3D";
import SpeedIcon from "@mui/icons-material/SpeedRounded";
import Switch from "@mui/material/Switch";

export function DiceExtras() {
  const bonus = useDiceControlsStore((state) => state.diceBonus);
  const setBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);
  
  const blessActive = useDiceControlsStore((state) => state.blessActive);
  const setBlessActive = useDiceControlsStore((state) => state.setBlessActive);
  const blessCount = useDiceControlsStore((state) => state.blessCount);
  const setBlessCount = useDiceControlsStore((state) => state.setBlessCount);

  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const roll = useDiceRollStore((state) => state.roll);
  function clearRollIfNeeded() {
    if (roll) {
      clearRoll();
    }
  }

  const { simplify, toggleSimplify } = useSimplify3D();

  /** Controls (bonus and adv/dis) */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip title="Bonus" placement="top" disableInteractive>
        <IconButton
          aria-label="more"
          id="more-button"
          aria-controls={open ? "more-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ fontSize: "18px" }}
        >
          <span style={{ width: "24px", height: "24px" }}>+/-</span>
        </IconButton>
      </Tooltip>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "more-button",
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <Stack>
          <DieBonus
            bonus={bonus}
            onChange={(bonus) => {
              setBonus(bonus);
              clearRollIfNeeded();
            }}
            onIncrease={() => {
              setBonus(bonus + 1);
              clearRollIfNeeded();
            }}
            onDecrease={() => {
              setBonus(bonus - 1);
              clearRollIfNeeded();
            }}
          />
          <Divider variant="middle" />
          <DieAdvantage
            advantage={advantage}
            onChange={(advantage) => {
              setAdvantage(advantage);
              clearRollIfNeeded();
            }}
          />
          <Divider variant="middle" />
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
          <Divider variant="middle" />
          <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} py={1}>
            <Tooltip title="Modo Rendimiento (Quitar 3D)" placement="left" disableInteractive>
              <Stack direction="row" alignItems="center" gap={1}>
                <SpeedIcon color={simplify ? "primary" : "inherit"} />
                <Switch size="small" checked={simplify} onChange={toggleSimplify} />
              </Stack>
            </Tooltip>
          </Stack>
        </Stack>
      </Menu>
    </>
  );
}
