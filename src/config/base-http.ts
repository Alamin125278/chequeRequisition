import { getAuthorizationToken } from "@/services/auth/token.service";
import axios from "axios";
import baseConfig from "./base-config";

export const baseHttp = () => {
  const axiosInstance = axios.create({
    baseURL: baseConfig.BaseURL,
    timeout: baseConfig.apiCallTimeout, // 10 seconds
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  // 🔁 Inject token before every request
  axiosInstance.interceptors.request.use((config) => {
    const token = getAuthorizationToken();
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  });

  return axiosInstance;
};
