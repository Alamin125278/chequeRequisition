import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";
export const getVendorForBankService = async (): Promise<any> => {
  try {
    const response = await baseHttp().get(constant.APIs.getVendorForBankInfo);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.message || "Vendor fetch failed");
  }
};
