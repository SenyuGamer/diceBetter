import { useState } from "react";
import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { QuickRollPanel } from "./controls/QuickRollPanel";
import { Beyond20Listener } from "./plugin/Beyond20Listener";
import { PhotoStudio } from "./debug/PhotoStudio";

export function App() {
  const [showStudio, setShowStudio] = useState(false);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Beyond20Listener />
      {/* 3D Tray spans the entire screen in the background */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <InteractiveTray />
      </div>
      
      {/* Left Sidebar - Floating with glassmorphism */}
      <div style={{ 
        position: "absolute", top: 0, left: 0, height: "100%", zIndex: 10,
        backgroundColor: "rgba(30, 34, 49, 0.1)",
        backdropFilter: "blur(8px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <Sidebar />
      </div>

      {/* Right Quick Rolls - Floating with glassmorphism */}
      <div style={{ 
        position: "absolute", top: 0, right: 0, height: "100%", zIndex: 10,
        backgroundColor: "rgba(30, 34, 49, 0.1)",
        backdropFilter: "blur(8px)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <QuickRollPanel />
      </div>

      {import.meta.env.DEV && (
        <button
          onClick={() => setShowStudio(true)}
          style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", zIndex: 999 }}
        >
          📷 Photo Studio
        </button>
      )}

      {showStudio && <PhotoStudio onClose={() => setShowStudio(false)} />}
    </div>
  );
}

