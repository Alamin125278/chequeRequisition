import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";
export const createChequeRequisitionService = async (requisition: any) => {
  const response = await baseHttp().post(
    constant.APIs.createChequeRequisition,
    requisition
  );
  return response;
};
