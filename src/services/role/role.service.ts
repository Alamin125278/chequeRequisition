import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";
// Get All Role For User
export const getRoleForUserService = async (): Promise<any> => {
  try {
    const response = await baseHttp().get(constant.APIs.getRoleForUser);
    return response.data.userRoleDtos;
  } catch (error: any) {
    throw new Error(error?.message || "Role fetch failed");
  }
};
