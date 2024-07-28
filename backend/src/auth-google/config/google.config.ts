import { registerAs } from '@nestjs/config';

import { IsOptional, IsString } from 'class-validator';

import validateConfig from 'src/utils/validate-config.util';

import { GoogleConfig } from './google-config.type';

class EnvironmentVariablesValidator {
    @IsString()
    @IsOptional()
    GOOGLE_CLIENT_ID: string;

    @IsString()
    @IsOptional()
    GOOGLE_CLIENT_SECRET: string;

    @IsString()
    @IsOptional()
    GOOGLE_REDIRECT_URI: string;
}

export default registerAs<GoogleConfig>('google', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        tokenAPI: 'https://oauth2.googleapis.com/token',
        userInfoAPI: 'https://www.googleapis.com/oauth2/v2/userinfo',
        redirectURI: process.env.GOOGLE_REDIRECT_URI,
    };
});
