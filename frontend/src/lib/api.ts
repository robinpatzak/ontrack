import { API_VERSION } from "@/lib/constants";
import { API_BASE_URL, API_PORT } from "@/lib/env";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}:${API_PORT}/api/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await apiClient.get("/auth/refresh");
        return apiClient(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
