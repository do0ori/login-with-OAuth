import { OauthProvider } from '../types/auth-providers.type';

export interface SocialData {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string;
    provider: OauthProvider;
}
