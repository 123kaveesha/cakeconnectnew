import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/registerPageStyles.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    bakerType: "", // Only used if role is 'baker'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      bakerType: role === "baker" ? "cakemaker" : "", // default bakerType
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { name, email, password, role, bakerType } = formData;

      const payload = {
        name,
        email,
        password,
        role,
        ...(role === "baker" && { bakerType }), // only include if baker
      };

      const data = await registerUser(
        payload.name,
        payload.email,
        payload.password,
        payload.role,
        payload.bakerType
      );

      alert(data.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Join CakeConnect</h2>
            <p className="auth-subtitle">Create an account to get started</p>
          </div>

          <div className="role-selector">
            <h3 className="role-title">I am a:</h3>
            <div className="role-options">
              <button
                className={`role-btn ${
                  formData.role === "customer" ? "active" : ""
                }`}
                onClick={() => handleRoleChange("customer")}
              >
                Customer
              </button>
              <button
                className={`role-btn ${
                  formData.role === "baker" ? "active" : ""
                }`}
                onClick={() => handleRoleChange("baker")}
              >
                Baker
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="name"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
              />
            </div>

            {formData.role === "baker" && (
              <div className="form-group">
                <select
                  name="bakerType"
                  value={formData.bakerType}
                  onChange={handleChange}
                  required
                >
                  <option value="cakemaker">Cakemaker</option>
                  <option value="baker">Baker</option>
                </select>
              </div>
            )}

            <button type="submit" className="auth-submit">
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="toggle-auth"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
