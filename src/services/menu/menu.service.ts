import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";
export const getMenuService = async (): Promise<any> => {
  try {
    const response = await baseHttp().get(constant.APIs.menuInfo);
    return response.data.menus;
  } catch (error: any) {
    throw new Error(error?.message || "Menu fetch failed");
  }
};
