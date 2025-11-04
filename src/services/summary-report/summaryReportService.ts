import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export interface FetchSummaryParams {
  bankId: number;
  startDate: string;
  endDate: string;
  severity: number;
  agentType: boolean;
}
export interface FetchConsumptionParams {
  bankId: number;
  startDate: string;
  endDate: string;
}
// interface SummaryReport {
//   homeBranch: string;
//   deliveryBranch: string;
//   challanNo: string;
//   challanDate: string;
//   sb10: number;
//   sb20: number;
//   sb50: number;
//   cd10: number;
//   cd25: number;
//   cd50: number;
//   po100: number;
//   total: number;
// }

// export interface FetchSummaryResponse {
//     data: SummaryReport[];
//     total: number;
// }

export const getSummaryReportService = async (params: FetchSummaryParams) => {
  const response = await baseHttp().get(constant.APIs.summaryReport, {
    params,
  });
  return response.data;
};
export const getCourierSummaryReportService = async (
  params: FetchSummaryParams
) => {
  const response = await baseHttp().get(constant.APIs.courierSummaryReport, {
    params,
  });
  return response.data;
};
export const getmonthlyConsumptionReportService = async (
  params: FetchConsumptionParams
) => {
  const response = await baseHttp().get(constant.APIs.courierSummaryReport, {
    params,
  });
  return response.data;
};
export const getDailyProductionReportService = async (params: {
  date: string;
}) => {
  const response = await baseHttp().get(constant.APIs.dailyProductionReport, {
    params,
  });
  return response.data;
};
export const getConsumptionReportService = async (
  params: FetchConsumptionParams
) => {
  const response = await baseHttp().get(constant.APIs.consumptionReport, {
    params,
  });
  return response.data;
};
