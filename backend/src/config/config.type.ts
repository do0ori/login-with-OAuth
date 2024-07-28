import { AppConfig } from './app-config.type';

import { GoogleConfig } from '../auth-google/config/google-config.type';
import { TokenConfig } from '../token/config/token-config.type';

export type AllConfigType = {
    app: AppConfig;
    google: GoogleConfig;
    token: TokenConfig;
};
