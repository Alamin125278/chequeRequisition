import { baseHttp } from "@/config/base-http";
import type { AllRequisition } from "@/stores/AllRequisitionStore";
import constant from "@/utils/constant";
export interface FetchRequisitionsParams {
  bankId?: number;
  branchId?: number;
  search?: string;
  severity?: number;
  requestDate?: string;
  // endDate?: string;
  skip: number;
  limit: number;
  status?: number;
}

export interface FetchRequisitionResponse {
  data: AllRequisition[];
  total: number;
}

export const createChequeRequisitionService = async (requisition: any) => {
  const response = await baseHttp().post(
    constant.APIs.createChequeRequisition,
    requisition
  );
  return response;
};

export const getAllRequisitionsService = async (
  params: FetchRequisitionsParams
): Promise<FetchRequisitionResponse> => {
  const response = await baseHttp().get(constant.APIs.getOrderRequisitions, {
    params,
  });
  return {
    data: response.data.requisitions,
    total: response.data.totalCount,
  };
};
