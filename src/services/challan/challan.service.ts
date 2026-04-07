import { baseHttp } from "@/config/base-http";
import type { Challan } from "@/stores/challanStore";
import constant from "@/utils/constant";

export interface ChallanOrder {
  id: number;
  receivingBranchId: number;
}
export interface CreateChallanPayload {
  challanData: Record<string, ChallanOrder[]>;
}
export interface ChallanItem {
  accountNo: string;
  accountName: string;
  startNo: string;
  endNo: string;
  chequeType: string;
  bookQty: number;
  leaves: number;
  serverity: number;
  branchName: string;
  accFlag: string;
}

export interface FetchChallanParams {
  bankId: number;
  bankName: string;
  receivingBranchName: string;
  challanDate: string;
  vendorName: string;
  courierName: string;
  courierPhone: string;
  challanNumber: string;
  branchName: string;
  agentNum?: string | null;
  reDate: string;
  isAgent: boolean;
  items: ChallanItem[];
}
export interface FetchAllChallanParams {
  bankId?: number;
  branchId?: number;
  search?: string;
  challanDate?: string;
  skip: number;
  limit: number;
}
export interface FetchAllChallanItemParams {
  id: number;
  skip: number;
  limit: number;
}

export interface FetchAllChallanResponse {
  data: Challan[];
}

export const createChallan = async (payload: CreateChallanPayload) => {
  const res = await baseHttp().post(constant.APIs.createChallan, payload);
  return res.data;
};

export const getChallanExportService = async (
  challanIds: number[],
): Promise<FetchChallanParams[]> => {
  const res = await baseHttp().post(constant.APIs.getChallansExport, {
    challanIds: challanIds,
  });

  return res.data.data.challans;
};

export const getAllChallanService = async (params: FetchAllChallanParams) => {
  const response = await baseHttp().get(constant.APIs.getAllChallans, {
    params,
  });
  return response.data.data;
};

export const fetchChallanItemsService = async (
  params: FetchAllChallanItemParams,
) => {
  const response = await baseHttp().get(constant.APIs.fetchChallanItem, {
    params,
  });
  return response.data.data;
};
