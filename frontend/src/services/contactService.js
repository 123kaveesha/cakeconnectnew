import axios from "axios";
import { baseURL } from "../config/config";
import { getToken } from "../utils/auth";

const API_URL = `${baseURL}/api/contact`;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const submitContact = async ({ name, email, subject, message }) => {
  const res = await axios.post(
    API_URL,
    { name, email, subject, message },
    getAuthHeaders()
  );
  return res.data;
};

export const getAllContacts = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};