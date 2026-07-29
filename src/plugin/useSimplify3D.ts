import { useEffect, useState } from "react";
import { getPluginId } from "./getPluginId";

const STORAGE_KEY = "simplify-3d-trays";

export function useSimplify3D() {
  const [simplify, setSimplify] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    const handleStorage = () => {
      setSimplify(localStorage.getItem(STORAGE_KEY) === "true");
    };
    
    // Listen to storage events from other frames/tabs on same domain
    window.addEventListener("storage", handleStorage);
    
    // Also set up a BroadcastChannel for immediate sync in case storage event is delayed or blocked
    let channel: BroadcastChannel | null = null;
    if (window.BroadcastChannel) {
      channel = new BroadcastChannel(getPluginId("simplify-sync"));
      channel.onmessage = (event) => {
        if (event.data === "sync") {
          handleStorage();
        }
      };
    }

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
      channel.postMessage("sync");
      channel.close();
    }
  };

  return { simplify, toggleSimplify };
}
