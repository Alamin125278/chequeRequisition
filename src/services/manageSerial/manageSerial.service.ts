import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export interface FetchManageSerialParams {
  bankId: number;
  chequeType: string;
  lvs: number;
}
export interface updateManageSerialParams {
  bankId: number;
  chequeType: string;
  lvs: number;
  endingNumber: string;
}

export const fetchManageSerialService = async (
  params: FetchManageSerialParams
) => {
  const response = await baseHttp().get(
    `${constant.APIs.getEndNoBybankAndtype}/?bankId=${params.bankId}&chequeType=${params.chequeType}&lvs=${params.lvs}`
  );
  return response.data;
};

export const updateManageSerialService = async (
  params: updateManageSerialParams
) => {
  const response = await baseHttp().patch(
    `${constant.APIs.updateEndNoBybankAndtype}`,
    params
  );
  return response.data;
};
