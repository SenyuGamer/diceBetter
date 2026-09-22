import { styled } from "@mui/material/styles";

import { DiceStyle } from "../types/DiceStyle";
import { DiceType } from "../types/DiceType";

import * as galaxyPreviews from "./galaxy";
import * as gemstonePreviews from "./gemstone";
import * as glassPreviews from "./glass";
import * as ironPreviews from "./iron";
import * as nebulaPreviews from "./nebula";
import * as sunrisePreviews from "./sunrise";
import * as sunsetPreviews from "./sunset";
import * as walnutPreviews from "./walnut";
import * as magmaPreviews from "./magma";
import * as plasmaPreviews from "./plasma";

const previews: Record<DiceStyle, Record<DiceType, string>> = {
  GALAXY: galaxyPreviews,
  GEMSTONE: gemstonePreviews,
  GLASS: glassPreviews,
  IRON: ironPreviews,
  NEBULA: nebulaPreviews,
  SUNRISE: sunrisePreviews,
  SUNSET: sunsetPreviews,
  WALNUT: walnutPreviews,
  MAGMA: magmaPreviews,
  PLASMA: plasmaPreviews,
};

interface PreviewImageProps {
  size?: "small" | "medium" | "large";
}

const PreviewImage = styled("img", {
  shouldForwardProp: (prop) => prop !== "size",
})<PreviewImageProps>(({ size }) => ({
  width: size === "small" ? "32px" : size === "medium" ? "42px" : "52px",
  height: size === "small" ? "32px" : size === "medium" ? "42px" : "52px",
  transform: "scale(1.5)",
}));

type DiePreviewProps = {
  diceType: DiceType;
  diceStyle: DiceStyle;
  size?: "small" | "medium" | "large";
};

export function DicePreview({ diceType, diceStyle, size }: DiePreviewProps) {
  const safeStyle = previews[diceStyle] ? diceStyle : "GALAXY";
  return (
    <PreviewImage
      src={previews[safeStyle][diceType]}
      alt={`${safeStyle} ${diceType} preview`}
      size={size}
    />
  );
}
