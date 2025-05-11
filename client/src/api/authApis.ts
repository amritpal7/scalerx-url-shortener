import axios from "axios";
import api from "../lib/api";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials, {
    withCredentials: true,
  });

  return response.data;
};

export const register = async (credentials: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/register`, credentials, {
    withCredentials: true,
  });

  return response.data;
};

export const logout = () => {
  return axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
};

export const fetchMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};
