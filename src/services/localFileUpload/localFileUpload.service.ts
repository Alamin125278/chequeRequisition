import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export interface LocalFileUploadCommand {
  bankId: number;
  branchName: string;
  accountNo: string;
  routingNo: string;
  startNo: string;
  endNo: string;
  chequeType: string;
  chequePrefix: string;
  micrNo: string;
  series: string;
  accountName: string;
  cusAddress: string;
  bookQty: number;
  transactionCode: number;
  leaves: number;
  courierCode: string;
  receivingBranchName: string;
  serverity: number;
  requestDate?: string;
  agentNum?: string;
  isAgent: boolean;
}

export interface LocalFileUploadResult {
  isSuccess: boolean;
  message: string;
}

export interface BulkLocalFileUploadPayload {
  items: LocalFileUploadCommand[];
}
export interface GetBranchParams {
  bankId: number;
  branchCode: string;
  branchName: string;
}

export interface ResponseDto<T> {
  message: string;
  data: T;
  statusCode: number;
}

export const saveBulkLocalFileUploadService = async (
  items: BulkLocalFileUploadPayload["items"]
): Promise<ResponseDto<LocalFileUploadResult>> => {
  const payload: BulkLocalFileUploadPayload = { items };
  const response = await baseHttp().post(
    `${constant.APIs.localFileUpload}`,
    payload
  );
  return response.data;
};

export const getBranchId = async (
  bankId: number,
  branchCode: string,
  branchName: string
) => {
  const response = await baseHttp().get(
    `${constant.APIs.getBranchId}/?bankId=${bankId}&branchCode=${branchCode}&branchName=${branchName}`
  );
  return response.data;
};
