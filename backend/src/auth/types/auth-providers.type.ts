export const AUTH_PROVIDERS = ['google', 'kakao', 'naver'] as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[number];
