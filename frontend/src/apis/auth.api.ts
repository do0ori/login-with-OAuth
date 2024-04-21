import { API_BASE_URL } from "../settings";
import { httpClient } from "../utils/https";

export interface URLMap {
    kakao: string;
    naver: string;
    google: string;
}

export const AUTH_TYPE_LIST = ["kakao", "naver", "google"];

export type AuthType = keyof URLMap;

export const GET_TOKEN_URL: URLMap = {
    kakao: "auth/kakao",
    naver: "auth/naver",
    google: "auth/google"
};

export const GET_CODE_URL: URLMap = {
    kakao: `${API_BASE_URL}/${GET_TOKEN_URL["kakao"]}`,
    naver: `${API_BASE_URL}/${GET_TOKEN_URL["naver"]}`,
    google: `${API_BASE_URL}/${GET_TOKEN_URL["google"]}`
}

export interface UserInfo {
    name: string;
    profile_image_url: string;
    email: string;
}

export const requestUserInfo = async () => {
    const response = await httpClient.get<UserInfo>("auth/me");
    return response.data;
};