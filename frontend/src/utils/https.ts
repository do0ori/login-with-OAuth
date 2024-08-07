import axios, { AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../settings";

export const createClient = (config?: AxiosRequestConfig) => {
    const defaultConfig: AxiosRequestConfig = {
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    };

    const axiosInstance = axios.create({ ...defaultConfig, ...config });
    const refreshAxiosInstance = axios.create({ ...defaultConfig });

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

                try {
                    // Request token refresh -> new access and refresh token will be set on cookie.
                    await refreshAxiosInstance.post("auth/refresh");

                    return axiosInstance(originalRequest); // Retry the original request with the new access token.
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    window.location.href = "/"; // Redirect to the login page.

                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export const httpClient = createClient();
