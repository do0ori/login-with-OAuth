import { OauthProvider } from '../types/auth-providers.type';

export interface LoginData {
    accessToken: string;
    refreshToken: string;
    provider: OauthProvider;
}
