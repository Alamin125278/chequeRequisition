import { baseHttp } from "@/config/base-http";
import type { DispatchRequisition } from "@/stores/dispatchRequisitionStore";
import constant from "@/utils/constant";

export interface FetchDispatchRequisitionsParams {
  bankId?: number;
  branchId?: number;
  search?: string;
  severity?: number;
  requestDate?: string;
  skip: number;
  limit: number;
  status: number;
}

export interface FetchDispatchRequisitionResponse {
  data: DispatchRequisition[];
  total: number;
}

export const getDispatchRequisitionsService = async (
  params: FetchDispatchRequisitionsParams
): Promise<FetchDispatchRequisitionResponse> => {
  const response = await baseHttp().get(constant.APIs.getOrderRequisitions, {
    params,
  });
  return {
    data: response.data.requisitions,
    total: response.data.totalCount,
  };
};

export const UpdateChequeStatusService = async (ids: number[]) => {
  const response = await baseHttp().patch(
    constant.APIs.updateChequeRequisition,
    {
      requisitionIds: ids,
    }
  );
  return response;
};
