import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useLocation, useNavigate } from "react-router-dom";
import { GLTFExporter } from "three-stdlib";
import * as THREE from "three";
import "../styles/cakeDesignerPageStyles.css";
import cakeTemplates from "../utils/cakeTemplates";

const CakeLayer = ({ position, radius, height, color }) => (
  <mesh position={position}>
    <cylinderGeometry args={[radius, radius, height, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const Label = ({ text, y }) => (
  <Text position={[0, y + 0.8, 0]} fontSize={0.5} color="#000">
    {text}
  </Text>
);

const CakePreview = ({ layers, label }) => {
  let y = 0;
  const positionedLayers = layers.map((layer) => {
    const pos = [0, y + layer.height / 2, 0];
    y += layer.height;
    return { ...layer, position: pos };
  });

  const cakeYOffset = -3;

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} />
      <OrbitControls />

      {positionedLayers.length > 0 ? (
        <group position={[0, cakeYOffset, 0]}>
          {positionedLayers.map((layer, i) => (
            <CakeLayer key={i} {...layer} />
          ))}
          {label && (
            <Text position={[0, y + 0.8, 0]} fontSize={0.5} color="#000">
              {label}
            </Text>
          )}
        </group>
      ) : (
        <Text position={[0, 1, 0]} fontSize={0.5} color="#888">
          Start designing your cake!
        </Text>
      )}
    </Canvas>
  );
};

const CakeDesigner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [layers, setLayers] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [selected, setSelected] = useState(null);
  const [label, setLabel] = useState("");

  const [layerProps, setLayerProps] = useState({
    radius: 2,
    height: 1,
    color: "#f7c59f",
  });

  useEffect(() => {
    const presetId = location.state?.templateId;
    if (presetId) {
      const selectedTemplate = cakeTemplates.find((t) => t.id === presetId);
      if (selectedTemplate) {
        setLayers(selectedTemplate.layers);
      }
    }
  }, [location]);

  const pushToHistory = () => {
    setHistory([...history, [...layers]]);
    setFuture([]);
  };

  const handlePlaceOrder = () => {
    const scene = new THREE.Scene();
    let y = 0;
    layers.forEach((layer) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          layer.radius,
          layer.radius,
          layer.height,
          32
        ),
        new THREE.MeshStandardMaterial({ color: layer.color })
      );
      mesh.position.set(0, y + layer.height / 2, 0);
      y += layer.height;
      scene.add(mesh);
    });

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => {
        const blob = new Blob([JSON.stringify(result)], {
          type: "application/json",
        });
        navigate("/cake-request", {
          state: { layers, gltfBlob: blob },
        });
      },
      { binary: false }
    );
  };

  const addLayer = () => {
    pushToHistory();
    setLayers((prev) => [...prev, { ...layerProps }]);
  };

  const selectLayer = (index) => {
    setSelected(index);
    const selectedLayer = layers[index];
    if (selectedLayer) {
      setLayerProps({
        radius: selectedLayer.radius,
        height: selectedLayer.height,
        color: selectedLayer.color,
      });
    }
  };

  const updateLayer = () => {
    if (selected === null) return;
    pushToHistory();
    const updated = layers.map((l, i) =>
      i === selected ? { ...l, ...layerProps } : l
    );
    setLayers(updated);
  };

  const clearCake = () => {
    pushToHistory();
    setLayers([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture([layers, ...future]);
    setLayers(prev);
    setHistory(history.slice(0, -1));
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory([...history, layers]);
    setLayers(next);
    setFuture(future.slice(1));
  };

  const handleExport = () => {
    const scene = new THREE.Scene();
    let y = 0;
    layers.forEach((layer) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          layer.radius,
          layer.radius,
          layer.height,
          32
        ),
        new THREE.MeshStandardMaterial({ color: layer.color })
      );
      mesh.position.set(0, y + layer.height / 2, 0);
      y += layer.height;
      scene.add(mesh);
    });

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => {
        const blob = new Blob([JSON.stringify(result)], {
          type: "application/json",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "cake_design.gltf";
        link.click();
      },
      { binary: false }
    );
  };

  return (
    <div className="cake-designer-wrapper">
      <h1 className="cake-designer-title">Cake Designer</h1>
      <div className="cake-designer-body">
        <div className="cake-designer-preview">
          <CakePreview layers={layers} label={label} />
        </div>

        <div className="cake-designer-controls">
          <div className="cake-designer-buttons-row">
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
          </div>

          <h3>Presets</h3>
          <div className="cake-designer-presets">
            {cakeTemplates.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setLayers(preset.layers)}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <h3>Add/Edit Layer</h3>
          <label>Radius</label>
          <input
            type="number"
            min="0"
            value={layerProps.radius}
            onChange={(e) =>
              setLayerProps({
                ...layerProps,
                radius: parseFloat(e.target.value),
              })
            }
          />

          <label>Height</label>
          <input
            type="number"
            min="0"
            value={layerProps.height}
            onChange={(e) =>
              setLayerProps({
                ...layerProps,
                height: parseFloat(e.target.value),
              })
            }
          />

          <label>Color</label>
          <input
            type="color"
            value={layerProps.color}
            onChange={(e) =>
              setLayerProps({ ...layerProps, color: e.target.value })
            }
          />

          <div className="cake-designer-buttons-row">
            <button onClick={addLayer}>Add Layer</button>
            <button onClick={updateLayer} disabled={selected === null}>
              Update Layer
            </button>
            <button onClick={clearCake}>Clear</button>
            <button onClick={handleExport}>Export</button>
          </div>

          <h3>Text Label</h3>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Add a text to cake"
          />

          <h3>Select Layer to Edit</h3>
          <select
            value={selected ?? ""}
            onChange={(e) => selectLayer(Number(e.target.value))}
          >
            <option value="">Select Layer</option>
            {layers.map((_, i) => (
              <option key={i} value={i}>
                Layer {i + 1}
              </option>
            ))}
          </select>

          <button
            onClick={handlePlaceOrder}
            className="cake-designer-submit-btn"
          >
            Place Cake Design Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CakeDesigner;
