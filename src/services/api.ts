import axios from "axios";

export const baseURL = 'http://192.46.212.197:5003/api';
const api = axios.create({
  baseURL:  baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
