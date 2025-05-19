import axios from "axios";
import { baseURL } from "../config/config";
import { getToken } from "../utils/auth";

const API_URL = `${baseURL}/api`;

// Setup auth header
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get current user profile
export const getMyProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`, authHeader());
  return res.data;
};

// Update profile (with optional image)
export const updateMyProfile = async (formData) => {
  const res = await axios.patch(`${API_URL}/profile`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Delete current profile image
export const deleteProfileImage = async () => {
  const res = await axios.delete(`${API_URL}/profile/image`, authHeader());
  return res.data;
};

// ADMIN: Get all customers
export const getAllCustomers = async () => {
  const res = await axios.get(`${API_URL}/users/customers`, authHeader());
  return res.data;
};

// ADMIN: Get all bakers
export const getAllBakers = async () => {
  const res = await axios.get(`${API_URL}/users/bakers`, authHeader());
  return res.data;
};

// ADMIN: Delete customer by ID
export const deleteCustomerById = async (customerId) => {
  const res = await axios.delete(
    `${API_URL}/users/customers/${customerId}`,
    authHeader()
  );
  return res.data;
};

// ADMIN: Delete baker by ID
export const deleteBakerById = async (bakerId) => {
  const res = await axios.delete(
    `${API_URL}/users/bakers/${bakerId}`,
    authHeader()
  );
  return res.data;
};

// PUBLIC: Get a baker’s public profile
export const getBakerById = async (bakerId) => {
  const res = await axios.get(`${API_URL}/users/bakers/${bakerId}`);
  return res.data;
};
