import { useEffect, useState } from "react";

import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

import IncreaseIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DecreaseIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeRounded";

type DieBlessProps = {
  active: boolean;
  count: number;
  onActiveChange: (active: boolean) => void;
  onCountChange: (count: number) => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function DieBless({
  active,
  count,
  onActiveChange,
  onCountChange,
  onIncrease,
  onDecrease,
}: DieBlessProps) {
  const [countString, setCountString] = useState(`${count}`);

  useEffect(() => {
    setCountString(`${count}`);
  }, [count]);

  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ cursor: "inherit" }}>
        <ListItemIcon sx={{ minWidth: "38px", justifyContent: "center" }}>
          <Tooltip title="Bless" placement="top">
            <AutoAwesomeIcon color={active ? "warning" : "inherit"} />
          </Tooltip>
        </ListItemIcon>
        <ListItemText sx={{ marginRight: "128px" }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Switch
              size="small"
              checked={active}
              onChange={(e) => onActiveChange(e.target.checked)}
              color="warning"
            />
            <Input
              disableUnderline
              inputProps={{
                sx: {
                  textAlign: "center",
                  width: "24px",
                },
              }}
              value={countString}
              onChange={(e) => {
                setCountString(e.target.value);
                const newCount = parseInt(e.target.value);
                if (!isNaN(newCount)) {
                  onCountChange(newCount);
                }
              }}
              onBlur={(e) => {
                const currentCount = parseInt(e.target.value);
                if (isNaN(currentCount) || currentCount < 1) {
                  onCountChange(1);
                  setCountString("1");
                }
              }}
            />
            <span style={{ fontSize: "0.8rem", color: "gray" }}>d4</span>
          </Stack>
        </ListItemText>
        <ListItemSecondaryAction>
          <Stack gap={1} direction="row">
            <IconButton
              aria-label="decrease bless"
              onClick={() => onDecrease()}
            >
              <DecreaseIcon />
            </IconButton>
            <IconButton
              aria-label="increase bless"
              onClick={() => onIncrease()}
            >
              <IncreaseIcon />
            </IconButton>
          </Stack>
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  );
}
