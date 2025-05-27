import { API_BASE_URL, API_PORT, API_VERSION } from "@/lib/env";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}:${API_PORT}/api/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;
