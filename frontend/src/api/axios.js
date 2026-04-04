import axios from "axios";

/**
 * Global Axios Instance
 * 
 * We use a relative /api route to leverage the Vite proxy (defined in vite.config.js).
 * This makes the app more portable across different ports and machines.
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const UPLOAD_BASE = "/uploads";

api.interceptors.request.use((config) => {
  return config;
});

export default api;