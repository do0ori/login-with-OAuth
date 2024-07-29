import { registerAs } from '@nestjs/config';

import { IsOptional, IsString } from 'class-validator';

import validateConfig from 'src/utils/validate-config.util';

import { SocialConfig } from '../../auth/types/social-config.type';

class EnvironmentVariablesValidator {
    @IsString()
    @IsOptional()
    NAVER_CLIENT_ID: string;

    @IsString()
    @IsOptional()
    NAVER_CLIENT_SECRET: string;

    @IsString()
    @IsOptional()
    NAVER_REDIRECT_URI: string;
}

export default registerAs<SocialConfig>('naver', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        clientId: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        tokenAPI: 'https://nid.naver.com/oauth2.0/token',
        userInfoAPI: 'https://openapi.naver.com/v1/nid/me',
        redirectURI: process.env.NAVER_REDIRECT_URI,
    };
});
