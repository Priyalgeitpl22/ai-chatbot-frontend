import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URL;
// export const baseURL = 'http://localhost:5003/api';
const api = axios.create({
  baseURL:  baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
