import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";
export const CheckRoutePermission = async (
  route: string,
  requiresAuth: boolean
) => {
  try {
    if (requiresAuth == false) {
      return true;
    } else {
      const encodedRoute = encodeURIComponent(route); // path encode করা খুব জরুরি
      const response = await baseHttp().get(
        `${constant.APIs.routePermission}/${encodedRoute}`
      );
      return response.data?.hasPermission === true;
    }
  } catch (error: any) {
    throw new Error(error?.message || "Route check failed");
  }
};
