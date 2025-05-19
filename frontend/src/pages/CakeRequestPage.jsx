import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllBakers } from "../services/userService";
import { sendCakeDesign } from "../services/cakeDesignService";
import "../styles/cakeRequestPageStyles.css";
import BackButton from "../components/BackButton";

// Reuse the same CakeLayer from designer
const CakeLayer = ({ position, radius, height, color }) => (
  <mesh position={position}>
    <cylinderGeometry args={[radius, radius, height, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const CakePreview = ({ layers }) => {
  let y = 0;
  let maxRadius = 0;
  const positionedLayers = layers.map((layer) => {
    const pos = [0, y + layer.height / 2, 0];
    y += layer.height;
    maxRadius = Math.max(maxRadius, layer.radius);
    return { ...layer, position: pos };
  });

  const totalHeight = y;
  const cameraY = totalHeight / 2 + 2;
  const cameraZ = Math.max(10, totalHeight * 1.2 + maxRadius * 2);

  return (
    <Canvas camera={{ position: [0, cameraY, cameraZ], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <OrbitControls autoRotate target={[0, totalHeight / 2, 0]} />
      {positionedLayers.map((layer, i) => (
        <CakeLayer key={i} {...layer} />
      ))}
    </Canvas>
  );
};

const CakeRequestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { layers, gltfBlob } = location.state || {};
  const [bakers, setBakers] = useState([]);
  const [selectedBaker, setSelectedBaker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadBakers = async () => {
      try {
        const res = await getAllBakers();
        const cakemakers = res.filter(
          (baker) => baker.bakerType === "cakemaker"
        );
        setBakers(cakemakers);
      } catch {
        alert("Failed to load bakers");
      }
    };
    loadBakers();
  }, []);

  const handleConfirm = async () => {
    if (!selectedBaker || !gltfBlob || !layers) {
      return alert("Missing required data");
    }

    setLoading(true);
    try {
      const file = new File([gltfBlob], `cake_${Date.now()}.gltf`, {
        type: "model/gltf+json",
      });

      await sendCakeDesign(selectedBaker, file, message);

      setConfirmMessage("Cake design sent successfully!");
      setTimeout(() => navigate("/cakedesign"), 3000);
    } catch (err) {
      alert("Failed to send cake design.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="cakehub-request-page">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        marginBottom: "20px",
      }}
    >
      <div style={{ flex: "0 0 auto" }}>
        <BackButton />
      </div>

      <h2
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          margin: 0,
        }}
      >
        Send Cake Design Request
      </h2>
    </div>

    <div className="cakehub-request-layout">
      <div className="cakehub-request-left">
        <h3>Preview</h3>
        <div className="cakehub-request-preview-box">
          {layers?.length > 0 ? (
            <CakePreview layers={layers} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>No design data to preview</p>
            </div>
          )}
        </div>
      </div>

      <div className="cakehub-request-right">
        <h3>Select a Baker</h3>
        <div className="cakehub-request-baker-selector">
          {bakers.map((baker) => (
            <div
              key={baker._id}
              className={`cakehub-request-baker-card ${
                selectedBaker === baker._id ? "selected" : ""
              }`}
              onClick={() => setSelectedBaker(baker._id)}
            >
              <img
                src={baker.imageUrl || "/images/default-baker.jpg"}
                alt={baker.name}
              />
              <h4>{baker.name}</h4>
              <p>{baker.specialty}</p>
            </div>
          ))}
        </div>

        <div className="cakehub-request-message-box">
          <label>Message to Baker (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Any custom instructions..."
          />
        </div>

        <button onClick={handleConfirm} disabled={!selectedBaker || loading}>
          {loading ? "Submitting..." : "Confirm & Submit"}
        </button>

        {confirmMessage && <p className="cakehub-request-success">{confirmMessage}</p>}
      </div>
    </div>
  </div>
);
};

export default CakeRequestPage;
