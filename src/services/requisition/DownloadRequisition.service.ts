import { baseHttp } from "@/config/base-http";
import type { DownloadRequisition } from "@/stores/downloadedRequisitionStore";
import constant from "@/utils/constant";

export interface FetchDownloadRequisitionsParams {
  bankId?: number;
  branchId?: number;
  search?: string;
  severity?: number;
  requestDate?: string;
  skip: number;
  limit: number;
  status: number;
}

export interface FetchDownloadRequisitionResponse {
  data: DownloadRequisition[];
  total: number;
}

export const getDownlaodedRequisitionsService = async (
  params: FetchDownloadRequisitionsParams
): Promise<FetchDownloadRequisitionResponse> => {
  const response = await baseHttp().get(constant.APIs.getOrderRequisitions, {
    params,
  });
  console.log(response);

  return {
    data: response.data.requisitions,
    total: response.data.totalCount,
  };
};

export const UpdateChequeStatusService = async (ids: number[]) => {
  const response = await baseHttp().put(constant.APIs.updateChequeRequisition, {
    requisitionIds: ids,
  });
  return response;
};
