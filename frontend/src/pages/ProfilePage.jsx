import React, { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../services/userService";
import { getUserFromToken } from "../utils/auth";
import "../styles/profilePageStyles.css";

const ProfilePage = () => {
  const user = getUserFromToken();
  const isBaker = user?.role === "baker";

  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setEditProfile(data);
        setImagePreview(data.imageUrl);
      } catch {
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const openEditModal = () => {
    setEditProfile(profile);
    setShowModal(true);
    setMessage("");
    setImagePreview(profile.imageUrl);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setEditProfile((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");

    try {
      const formData = new FormData();
      for (let key in editProfile) {
        if (isBaker && (key === "bakerType" || key === "rating")) continue;
        if (editProfile[key]) formData.append(key, editProfile[key]);
      }

      const res = await updateMyProfile(formData);
      setProfile(res.user);
      setShowModal(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="cakehub-profile-page">
      <h2>My Profile</h2>

      <div className="cakehub-profile-card">
        <div className="cakehub-profile-image">
          <img
            src={profile.imageUrl || "/images/default-avatar.png"}
            alt="Profile"
          />
        </div>

        <div className="cakehub-profile-info">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>

          {isBaker ? (
            <>
              <p>
                <strong>Experience:</strong> {profile.experience}
              </p>
              <p>
                <strong>Location:</strong> {profile.location}
              </p>
              <p>
                <strong>Specialty:</strong> {profile.specialty}
              </p>
              <p>
                <strong>Baker Type:</strong> {profile.bakerType}
              </p>
              <p>
                <strong>Rating:</strong> {profile.rating}
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Phone:</strong> {profile.phone}
              </p>
              <p>
                <strong>Address:</strong> {profile.address}
              </p>
              <p>
                <strong>City:</strong> {profile.city}
              </p>
              <p>
                <strong>Postal Code:</strong> {profile.postalCode}
              </p>
              <p>
                <strong>Country:</strong> {profile.country}
              </p>
            </>
          )}
        </div>

        <button className="cakehub-edit-btn" onClick={openEditModal}>
          Edit Profile
        </button>
      </div>

      {showModal && (
        <div className="cakehub-profile-modal">
          <div className="cakehub-modal-content">
            <h3>Edit Profile</h3>
            <form onSubmit={handleSubmit}>
              {imagePreview && (
                <div className="cakehub-profile-image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <input
                type="text"
                name="name"
                value={editProfile.name || ""}
                onChange={handleChange}
                placeholder="Full Name"
              />
              {isBaker ? (
                <>
                  <input
                    type="text"
                    name="experience"
                    value={editProfile.experience || ""}
                    onChange={handleChange}
                    placeholder="Experience"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editProfile.location || ""}
                    onChange={handleChange}
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    name="specialty"
                    value={editProfile.specialty || ""}
                    onChange={handleChange}
                    placeholder="Specialty"
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="phone"
                    value={editProfile.phone || ""}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    name="address"
                    value={editProfile.address || ""}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                  <input
                    type="text"
                    name="city"
                    value={editProfile.city || ""}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={editProfile.postalCode || ""}
                    onChange={handleChange}
                    placeholder="Postal Code"
                  />
                  <input
                    type="text"
                    name="country"
                    value={editProfile.country || ""}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </>
              )}

              <div className="cakehub-modal-actions">
                <button type="submit" disabled={updating}>
                  {updating ? "Updating..." : "Save"}
                </button>
                <button type="button" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
              {message && <p className="cakehub-message">{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
