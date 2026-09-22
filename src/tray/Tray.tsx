import { HexagonalTray } from "./HexagonalTray";

export function Tray(props: JSX.IntrinsicElements["group"] & { scale?: number }) {
  return <HexagonalTray {...props} />;
}
