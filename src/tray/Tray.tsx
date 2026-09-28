import { SquareTray } from "./SquareTray";
import { HexagonalTray } from "./HexagonalTray";
import { useDiceControlsStore } from "../controls/store";

export function Tray(props: JSX.IntrinsicElements["group"] & { scale?: number }) {
  const shape = useDiceControlsStore(state => state.trayShape);
  if (shape === "HEXAGONAL") {
    return <HexagonalTray {...props} />;
  }
  return <SquareTray {...props} />;
}
