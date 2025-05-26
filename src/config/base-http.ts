import axios from "axios"
import baseConfig from "./base-config";

export const baseHttp = ()=>{

    const axiosInstance = axios.create({
        baseURL: baseConfig.BaseURL,
        timeout: baseConfig.apiCallTimeout, // 10 seconds
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })

    return axiosInstance;
}