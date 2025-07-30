import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";
import { getAuthorizationToken } from "./token.service";

export const loginService = async (userCredentials: {
  userNameOrEmail: string;
  password: string;
}): Promise<{ token: string }> => {
  try {
    const response = await baseHttp().post(
      constant.APIs.login,
      userCredentials
    );
    const { token } = response.data;
    localStorage.setItem("authToken", token);
    return { token };
  } catch (error: any) {
    throw new Error(error?.response?.data?.Message);
  }
};

export const checkIsLoggedInService = (): boolean => {
  const token = getAuthorizationToken();
  return token !== "";
};
