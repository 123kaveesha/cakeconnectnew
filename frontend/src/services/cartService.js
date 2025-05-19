import axios from "axios";
import { baseURL } from "../config/config";
import { getToken } from "../utils/auth";

const API_URL = `${baseURL}/api/cart`;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get Current User's Cart
export const fetchCart = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

// Add Product to Cart
export const addToCart = async (productId, quantity) => {
  const res = await axios.post(API_URL, { productId, quantity }, authHeader());
  return res.data;
};

// Update Item Quantity
export const updateCartItem = async (productId, quantity) => {
  const res = await axios.patch(API_URL, { productId, quantity }, authHeader());
  return res.data;
};

// Remove Item from Cart
export const removeCartItem = async (productId) => {
  const res = await axios.delete(`${API_URL}/item/${productId}`, authHeader());
  return res.data;
};

// Clear Entire Cart
export const clearCart = async () => {
  const res = await axios.delete(API_URL, authHeader());
  return res.data;
};
