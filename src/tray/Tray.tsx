import { SquareTray } from "./SquareTray";

export function Tray(props: JSX.IntrinsicElements["group"] & { scale?: number }) {
  return <SquareTray {...props} />;
}
