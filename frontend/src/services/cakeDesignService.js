import axios from "axios";
import { baseURL } from "../config/config";
import { getToken } from "../utils/auth";

const API_URL = `${baseURL}/api/cake-designs`;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const sendCakeDesign = async (bakerId, file, message = "") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bakerId", bakerId);
  formData.append("message", message);

  const res = await axios.post(API_URL, formData, authHeader());

  return res.data;
};

export const getMyDesignRequests = async () => {
  const res = await axios.get(`${API_URL}/my`, authHeader());
  return res.data;
};

export const getBakerDesignRequests = async () => {
  const res = await axios.get(`${API_URL}/baker`, authHeader());
  return res.data;
};

export const updateCakeRequestStatus = async (id, status) => {
  const res = await axios.patch(
    `${API_URL}/${id}/status`,
    { status },
    authHeader()
  );
  return res.data;
};
