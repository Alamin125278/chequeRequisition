import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

// Get All Courier Service For DropDown
export const getCouriersForDropDownService = async (): Promise<any> => {
  try {
    const response = await baseHttp().get(
      `${constant.APIs.getCouriersForDropDown}`,
    );
    return response.data.data.courierDtos;
  } catch (error: any) {
    throw new Error(error?.message || "Courier fetch failed");
  }
};
