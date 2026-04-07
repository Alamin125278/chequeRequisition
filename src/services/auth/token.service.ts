import baseConfig from "@/config/base-config";
import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export const getAuthorizationToken = (): string => {
  try {
    const token = localStorage.getItem(baseConfig.LocalStorageTokenKeyName);
    if (token) {
      return "Bearer " + token;
    }
    return "";
  } catch (error) {
    console.error("Error retrieving authorization token:", error);
    throw new Error("Failed to retrieve authorization token");
  }
};

export const setAuthorizationToken = (token: string) => {
  try {
    if (!token) {
      localStorage.setItem(baseConfig.LocalStorageTokenKeyName, token);
    }
  } catch (error) {
    console.error("Error setting authorization token:", error);
    throw new Error("Failed to set authorization token");
  }
};

export const removeAuthorizationTokenService = () => {
  try {
    localStorage.removeItem(baseConfig.LocalStorageTokenKeyName);
  } catch (error) {
    console.error("Error removing authorization token:", error);
    throw new Error("Failed to remove authorization token");
  }
};

//validateToken

export const validateTokenService = async (): Promise<boolean> => {
  try {
    const token = getAuthorizationToken();
    const response = await baseHttp().get(constant.APIs.validateToken);
    console.log(response.data.data.isValid);
    return response.data.data.isValid === true;
  } catch (error) {
    return false;
  }
};
