import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../utils/auth";

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    const role = getUserRole();

    // Redirect based on role
    switch (role) {
      case "admin":
        return <Navigate to="/adminpanel" replace />;
      case "baker":
        return <Navigate to="/bkdashboard" replace />;
      case "customer":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PublicRoute;