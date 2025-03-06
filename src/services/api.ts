import axios from "axios";

export const baseURL = 'http://45.198.13.76:5003/api';
const api = axios.create({
  baseURL:  baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
