import { AppConfig } from './app-config.type';

import { SocialConfig } from '../auth/types/social-config.type';
import { TokenConfig } from '../token/config/token-config.type';

export type AllConfigType = {
    app: AppConfig;
    token: TokenConfig;
    google: SocialConfig;
    kakao: SocialConfig;
    naver: SocialConfig;
};
