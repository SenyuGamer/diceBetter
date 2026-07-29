import { useEffect, useState } from "react";
import { getPluginId } from "./getPluginId";

const STORAGE_KEY = "simplify-3d-trays";

export function useSimplify3D() {
  const [simplify, setSimplify] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    let channel: BroadcastChannel | null = null;

    if (window.BroadcastChannel) {
      channel = new BroadcastChannel(getPluginId("simplify-sync"));
      
      channel.onmessage = (event) => {
        if (event.data && event.data.type === "STATE_UPDATE") {
          const newValue = Boolean(event.data.value);
          setSimplify(newValue);
          localStorage.setItem(STORAGE_KEY, newValue ? "true" : "false");
        } else if (event.data && event.data.type === "REQUEST_STATE") {
          // Send our current state back
          // We read from localStorage to be sure we send the latest committed state
          const currentVal = localStorage.getItem(STORAGE_KEY) === "true";
          channel?.postMessage({ type: "STATE_UPDATE", value: currentVal });
        }
      };

      // Request state from other frames just in case our localStorage is partitioned/outdated
      channel.postMessage({ type: "REQUEST_STATE" });
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setSimplify(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (channel) channel.close();
    };
  }, []);

  const toggleSimplify = () => {
    const newValue = !simplify;
    localStorage.setItem(STORAGE_KEY, newValue ? "true" : "false");
    setSimplify(newValue);
    
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel(getPluginId("simplify-sync"));
      channel.postMessage({ type: "STATE_UPDATE", value: newValue });
      channel.close();
    }
  };

  return { simplify, toggleSimplify };
}
