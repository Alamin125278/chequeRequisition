import { baseHttp } from "@/config/base-http";
import type { Branch } from "@/stores/branchStore";
import constant from "@/utils/constant";

export interface FetchBranchParams {
  search?: string;
  status?: string;
  skip?: number;
  limit?: number;
}

export interface FetchBranchResponse {
  data: Branch[];
  total: number;
}

export const getBranchesService = async (
  params: FetchBranchParams
): Promise<FetchBranchResponse> => {
  console.log(params);
  const response = await baseHttp().get(
    `${constant.APIs.branches}/?skip=${params.skip}&limit=${params.limit}&isActive=${params.status}&search=${params.search}`
  );
  return {
    data: response.data.branchDtos,
    total: response.data.totalBranch,
  };
};

export const saveBranchService = async (branch: any, isEdit: boolean) => {
  console.log(branch);
  if (isEdit) {
    const response = await baseHttp().patch(
      `${constant.APIs.updateBranch}/${branch.id}`,
      branch
    );
    return response.data;
  } else {
    const response = await baseHttp().post(
      `${constant.APIs.createBranch}`,
      branch
    );
    return response.data;
  }
};

export const deleteBranchService = async (id: number) => {
  const response = await baseHttp().delete(
    `${constant.APIs.deleteBranch}/${id}`
  );
  return response.data;
};
// Get All Branch Count Service
export const getBranchCountService = async () => {
  const response = await baseHttp().get(constant.APIs.countBranch);
  return response;
};
// Get All Branch For User Service
export const getBranchForUserService = async (id: number) => {
  const response = await baseHttp().get(
    `${constant.APIs.getBranchForUser}/${id}`
  );
  return response.data.branchDtos;
};
