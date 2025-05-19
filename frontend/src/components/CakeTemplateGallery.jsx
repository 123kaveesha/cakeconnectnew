import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cakeTemplateGalleryStyles.css";
import cakeTemplates from "../utils/cakeTemplates";

const CakeLayer = ({ position, radius, height, color }) => (
  <mesh position={position}>
    <cylinderGeometry args={[radius, radius, height, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const CakePreview = ({ layers }) => {
  let y = 0;
  const positionedLayers = layers.map((layer) => {
    const pos = [0, y + layer.height / 2, 0];
    y += layer.height;
    return { ...layer, position: pos };
  });

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} />
      <OrbitControls autoRotate enableZoom={false} enablePan={false} />
      {positionedLayers.map((layer, i) => (
        <CakeLayer key={i} {...layer} />
      ))}
    </Canvas>
  );
};

const CakeTemplateGallery = () => {
  const navigate = useNavigate();

  const handleSelect = (templateId) => {
  navigate("/cakedesign", {
    state: { templateId },
  });
};

  return (
    <section className="popular-cakes">
      <div className="container">
        <h2>Popular Cake Templates</h2>
        <div className="cakes-grid">
          {cakeTemplates.map((template) => (
            <div className="cake-card" key={template.id}>
              <div className="cake-3d">
                <CakePreview layers={template.layers} />
              </div>
              <div className="cake-info">
                <h3>{template.name}</h3>
                <div className="rating">
                  {"★".repeat(Math.floor(template.rating))}
                  {"☆".repeat(5 - Math.floor(template.rating))}
                  <span>({template.rating.toFixed(1)})</span>
                </div>
                <button
                  onClick={() => handleSelect(template.id)}
                  className="customize-btn"
                >
                  Customize This
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CakeTemplateGallery;