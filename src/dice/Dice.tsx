import React from "react";
import * as THREE from "three";
import { Die } from "../types/Die";

import { DiceMesh } from "../meshes/DiceMesh";
import { DiceMaterial } from "../materials/DiceMaterial";
import { useDiceRollStore } from "./store";

type DiceProps = JSX.IntrinsicElements["group"] & { die: Die };

export const Dice = React.forwardRef<THREE.Group, DiceProps>(
  ({ die, children, ...props }, ref) => {
    const isCocked = useDiceRollStore((state) => state.rollCocked[die.id]);

    return (
      <group>
        <DiceMesh
          diceType={die.type}
          {...props}
          sharp={die.style === "WALNUT"}
          ref={ref}
        >
          <DiceMaterial diceStyle={die.style} />
          {children}
        </DiceMesh>
      </group>
    );
  }
);
