import { OauthProvider } from '../types/auth-providers.type';

export interface TokenAuthData {
    accessToken: string;
    refreshToken: string;
}

export interface LoginAuthData extends TokenAuthData {
    provider: OauthProvider;
}
