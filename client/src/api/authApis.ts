import axios from "axios";
import api from "../lib/api";

const API_URL = import.meta.env.VITE_API_URL;

export const loginApi = async (credentials: {
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
  const response = await axios.post(`${API_URL}/auth/users`, credentials, {
    withCredentials: true,
  });

  return response.data;
};

export const logoutApi = () => {
  return axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
};

export const fetchMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const updateUserEmail = async (credentials: {
  email: string;
  currentPassword: string;
}) => {
  return await api.put(`${API_URL}/auth/users/update`, credentials, {
    withCredentials: true,
  });
};

export const deleteUserAccount = async () => {
  return axios.delete(`${API_URL}/auth/delete`, { withCredentials: true });
};
