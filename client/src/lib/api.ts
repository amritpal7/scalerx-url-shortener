import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_PROD_API_URL
      : import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// seperate instance just for refreshing token
const plainAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh");

    if (isTokenExpired) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(originalRequest))
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Use plainAxios to avoid recursion
        await plainAxios.post("/auth/refresh");
        processQueue(null);
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // window.location.href = "/login"; // logout user on refresh failure
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
