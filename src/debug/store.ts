import create from "zustand";

interface DebugState {
  allowOrbit: boolean;
  allowPhysicsDebug: boolean;
  photoStudioEnabled: boolean;
  togglePhotoStudio: () => void;
}

export const useDebugStore = create<DebugState>()((set) => ({
  allowOrbit: false,
  allowPhysicsDebug: false,
  photoStudioEnabled: false,
  togglePhotoStudio: () => set((state) => ({ photoStudioEnabled: !state.photoStudioEnabled })),
}));

function onKeyDown(event: KeyboardEvent) {
  if (event.altKey && event.ctrlKey && event.shiftKey) {
    if (event.code === "KeyD") {
      useDebugStore.setState((state) => ({
        ...state,
        allowPhysicsDebug: !state.allowPhysicsDebug,
      }));
    } else if (event.code === "KeyC") {
      useDebugStore.setState((state) => ({
        ...state,
        allowOrbit: !state.allowOrbit,
      }));
    }
  }
}

document.body.addEventListener("keydown", onKeyDown);
