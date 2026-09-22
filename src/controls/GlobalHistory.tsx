import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

import { useGlobalHistoryStore } from "./globalHistoryStore";
import { DicePreview } from "../previews/DicePreview";

export function GlobalHistory() {
  const globalRolls = useGlobalHistoryStore((state) => state.globalRolls);
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
      <Tooltip title="Historial Global" placement="right">
        <IconButton onClick={handleClick} disabled={globalRolls.length === 0}>
          <SettingsBackupRestoreIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            maxHeight: "300px",
            width: "250px",
          }
        }}
      >
        {globalRolls.length === 0 && (
          <MenuItem disabled>No hay tiradas recientes</MenuItem>
        )}
        {globalRolls.slice().reverse().map((roll) => (
          <MenuItem key={roll.id} disableRipple sx={{ cursor: "default", flexDirection: "column", alignItems: "flex-start" }}>
            <Stack direction="row" alignItems="center" gap={1} width="100%">
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: roll.playerColor as string }} />
              <Typography variant="caption" sx={{ flexGrow: 1, fontWeight: 'bold' }}>{roll.playerName}</Typography>
              {roll.result !== undefined && (
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{roll.result}</Typography>
              )}
            </Stack>
            <Stack direction="row" flexWrap="wrap" mt={0.5}>
              {Object.entries(roll.counts).map(([id, count]) => {
                const die = roll.diceById[id];
                if (!die) return null;
                return [...Array(count)].map((_, i) => (
                  <DicePreview
                    key={`${id}-${i}`}
                    diceType={die.type}
                    diceStyle={die.style}
                    size="small"
                  />
                ));
              })}
              {roll.bonus !== 0 && (
                <Typography variant="caption" sx={{ ml: 0.5, mt: '2px' }}>
                  {roll.bonus > 0 ? "+" : ""}{roll.bonus}
                </Typography>
              )}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
