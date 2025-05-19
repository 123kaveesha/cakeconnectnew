import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole, removeToken } from "../../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    removeToken(); // token expired or invalid
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
