import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

// Get token from storage
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// Save token
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

// Remove token
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// Check if token is expired
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

// Extract role from token
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const { role } = jwtDecode(token);
    return role;
  } catch {
    return null;
  }
};

// Extract full user details from token
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};
