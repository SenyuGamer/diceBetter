import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import { diceSets } from "../sets/diceSets";
import { useDiceControlsStore } from "./store";

const PreviewImage = styled("img", {
  shouldForwardProp: (prop) => prop !== "isAll",
})<{ isAll?: boolean }>(({ isAll }) => ({
  width: "56px",
  height: "56px",
  transform: isAll ? "none" : "scale(1.5)",
}));

export function DiceSetPicker() {
  const diceSet = useDiceControlsStore((state) => state.diceSet);
  const changeDiceSet = useDiceControlsStore((state) => state.changeDiceSet);

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
      <IconButton
        aria-label="change dice set"
        id="dice-set-button"
        aria-controls={open ? "dice-set-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          padding: "4px",
          backgroundColor: "rgba(255, 255, 255, 0.16) !important",
        }}
      >
        <PreviewImage src={diceSet.previewImage} isAll={diceSet.id === "all"} />
      </IconButton>
      <Menu
        id="dice-set-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "dice-set-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ my: 1 }}
        marginThreshold={0}
      >
        <Stack gap={1} alignItems="center" p="2px">
          {diceSets.map((set) => (
            <Tooltip key={set.id} title={set.name} placement="right">
              <IconButton
                aria-label={set.name}
                onClick={() => {
                  changeDiceSet(set);
                  handleClose();
                }}
                sx={{
                  padding: "2px",
                  backgroundColor:
                    diceSet.id === set.id
                      ? "rgba(255, 255, 255, 0.16) !important"
                      : undefined,
                }}
              >
                <PreviewImage src={set.previewImage} isAll={set.id === "all"} />
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Menu>
    </>
  );
}
