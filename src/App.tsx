import { useState } from "react";
import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { QuickRollPanel } from "./controls/QuickRollPanel";
import { Beyond20Listener } from "./plugin/Beyond20Listener";
import { PhotoStudio } from "./debug/PhotoStudio";
import { useDebugStore } from "./debug/store";

export function App() {
  const [showStudio, setShowStudio] = useState(false);
  const photoStudioEnabled = useDebugStore((state) => state.photoStudioEnabled);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Beyond20Listener />
      {/* 3D Tray spans the entire screen in the background */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <InteractiveTray />
      </div>
      
      {/* Left Sidebar - Completely transparent */}
      <div style={{ 
        position: "absolute", top: 0, left: 0, height: "100%", zIndex: 10
      }}>
        <Sidebar />
      </div>

      {/* Right Quick Rolls - Completely transparent */}
      <div style={{ 
        position: "absolute", top: 0, right: 0, height: "100%", zIndex: 10
      }}>
        <QuickRollPanel />
      </div>

      {photoStudioEnabled && (
        <button
          onClick={() => setShowStudio(true)}
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            padding: "8px 16px",
            background: "#1e1e1e",
            color: "white",
            border: "1px solid #333",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📷 Photo Studio
        </button>
      )}

      {showStudio && <PhotoStudio onClose={() => setShowStudio(false)} />}
    </div>
  );
}

