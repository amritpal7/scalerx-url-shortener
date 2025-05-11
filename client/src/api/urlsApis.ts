import api from "../lib/api";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUrls = async () => {
  const myUrls = `${API_URL}/url/my-urls`;

  try {
    const response = await api.get(myUrls, { withCredentials: true });
    return response.data;
  } catch (err: any) {
    if (err.response.status === 401) throw new Error("Login or register!");
  }
};

export const generateShortUrl = async (longUrl: string) => {
  const response = await api.post("/url/shorten", { longUrl });
  return response.data;
};
