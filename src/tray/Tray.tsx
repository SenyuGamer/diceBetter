import { SquareTray } from "./SquareTray";
import { HexagonalTray } from "./HexagonalTray";
import { useDiceControlsStore } from "../controls/store";

export function Tray({ scale, shape: rollShape, ...props }: JSX.IntrinsicElements["group"] & { scale?: number, shape?: "SQUARE" | "HEXAGONAL" }) {
  const localShape = useDiceControlsStore(state => state.trayShape);
  const shape = rollShape || localShape;
  if (shape === "HEXAGONAL") {
    return <HexagonalTray scale={scale} {...props} />;
  }
  return <SquareTray scale={scale} {...props} />;
}
