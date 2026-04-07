import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";
export interface FetchMenuParams {
  search?: string;
  status?: string;
  bankId?: number;
  skip?: number;
  limit?: number;
}
export const getMenuService = async (): Promise<any> => {
  try {
    const response = await baseHttp().get(constant.APIs.menuInfo);
    return response.data.menus;
  } catch (error: any) {
    throw new Error(error?.message || "Menu fetch failed");
  }
};

export const getAllMenusService = async (
  params: FetchMenuParams
): Promise<any> => {
  try {
    const response = await baseHttp().get(`${constant.APIs.getMenus}`, {
      params,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.message || "Menu fetch failed");
  }
};
export const saveMenuService = async (menu: any, isEdit: boolean) => {
  if (isEdit) {
    const response = await baseHttp().patch(
      `${constant.APIs.updateMenu}/${menu.id}`,
      menu
    );
    return response.data;
  } else {
    const response = await baseHttp().post(`${constant.APIs.createMenu}`, menu);
    return response.data;
  }
};

export const deleteMenuService = async (id: number) => {
  const response = await baseHttp().delete(`${constant.APIs.deleteMenu}/${id}`);
  return response.data;
};
