import { registerAs } from '@nestjs/config';

import { IsOptional, IsString } from 'class-validator';

import validateConfig from 'src/utils/validate-config.util';

import { SocialConfig } from '../../auth/types/social-config.type';

class EnvironmentVariablesValidator {
    @IsString()
    @IsOptional()
    KAKAO_CLIENT_ID: string;

    @IsString()
    @IsOptional()
    KAKAO_CLIENT_SECRET: string;

    @IsString()
    @IsOptional()
    KAKAO_REDIRECT_URI: string;
}

export default registerAs<SocialConfig>('kakao', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        tokenAPI: 'https://kauth.kakao.com/oauth/token',
        userInfoAPI: 'https://kapi.kakao.com/v2/user/me',
        redirectURI: process.env.KAKAO_REDIRECT_URI,
    };
});
