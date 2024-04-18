import { REDIRECT_URI, REST_API_KEY } from "../settings";
import { httpClient } from "../utils/https";

export interface URLMap {
    kakao: string;
    naver: string;
    google: string;
}

export const AUTH_TYPE_LIST = ["kakao", "naver", "google"];

export type AuthType = keyof URLMap;

export const AUTH_TOKEN_URL: URLMap = {
    kakao: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&scope=account_email,profile_nickname,profile_image`,
    naver: "/auth/naver",
    google: "/auth/google",
};

export const GET_TOKEN_URL: URLMap = {
    kakao: "auth/kakao",
    naver: "auth/naver",
    google: "auth/google"
};

export const requestLogin = async (authType: AuthType, code: string) => {
    const response = await httpClient.post(GET_TOKEN_URL[authType], { code });
    return response.data;
};

export interface UserInfo {
    nickname: string;
    profile_image_url: string;
    email: string;
}

export const requestUserInfo = async (authType: AuthType) => {
    const response = await httpClient.get<UserInfo>(`${GET_TOKEN_URL[authType]}/me`);
    return response.data;
};