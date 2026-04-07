import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export interface Card {
  totalRequisition: number;
  orderedRequisition: number;
  processingRequisition: number;
  dispatchedRequisition: number;
  deliveredRequisition: number;
}

export interface BankRequisition {
  bankName: string;
  totalRequisitions: number;
}
export interface OrderTracking {
  label: string;
  count: number;
}

export const getStats = async (bankId: number | null = null) => {
  if (bankId !== null) {
    const response = await baseHttp().get(constant.APIs.getDashboardStats, {
      params: {
        bankId: bankId,
      },
    });
    return response.data.data.statCardDto;
  }
  const response = await baseHttp().get(constant.APIs.getDashboardStats);
  return response.data.data.statCardDto;
};

export const getBankRequisitions = async (): Promise<BankRequisition[]> => {
  const response = await baseHttp().get(constant.APIs.getBankRequisitions);
  return response.data.data.bankWiserRequisitions;
};

export const getOrderTracking = async (
  timeRange: string
): Promise<OrderTracking[]> => {
  const response = await baseHttp().get(constant.APIs.getOrderTracking, {
    params: {
      timeRange: timeRange,
    },
  });
  return response.data.data.orderTrackings;
};
