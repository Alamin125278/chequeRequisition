import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";
export interface FetchRoleParams {
  search?: string;
  status?: string;
  skip?: number;
  limit?: number;
}
// Get All Role For User
export const getRoleForUserService = async (): Promise<any> => {
  try {
    const response = await baseHttp().get(constant.APIs.getRoleForUser);
    return response.data.userRoleDtos;
  } catch (error: any) {
    throw new Error(error?.message || "Role fetch failed");
  }
};

export const getAllRolesService = async (
  params: FetchRoleParams
): Promise<any> => {
  try {
    const response = await baseHttp().get(`${constant.APIs.getRoles}`, {
      params,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.message || "Role fetch failed");
  }
};
export const saveRoleService = async (role: any, isEdit: boolean) => {
  if (isEdit) {
    const response = await baseHttp().patch(
      `${constant.APIs.updateRole}/${role.id}`,
      role
    );
    return response.data.data;
  } else {
    const response = await baseHttp().post(`${constant.APIs.createRole}`, role);
    return response.data;
  }
};

export const deleteRoleService = async (id: number) => {
  const response = await baseHttp().delete(`${constant.APIs.deleteRole}/${id}`);
  return response.data;
};

export const getRolePermissionsService = async (roleId: number) => {
  const response = await baseHttp().get(
    `${constant.APIs.getRolePermissions}/${roleId}`
  );
  return response.data.data;
};

export const getMenuIdByRoleAndMenuId = async (
  roleId: number,
  menuId: number
) => {
  const response = await baseHttp().get(
    `${constant.APIs.getMenuIdByRoleAndMenuId}/${roleId}/${menuId}`
  );
  return response.data.data;
};

export const createRolePermissionService = async (
  roleId: number,
  menuId: number,
  isActive: boolean
) => {
  const response = await baseHttp().post(
    `${constant.APIs.saveRolePermissions}`,
    {
      roleId,
      menuId,
      isActive,
    }
  );
  return response.data.data;
};

export const updateRolePermissionService = async (
  id: number,
  roleId: number,
  menuId: number,
  isActive: boolean
) => {
  const response = await baseHttp().patch(
    `${constant.APIs.updateRolePermission}`,
    {
      id,
      roleId,
      menuId,
      isActive,
    }
  );
  return response.data.data;
};

export const getUserMenusPermissionsService = async (userId: number) => {
  const response = await baseHttp().get(
    `${constant.APIs.getUserMenusPermissions}?userId=${userId}`
  );
  return response.data.data;
};
