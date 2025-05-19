import axios from "axios";
import { baseURL } from "../config/config";
import { removeToken, saveToken } from "../utils/auth";

const API_BASE_URL = `${baseURL}/api/auth`;

// Login user
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    const { accessToken } = res.data;
    saveToken(accessToken);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Login failed";
    throw new Error(message);
  }
};

// Register user
export const registerUser = async (
  name,
  email,
  password,
  role,
  bakerType = null
) => {
  try {
    const payload = { name, email, password, role };

    // Only include bakerType if role is 'baker'
    if (role === "baker" && bakerType) {
      payload.bakerType = bakerType;
    }

    const res = await axios.post(`${API_BASE_URL}/register`, payload);
    // const { accessToken } = res.data;

    // saveToken(accessToken);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Registration failed";
    throw new Error(message);
  }
};

// Logout utility
export const logoutUser = () => {
  removeToken();
  window.location.href = "/login";
};
