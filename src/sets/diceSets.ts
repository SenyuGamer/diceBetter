import { DiceSet } from "../types/DiceSet";
import { DiceStyle } from "../types/DiceStyle";
import { Die } from "../types/Die";

import * as galaxyPreviews from "../previews/galaxy";
import * as gemstonePreviews from "../previews/gemstone";
import * as glassPreviews from "../previews/glass";
import * as ironPreviews from "../previews/iron";
import * as nebulaPreviews from "../previews/nebula";
import * as sunrisePreviews from "../previews/sunrise";
import * as sunsetPreviews from "../previews/sunset";
import * as walnutPreviews from "../previews/walnut";
import * as magmaPreviews from "../previews/magma";
import * as plasmaPreviews from "../previews/plasma";

import allPreview from "../previews/all.png";

const baseColors: Record<DiceStyle, string> = {
  GALAXY: "#130526",
  GEMSTONE: "#222222",
  GLASS: "#222222",
  IRON: "#252525",
  NEBULA: "#21162d",
  SUNRISE: "#3c2130",
  SUNSET: "#2a1533",
  WALNUT: "#251711",
  MAGMA: "#220000",
  PLASMA: "#001133",
};

const standardPreviews: Record<DiceStyle, string> = {
  GALAXY: galaxyPreviews.D20,
  GEMSTONE: gemstonePreviews.D20,
  GLASS: glassPreviews.D20,
  IRON: ironPreviews.D20,
  NEBULA: nebulaPreviews.D20,
  SUNRISE: sunrisePreviews.D20,
  SUNSET: sunsetPreviews.D20,
  WALNUT: walnutPreviews.D20,
  MAGMA: magmaPreviews.D20,
  PLASMA: plasmaPreviews.D20,
};

function createStandardSet(style: DiceStyle): DiceSet {
  const id = `${style}_STANDARD`;
  return {
    id,
    name: `${style.toLowerCase()} dice`,
    dice: [
      { id: `${id}_D4`, type: "D4", style },
      { id: `${id}_D6`, type: "D6", style },
      { id: `${id}_D8`, type: "D8", style },
      { id: `${id}_D10`, type: "D10", style },
      { id: `${id}_D12`, type: "D12", style },
      { id: `${id}_D20`, type: "D20", style },
      { id: `${id}_D100`, type: "D100", style },
    ],
    previewImage: standardPreviews[style],
  };
}

const standardSets = [
  createStandardSet("GALAXY"),
  createStandardSet("GEMSTONE"),
  createStandardSet("GLASS"),
  createStandardSet("IRON"),
  createStandardSet("NEBULA"),
  createStandardSet("SUNRISE"),
  createStandardSet("SUNSET"),
  createStandardSet("WALNUT"),
  createStandardSet("MAGMA"),
  createStandardSet("PLASMA"),
];

const allSet: DiceSet = {
  id: "all",
  name: "all",
  dice: standardSets.reduce(
    (prev, curr) => [...prev, ...curr.dice],
    [] as Die[]
  ),
  previewImage: allPreview,
};

export const diceSets: DiceSet[] = [...standardSets, allSet];
