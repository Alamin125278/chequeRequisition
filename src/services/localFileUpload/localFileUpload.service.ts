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
}

export interface LocalFileUploadResult {
  isSuccess: boolean;
  message: string;
}

export interface BulkLocalFileUploadPayload {
  items: LocalFileUploadCommand[];
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
  console.log(response);
  return response.data;
};
