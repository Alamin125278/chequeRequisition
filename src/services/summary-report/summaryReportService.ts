import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export interface FetchSummaryParams {
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
