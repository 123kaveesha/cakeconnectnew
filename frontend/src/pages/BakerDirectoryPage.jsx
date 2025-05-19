import React, { useEffect, useState } from "react";
import { getAllBakers, deleteBakerById } from "../services/userService";
import { getUserFromToken, isAuthenticated } from "../utils/auth";
import "../styles/bakerDirectoryStyles.css";

const BakerDirectoryPage = () => {
  const [bakers, setBakers] = useState([]);
  const [selectedBaker, setSelectedBaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const user = getUserFromToken();
  const isAdmin = isAuthenticated() && user?.role === "admin";

  useEffect(() => {
    const fetchBakers = async () => {
      try {
        const data = await getAllBakers();
        setBakers(data);
      } catch (err) {
        setMessage("Failed to fetch bakers.");
      } finally {
        setLoading(false);
      }
    };
    fetchBakers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this baker?")) return;
    try {
      await deleteBakerById(id);
      setBakers((prev) => prev.filter((b) => b._id !== id));
      setMessage("Baker deleted successfully.");
    } catch (err) {
      setMessage("Failed to delete baker.");
    }
  };

  const filteredBakers =
    filter === "all" ? bakers : bakers.filter((b) => b.bakerType === filter);

  return (
    <div className="cakehub-baker-directory">
      <h2>Explore Our Bakers</h2>
      {message && <div className="cakehub-baker-message">{message}</div>}

      <div className="cakehub-baker-controls">
        <label>Filter by Type:</label>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All</option>
          <option value="baker">Baker</option>
          <option value="cakemaker">Cakemaker</option>
        </select>
      </div>

      {loading ? (
        <div className="cakehub-baker-spinner" />
      ) : (
        <div className="cakehub-baker-grid">
          {filteredBakers.map((baker) => (
            <div
              key={baker._id}
              className="cakehub-baker-card"
              onClick={() => setSelectedBaker(baker)}
            >
              <img src={baker.imageUrl} alt={baker.name} />
              <div>
                <h4>{baker.name}</h4>
                <p>{baker.bakerType}</p>
                <p>{baker.specialty}</p>
                <span>★ {baker.rating}</span>
              </div>
              {isAdmin && (
                <button
                  className="cakehub-delete-baker-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(baker._id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedBaker && (
        <div className="cakehub-baker-popup">
          <div className="cakehub-popup-inner">
            <button
              className="cakehub-close-btn"
              onClick={() => setSelectedBaker(null)}
            >
              ×
            </button>
            <div className="cakehub-popup-left">
              <img src={selectedBaker.imageUrl} alt={selectedBaker.name} />
              <h3>{selectedBaker.name}</h3>
              <p>
                <strong>Type:</strong> {selectedBaker.bakerType}
              </p>
              <p>
                <strong>Specialty:</strong> {selectedBaker.specialty}
              </p>
              <p>
                <strong>Location:</strong> {selectedBaker.location}
              </p>
              <p>
                <strong>Experience:</strong> {selectedBaker.experience}
              </p>
              <p>
                <strong>Rating:</strong> {selectedBaker.rating} ★
              </p>
            </div>
            <div className="cakehub-popup-right">
              <h4>Products</h4>
              {selectedBaker.products?.length > 0 ? (
                <ul className="cakehub-product-list">
                  {selectedBaker.products.map((prod) => (
                    <li key={prod._id}>
                      <img src={prod.imageUrl} alt={prod.name} />
                      <div>
                        <p>{prod.name}</p>
                        <span>LKR {prod.price.toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products listed.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BakerDirectoryPage;
