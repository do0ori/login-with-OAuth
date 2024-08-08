import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { AuthKakaoService } from './auth-kakao.service';

import { AllConfigType } from '../config/config.type';
import { CookieSettingHelper } from '../helpers/cookie-setting.helper';

@Controller('auth/kakao')
export class AuthKakaoController {
    constructor(
        private readonly authService: AuthService,
        private readonly authKakaoService: AuthKakaoService,
        private readonly configService: ConfigService<AllConfigType>,
        private readonly cookieSettingHelper: CookieSettingHelper,
    ) {}

    @Get('login')
    async kakaoAuthorize(@Res({ passthrough: true }) response: Response): Promise<void> {
        const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.getOrThrow('kakao.clientId', { infer: true })}&redirect_uri=${this.configService.getOrThrow('kakao.redirectURI', { infer: true })}&scope=account_email,profile_nickname,profile_image`;

        response.redirect(url);
    }

    @Get('callback')
    async kakaoCallback(@Query('code') authorizeCode, @Res({ passthrough: true }) response: Response): Promise<void> {
        if (!authorizeCode) {
            response.sendStatus(HttpStatus.BAD_REQUEST);
            return;
        }

        const socialData = await this.authKakaoService.getProfile(authorizeCode);
        const loginData = await this.authService.validateSocialLogin('kakao', socialData);

        this.cookieSettingHelper.setCookies(response, loginData);

        response.redirect('http://localhost:3000/me');
    }
}
