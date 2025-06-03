import { baseHttp } from "@/config/base-http";
import type { User } from "@/stores/userStore";
import constant from "@/utils/constant";
import type { AxiosResponse } from "axios";

export interface FeatchUserParams {
  search: string;
  status: string;
  skip: number;
  limit: number;
  role: number;
}
export interface FeatchUserResponse {
  data: User[];
  total: number;
}
// Get All Users
export const getUsersService = async (
  params: FeatchUserParams
): Promise<FeatchUserResponse> => {
  let response: AxiosResponse;
  if (params.role == 0 || params.role === undefined || params.role === null) {
    response = await baseHttp().get(
      `${constant.APIs.users}?search=${params.search}&isActive=${params.status}&skip=${params.skip}&limit=${params.limit}`
    );
  } else {
    response = await baseHttp().get(
      `${constant.APIs.users}?search=${params.search}&isActive=${params.status}&skip=${params.skip}&limit=${params.limit}&role=${params.role}`
    );
  }

  return {
    data: response.data.userDtos,
    total: response.data.totalUser,
  };
};
// Save/Update User
export const saveUserService = async (user: any, isEdit: boolean) => {
  console.log(user);
  if (isEdit) {
    const response = await baseHttp().patch(
      `${constant.APIs.updateUserInfo}/${user.id}`,
      user
    );
    return response.data;
  } else {
    const response = await baseHttp().post(
      `${constant.APIs.createUserInfo}`,
      user
    );
    return response.data;
  }
};
// delete user
export const deleteUserService = async (id: number) => {
  const response = await baseHttp().delete(`${constant.APIs.deleteUser}/${id}`);
  return response.data;
};
// Get User Count
export const getUserCountService = async () => {
  const response = await baseHttp().get(constant.APIs.countUser);
  return response;
};
// Change Password
export const changePasswordService = async (user: any) => {
  const response = await baseHttp().post(
    `${constant.APIs.changePassword}`,
    user
  );
  return response;
};
