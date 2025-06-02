import { baseHttp } from "@/config/base-http";
import constant from "@/utils/constant";

export const uploadImageService = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderName", "images");

  const response = await baseHttp().post(constant.APIs.uploadImage, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response);

  return response.data.imageUrl;
};
