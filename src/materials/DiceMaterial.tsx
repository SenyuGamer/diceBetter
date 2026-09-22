import { DiceStyle } from "../types/DiceStyle";
import { GalaxyMaterial } from "./galaxy/GalaxyMaterial";
import { GemstoneMaterial } from "./gemstone/GemstoneMaterial";
import { GlassMaterial } from "./glass/GlassMaterial";
import { IronMaterial } from "./iron/IronMaterial";
import { NebulaMaterial } from "./nebula/NebulaMaterial";
import { SunriseMaterial } from "./sunrise/SunriseMaterial";
import { SunsetMaterial } from "./sunset/SunsetMaterial";
import { WalnutMaterial } from "./walnut/WalnutMaterial";
import { MagmaMaterial } from "./magma/MagmaMaterial";
import { PlasmaMaterial } from "./plasma/PlasmaMaterial";
import { useDiceControlsStore } from "../controls/store";

export function DiceMaterial({ diceStyle }: { diceStyle: DiceStyle }) {
  const simplify = useDiceControlsStore((state) => state.simplify3D);

  switch (diceStyle) {
    case "GALAXY":
      return <GalaxyMaterial simplify={simplify} />;
    case "GEMSTONE":
      return <GemstoneMaterial simplify={simplify} />;
    case "GLASS":
      return <GlassMaterial simplify={simplify} />;
    case "IRON":
      return <IronMaterial simplify={simplify} />;
    case "NEBULA":
      return <NebulaMaterial simplify={simplify} />;
    case "SUNRISE":
      return <SunriseMaterial simplify={simplify} />;
    case "SUNSET":
      return <SunsetMaterial simplify={simplify} />;
    case "WALNUT":
      return <WalnutMaterial simplify={simplify} />;
    case "MAGMA":
      return <MagmaMaterial simplify={simplify} />;
    case "PLASMA":
      return <PlasmaMaterial simplify={simplify} />;
    default:
      return <GalaxyMaterial simplify={simplify} />;
  }
}

