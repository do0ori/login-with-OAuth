import axios, { AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../settings";

export const createClient = (config?: AxiosRequestConfig) => {
    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
        ...config
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response.status === 401) {
                window.location.href = "/";
                return;
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export const httpClient = createClient();