import { API_BASE_URL } from "../settings";
import { httpClient } from "../utils/https";

export interface URLMap {
    kakao: string;
    naver: string;
    google: string;
}

export const AUTH_TYPE_LIST = ["kakao", "naver", "google"];

export type AuthType = keyof URLMap;

const LOGIN_URL: URLMap = {
    kakao: "auth/kakao/login",
    naver: "auth/naver/login",
    google: "auth/google/login",
};

export const GET_CODE_URL: URLMap = {
    kakao: `${API_BASE_URL}/${LOGIN_URL["kakao"]}`,
    naver: `${API_BASE_URL}/${LOGIN_URL["naver"]}`,
    google: `${API_BASE_URL}/${LOGIN_URL["google"]}`,
};

export const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;

export interface UserInfo {
    name: string;
    profileImageUrl: string;
    email: string;
}

export const requestUserInfo = async () => {
    const response = await httpClient.get<UserInfo>("auth/me");
    return response.data;
};
