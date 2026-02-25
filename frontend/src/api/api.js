import axios from "axios";

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error = null) => {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  refreshQueue = [];
};

// ================================
// AXIOS INSTANCE
// ================================
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// ================================
// RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.response) return Promise.reject(error);

    const { status, data } = error.response;
    const originalRequest = error.config;

    // ⚠️ SOLO refrescar si el backend dice TOKEN_EXPIRED
    if (
      status === 401 &&
      data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await api.post("/auth/refresh");

        isRefreshing = false;
        processQueue();

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        // ⛔ Sesión muerta → limpiar y redirigir
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
