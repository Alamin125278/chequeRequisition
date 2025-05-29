import { baseHttp } from "@/config/base-http";
import type { Bank } from "@/stores/bankStore";
import constant from "@/utils/constant";

export interface FetchBankParams {
  search?: string;
  status?: string;
  skip?: number;
  limit?: number;
}

export interface FetchBankResponse {
  data: Bank[];
  total: number;
  activeTotal: number;
}

export const getBankService = async (
  params: FetchBankParams
): Promise<FetchBankResponse> => {
  console.log(params);
  const response = await baseHttp().get(
    `${constant.APIs.banks}/?skip=${params.skip}&limit=${params.limit}&isActive=${params.status}&search=${params.search}`
  );
  console.log(response);
  return {
    data: response.data.bankDtos,
    total: response.data.totalBanks,
    activeTotal: response.data.activeBanks,
  };
};

export const saveBankService = async (bank: any, isEdit: boolean) => {
  if (isEdit) {
    console.log(bank);
    const response = await baseHttp().patch(
      `${constant.APIs.updateBank}/${bank.id}`,
      bank
    );
    return response.data;
  } else {
    const response = await baseHttp().post(`${constant.APIs.createBank}`, bank);
    return response.data;
  }
};

export const deleteBankService = async (id: number) => {
  const response = await baseHttp().delete(`${constant.APIs.deleteBank}/${id}`);
  return response.data;
};
// Get All Bank Count Service
export const getBankCountService = async () => {
  const response = await baseHttp().get(constant.APIs.countBank);
  return response;
};
