import { Player } from "@owlbear-rodeo/sdk";

import { usePlayerDice } from "./usePlayerDice";
import { DiceRoll } from "../dice/DiceRoll";
import { CockedMarkersRenderer } from "../dice/CockedMarkers";

export function PlayerDiceRoll({ player, trayScale = 1 }: { player?: Player; trayScale?: number }) {
  const {
    diceRoll,
    rollThrows,
    rollCocked,
    finishedRollTransforms,
    finishedRolling,
    transformsRef,
  } = usePlayerDice(player);

  if (!diceRoll || !rollThrows || !finishedRollTransforms) {
    return null;
  }

  return (
    <>
      <DiceRoll
        roll={diceRoll}
        rollThrows={rollThrows}
        finishedTransforms={finishedRolling ? finishedRollTransforms : undefined}
        transformsRef={transformsRef}
        trayScale={trayScale}
      />
      {rollCocked && (
        <CockedMarkersRenderer rollCocked={rollCocked} rollTransforms={finishedRollTransforms} />
      )}
    </>
  );
}
