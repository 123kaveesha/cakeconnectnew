import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/loginPageStyles.css";
import { getUserRole } from "../utils/auth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData.email, formData.password);
      alert(data.message || "Login successful");

      const role = getUserRole();
      if (role === "admin") {
        navigate("/adminpanel", { replace: true });
      } else if (role === "baker") {
        navigate("/bkdashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      alert(error.message); // cleaner error handling
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Login to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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

            <button type="submit" className="auth-submit">
              Login
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="toggle-auth"
              >
                Register now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
