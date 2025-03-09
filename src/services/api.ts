import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URL;
const api = axios.create({
  baseURL:  baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
