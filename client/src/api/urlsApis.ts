import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUrls = async () => {
  const myUrls = `${API_URL}/url/my-urls`;
  const response = await axios.get(myUrls, { withCredentials: true });

  return response.data;
};

export const generateShortUrl = async (longUrl: string) => {
  const endPoint = `${API_URL}/url/shorten`;
  const response = await axios.post(
    endPoint,
    { longUrl },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
