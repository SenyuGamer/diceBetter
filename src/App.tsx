import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { QuickRollPanel } from "./controls/QuickRollPanel";


export function App() {
  return (
    <Container disableGutters maxWidth="md">
      <Stack direction="row" justifyContent="center" gap={1}>
        <Sidebar />
        <InteractiveTray />
        <QuickRollPanel />
      </Stack>
    </Container>
  );
}

