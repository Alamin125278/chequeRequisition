import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export const saveMenuPermissionService = async (
  userId: number,
  payload: { menuId: number; canAccess: boolean }[],
) => {
  const response = await baseHttp().post(
    `${constant.APIs.saveMenuPermission}`,
    {
      userId,
      payload,
    },
  );
  return response.data.data;
};
