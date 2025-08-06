import API from "../lib/api";

export const fetchUrls = async () => {
  try {
    const response = await API.get("/url/my-urls", { withCredentials: true });
    return response.data;
  } catch (err: any) {
    if (err.response.status === 401) throw new Error("Login or register!");
    throw new Error(err.response.data.msg || "Failed to fetch URLs");
  }
};

export const generateShortUrl = async (longUrl: string) => {
  const response = await API.post("/url/shorten", { longUrl });
  return response.data;
};
