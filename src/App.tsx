
import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { QuickRollPanel } from "./controls/QuickRollPanel";



export function App() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 3D Tray spans the entire screen in the background */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <InteractiveTray />
      </div>
      
      {/* Left Sidebar - Floating with glassmorphism */}
      <div style={{ 
        position: "absolute", top: 0, left: 0, height: "100%", zIndex: 10,
        backgroundColor: "rgba(30, 34, 49, 0.7)",
        backdropFilter: "blur(8px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <Sidebar />
      </div>

      {/* Right Quick Rolls - Floating with glassmorphism */}
      <div style={{ 
        position: "absolute", top: 0, right: 0, height: "100%", zIndex: 10,
        backgroundColor: "rgba(30, 34, 49, 0.7)",
        backdropFilter: "blur(8px)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <QuickRollPanel />
      </div>
    </div>
  );
}

