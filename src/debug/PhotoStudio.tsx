import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import JSZip from "jszip";
import { Environment } from "@react-three/drei";

import { DiceStyle } from "../types/DiceStyle";
import { DiceType } from "../types/DiceType";
import { DiceMesh } from "../meshes/DiceMesh";
import { DiceMaterial } from "../materials/DiceMaterial";
import envHdr from "../environment.hdr?url";

const STYLES: DiceStyle[] = [
  "GALAXY", "GEMSTONE", "GLASS", "IRON", "NEBULA", "SUNRISE", "SUNSET", "WALNUT", "MAGMA"
];
const TYPES: DiceType[] = ["D4", "D6", "D8", "D10", "D12", "D20", "D100"];

type CaptureState = {
  styleIdx: number;
  typeIdx: number;
  done: boolean;
};

// Component that renders the die and captures it
function StudioCapture({
  diceStyle,
  diceType,
  onCapture,
}: {
  diceStyle: DiceStyle;
  diceType: DiceType;
  onCapture: (dataUrl: string) => void;
}) {
  const { gl, scene, camera } = useThree();
  const frameCount = useRef(0);

  // We wait a few frames to ensure the GLTF and textures are loaded and rendered
  useFrame(() => {
    frameCount.current++;
    if (frameCount.current === 10) {
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL("image/png");
      onCapture(dataUrl);
    }
  });

  return (
    <>
      <Environment files={envHdr} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <group scale={3}>
        <DiceMesh diceType={diceType} sharp={diceStyle === "WALNUT"}>
          <DiceMaterial diceStyle={diceStyle} />
        </DiceMesh>
      </group>
    </>
  );
}

export function PhotoStudio({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<CaptureState>({
    styleIdx: 0,
    typeIdx: 0,
    done: false,
  });
  const [zip] = useState(() => new JSZip());
  const [capturing, setCapturing] = useState(false);

  const startCapture = () => {
    setCapturing(true);
  };

  const handleCapture = (dataUrl: string) => {
    const style = STYLES[state.styleIdx];
    const type = TYPES[state.typeIdx];
    
    // Remove data:image/png;base64,
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    const folder = zip.folder(style.toLowerCase());
    folder?.file(`${type.toLowerCase()}.png`, base64Data, { base64: true });

    // Next
    let nextTypeIdx = state.typeIdx + 1;
    let nextStyleIdx = state.styleIdx;
    if (nextTypeIdx >= TYPES.length) {
      nextTypeIdx = 0;
      nextStyleIdx++;
    }

    if (nextStyleIdx >= STYLES.length) {
      setState({ styleIdx: 0, typeIdx: 0, done: true });
      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dice_previews.zip";
        a.click();
        URL.revokeObjectURL(url);
        onClose();
      });
    } else {
      // Small timeout to allow state flush and unmount
      setTimeout(() => {
        setState({ styleIdx: nextStyleIdx, typeIdx: nextTypeIdx, done: false });
      }, 100);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <h2>Dice Photo Studio</h2>
      
      {!capturing && !state.done && (
        <button onClick={startCapture} style={{ padding: "10px 20px", fontSize: "1.2rem", cursor: "pointer" }}>
          Start Capture (Will download ZIP)
        </button>
      )}

      {capturing && !state.done && (
        <>
          <p>
            Capturing: {STYLES[state.styleIdx]} {TYPES[state.typeIdx]}
          </p>
          <div style={{ width: 256, height: 256, border: "2px solid white", overflow: "hidden" }}>
            <Canvas
              key={`${state.styleIdx}-${state.typeIdx}`}
              gl={{ preserveDrawingBuffer: true, alpha: true }}
              camera={{ position: [0, 0, 5], fov: 40 }}
            >
              <StudioCapture
                diceStyle={STYLES[state.styleIdx]}
                diceType={TYPES[state.typeIdx]}
                onCapture={handleCapture}
              />
            </Canvas>
          </div>
        </>
      )}

      {state.done && <p>Done! ZIP downloading...</p>}
      
      <button onClick={onClose} style={{ marginTop: 20 }}>Close</button>
    </div>
  );
}
