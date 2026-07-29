import { useEffect, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "./getPluginId";

const METADATA_KEY = getPluginId("simplify3d");

export function useSimplify3D() {
  const [simplify, setSimplify] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (OBR.isAvailable) {
      OBR.onReady(() => {
        // Read initial state from player metadata
        OBR.player.getMetadata().then((metadata) => {
          if (typeof metadata[METADATA_KEY] === "boolean") {
            setSimplify(metadata[METADATA_KEY] as boolean);
          }
        });

        // Listen for changes across all local iframes
        unsubscribe = OBR.player.onChange((player) => {
          if (player && player.metadata && typeof player.metadata[METADATA_KEY] === "boolean") {
            setSimplify(player.metadata[METADATA_KEY] as boolean);
          }
        });
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const toggleSimplify = () => {
    const newValue = !simplify;
    setSimplify(newValue);
    
    if (OBR.isAvailable) {
      OBR.onReady(() => {
        OBR.player.setMetadata({ [METADATA_KEY]: newValue });
      });
    }
  };

  return { simplify, toggleSimplify };
}
