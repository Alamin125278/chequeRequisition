import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export const saveLocalFileUploadService = async (payload: any) => {
  const response = await baseHttp().post(
    `${constant.APIs.localFileUpload}`,
    payload
  );
  console.log(response);
  return response.data;
};
