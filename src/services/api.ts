import axios from "axios";
import Cookies from "js-cookie";

export const baseURL = import.meta.env.VITE_BASE_URL;
// export const baseURL = 'http://localhost:5003/api';
const api = axios.create({
  baseURL:  baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
