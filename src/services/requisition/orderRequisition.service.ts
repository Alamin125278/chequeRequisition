import { baseHttp } from "@/config/base-http";
import type { OrderRequisition } from "@/stores/orderRequisitionStore";
import constant from "@/utils/constant";

export interface FetchOrderRequisitionParams {
  BankId?: number;
  search?: string;
  severity?: number;
  requestDate?: string;
  skip: number;
  limit: number;
  status: number;
  isAgent?: boolean;
  courierCode?: string;
}
export interface FetchOrderRequisitionForExportParams {
  BankId?: number;
  search?: string;
  severity?: number;
  requestDate?: string;
  isAgent?: boolean;
  courierCode?: string;
}

export interface FetchOrderRequisitionResponse {
  data: OrderRequisition[];
  total: number;
}
export const getOrderRequisitionsService = async (
  params: FetchOrderRequisitionParams,
): Promise<FetchOrderRequisitionResponse> => {
  const response = await baseHttp().get(constant.APIs.getOrderRequisitions, {
    params,
  });

  return {
    data: response.data.requisitions,
    total: response.data.totalCount,
  };
};
export const getOrderRequisitionsForExportService = async (
  params: FetchOrderRequisitionForExportParams,
) => {
  const response = await baseHttp().get(
    constant.APIs.getOrderRequisitionsForExport,
    {
      params,
    },
  );
  return response.data.requisitions;
};
