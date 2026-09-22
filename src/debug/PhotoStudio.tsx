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
  "GALAXY", "GEMSTONE", "GLASS", "IRON", "NEBULA", "SUNRISE", "SUNSET", "WALNUT", "MAGMA", "PLASMA"
];
const TYPES: DiceType[] = ["D4", "D6", "D8", "D10", "D12", "D20", "D100"];

type RotationState = {
  tiltX: number;
  spinY: number;
  rollZ: number;
};

const DEFAULT_ROTATIONS: Record<DiceType, RotationState> = {
  D4: { tiltX: Math.PI / 2.5, spinY: 0, rollZ: -Math.PI / 2 },
  D6: { tiltX: Math.PI / 2, spinY: 0, rollZ: -Math.PI / 2 },
  D8: { tiltX: Math.PI / 2.5, spinY: Math.PI / 2, rollZ: -Math.PI / 2 },
  D10: { tiltX: 1.1, spinY: (Math.PI * 2) / 5 * 2, rollZ: -Math.PI / 2 },
  D12: { tiltX: Math.PI / 2, spinY: 0, rollZ: -Math.PI / 2 },
  D20: { tiltX: Math.PI / 2.2, spinY: 0, rollZ: -Math.PI / 2 },
  D100: { tiltX: 1.1, spinY: (Math.PI * 2) / 5 * 2, rollZ: -Math.PI / 2 },
};

function LivePreview({ diceType, rotation }: { diceType: DiceType, rotation: RotationState }) {
  return (
    <>
      <Environment files={envHdr} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <group scale={6.5} rotation={[0, 0, rotation.rollZ]}>
        <group rotation={[rotation.tiltX, 0, 0]}>
          <group rotation={[0, rotation.spinY, 0]}>
            <DiceMesh diceType={diceType} sharp={false}>
              <DiceMaterial diceStyle={"GALAXY"} />
            </DiceMesh>
          </group>
        </group>
      </group>
    </>
  );
}

function StudioCapture({
  diceStyle,
  diceType,
  rotation,
  onCapture,
}: {
  diceStyle: DiceStyle;
  diceType: DiceType;
  rotation: RotationState;
  onCapture: (dataUrl: string) => void;
}) {
  const { gl, scene, camera } = useThree();
  const frameCount = useRef(0);

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
      <group scale={6.5} rotation={[0, 0, rotation.rollZ]}>
        <group rotation={[rotation.tiltX, 0, 0]}>
          <group rotation={[0, rotation.spinY, 0]}>
            <DiceMesh diceType={diceType} sharp={diceStyle === "WALNUT"}>
              <DiceMaterial diceStyle={diceStyle} />
            </DiceMesh>
          </group>
        </group>
      </group>
    </>
  );
}

export function PhotoStudio({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"calibrate" | "capture" | "done">("calibrate");
  const [calibIdx, setCalibIdx] = useState(0);
  const [calibrations, setCalibrations] = useState<Record<DiceType, RotationState>>(DEFAULT_ROTATIONS);

  const [capState, setCapState] = useState({ styleIdx: 0, typeIdx: 0 });
  const [zip] = useState(() => new JSZip());

  const currentType = TYPES[calibIdx];
  const currentRot = calibrations[currentType];

  const updateRot = (key: keyof RotationState, val: number) => {
    setCalibrations(prev => ({
      ...prev,
      [currentType]: { ...prev[currentType], [key]: val }
    }));
  };

  const nextCalib = () => {
    if (calibIdx < TYPES.length - 1) {
      setCalibIdx(calibIdx + 1);
    } else {
      setMode("capture");
    }
  };

  const handleCapture = (dataUrl: string) => {
    const style = STYLES[capState.styleIdx];
    const type = TYPES[capState.typeIdx];
    
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    const folder = zip.folder(style.toLowerCase());
    folder?.file(`${type.toLowerCase()}.png`, base64Data, { base64: true });

    let nextTypeIdx = capState.typeIdx + 1;
    let nextStyleIdx = capState.styleIdx;
    if (nextTypeIdx >= TYPES.length) {
      nextTypeIdx = 0;
      nextStyleIdx++;
    }

    if (nextStyleIdx >= STYLES.length) {
      setMode("done");
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
      setTimeout(() => {
        setCapState({ styleIdx: nextStyleIdx, typeIdx: nextTypeIdx });
      }, 100);
    }
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.95)", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", color: "white", fontFamily: "sans-serif"
      }}
    >
      {mode === "calibrate" && (
        <>
          <h2>Calibrate: {currentType}</h2>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div style={{ width: 300, height: 300, border: "2px solid white", backgroundColor: "#222" }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ alpha: true }}>
                <LivePreview diceType={currentType} rotation={currentRot} />
              </Canvas>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", justifyContent: "center" }}>
              <label>
                <div>Spin (Y) - Gira el dado: {(currentRot.spinY * (180/Math.PI)).toFixed(0)}°</div>
                <input type="range" min={-Math.PI} max={Math.PI} step={0.05} value={currentRot.spinY} onChange={e => updateRot("spinY", parseFloat(e.target.value))} style={{width: 200}}/>
              </label>
              <label>
                <div>Tilt (X) - Inclina hacia la camara: {(currentRot.tiltX * (180/Math.PI)).toFixed(0)}°</div>
                <input type="range" min={-Math.PI} max={Math.PI} step={0.05} value={currentRot.tiltX} onChange={e => updateRot("tiltX", parseFloat(e.target.value))} style={{width: 200}}/>
              </label>
              <label>
                <div>Roll (Z) - Endereza el numero: {(currentRot.rollZ * (180/Math.PI)).toFixed(0)}°</div>
                <input type="range" min={-Math.PI} max={Math.PI} step={0.05} value={currentRot.rollZ} onChange={e => updateRot("rollZ", parseFloat(e.target.value))} style={{width: 200}}/>
              </label>
              <button onClick={nextCalib} style={{ padding: "10px", marginTop: "10px", cursor: "pointer", fontSize: "1.2rem" }}>
                {calibIdx < TYPES.length - 1 ? "Next Die" : "Start Capture All"}
              </button>
            </div>
          </div>
        </>
      )}

      {mode === "capture" && (
        <>
          <h2>Capturing: {STYLES[capState.styleIdx]} {TYPES[capState.typeIdx]}</h2>
          <div style={{ width: 256, height: 256, border: "2px solid white", overflow: "hidden" }}>
            <Canvas key={`${capState.styleIdx}-${capState.typeIdx}`} gl={{ preserveDrawingBuffer: true, alpha: true }} camera={{ position: [0, 0, 5], fov: 40 }}>
              <StudioCapture
                diceStyle={STYLES[capState.styleIdx]}
                diceType={TYPES[capState.typeIdx]}
                rotation={calibrations[TYPES[capState.typeIdx]]}
                onCapture={handleCapture}
              />
            </Canvas>
          </div>
        </>
      )}

      {mode === "done" && <h2>Done! ZIP downloading...</h2>}
      
      <button onClick={onClose} style={{ marginTop: 20 }}>Close / Cancel</button>
    </div>
  );
}
