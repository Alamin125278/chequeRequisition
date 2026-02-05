import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export const UpdateChequeSeverityService = async (
  ids: number[],
  severity: number,
) => {
  const response = await baseHttp().patch(constant.APIs.updateChequeSeverity, {
    requisitionIds: ids,
    severity,
  });
  return response;
};
