import axios from "axios";
import { baseURL } from "../config/config";
import { getToken } from "../utils/auth";

const API_BASE = `${baseURL}/api/reviews`;

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Add a Review
export const addReview = async (productId, rating, comment) => {
  const res = await axios.post(
    API_BASE,
    { productId, rating, comment },
    authHeaders()
  );
  return res.data;
};

// Get All Reviews for a Product
export const getProductReviews = async (productId) => {
  const res = await axios.get(`${API_BASE}/${productId}`, authHeaders());
  return res.data;
};

// Get Reviews of Current Customer
export const getMyReviews = async () => {
  const res = await axios.get(`${API_BASE}/my`, authHeaders());
  return res.data;
};

// Update Review by ID
export const updateReview = async (reviewId, rating, comment) => {
  const res = await axios.patch(
    `${API_BASE}/${reviewId}`,
    { rating, comment },
    authHeaders()
  );
  return res.data;
};

// Delete Review by ID
export const deleteReview = async (reviewId) => {
  const res = await axios.delete(`${API_BASE}/${reviewId}`, authHeaders());
  return res.data;
};
