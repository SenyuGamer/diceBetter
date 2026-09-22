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

  const envInt = 0.4; // Disminuye el brillo y reflejo

  switch (diceStyle) {
    case "GALAXY":
      return <GalaxyMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "GEMSTONE":
      return <GemstoneMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "GLASS":
      return <GlassMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "IRON":
      return <IronMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "NEBULA":
      return <NebulaMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "SUNRISE":
      return <SunriseMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "SUNSET":
      return <SunsetMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "WALNUT":
      return <WalnutMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "MAGMA":
      return <MagmaMaterial simplify={simplify} envMapIntensity={envInt} />;
    case "PLASMA":
      return <PlasmaMaterial simplify={simplify} envMapIntensity={envInt} />;
    default:
      return <GalaxyMaterial simplify={simplify} envMapIntensity={envInt} />;
  }
}

