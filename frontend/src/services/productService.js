import axios from "axios";
import { getToken } from "../utils/auth";
import { baseURL } from "../config/config";

const API_BASE = `${baseURL}/api/products`;

// Axios config with token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// GET all products (public)
export const fetchAllProducts = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

// GET product by ID
export const fetchProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

// Get all products for the logged-in baker
export const getMyProducts = async () => {
  const res = await axios.get(`${API_BASE}/baker`, getAuthHeaders());

  return res.data;
};

// ADD new product (admin or baker)
export const addProduct = async (productData) => {
  const formData = productData;
  const res = await axios.post(API_BASE, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// UPDATE product by ID
export const updateProduct = async (id, updatedData) => {
  const formData = updatedData;

  const res = await axios.patch(`${API_BASE}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// DELETE product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
  return res.data;
};
