import axios from "axios";
import { baseURL } from "../config/config";
import { getToken } from "../utils/auth";

const API_URL = `${baseURL}/api/orders`;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Customer: Place a new order
export const placeOrder = async () => {
  const res = await axios.post(API_URL, {}, authHeader());
  return res.data;
};

// Customer: Get all my orders
export const getMyOrders = async () => {
  const res = await axios.get(`${API_URL}/my`, authHeader());
  return res.data;
};

// Get all orders (Admin only)
export const getAllOrders = async () => {
  const res = await axios.get(`${API_URL}/all`, authHeader());

  return res.data;
};

// Customer: Mark order as paid
export const markOrderAsPaid = async (orderId) => {
  const res = await axios.patch(`${API_URL}/${orderId}/pay`, {}, authHeader());
  return res.data;
};

// Customer or Baker: Get order by ID
export const getOrderById = async (orderId) => {
  const res = await axios.get(`${API_URL}/${orderId}`, authHeader());
  return res.data;
};

// Baker: Get all assigned orders
export const getBakerOrders = async () => {
  const res = await axios.get(`${API_URL}/baker/all`, authHeader());
  return res.data;
};

// Baker: Update status of a baker's order
export const updateBakerOrderStatus = async (orderId, status) => {
  const res = await axios.patch(
    `${API_URL}/${orderId}/status`,
    { status },
    authHeader()
  );
  return res.data;
};
