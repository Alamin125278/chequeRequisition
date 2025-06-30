import { baseHttp } from "@/config/base-http";
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
}

export interface FetchChallanParams {
  bankName: string;
  receivingBranchName: string;
  challanDate: string;
  vendorName: string;
  courierName: string;
  challanNumber: string;
  branchName: string;
  agentNum?: string | null;
  items: ChallanItem[];
}

export const createChallan = async (payload: CreateChallanPayload) => {
  const res = await baseHttp().post(constant.APIs.createChallan, payload);
  return res.data;
};

export const getChallanService = async (
  challanIds: number[]
): Promise<FetchChallanParams[]> => {
  const res = await baseHttp().post(constant.APIs.getChallans, {
    challanIds: challanIds,
  });

  return res.data.challans;
};
