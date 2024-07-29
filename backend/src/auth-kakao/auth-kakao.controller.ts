import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { parse } from 'src/utils/ms.util';

import { AuthKakaoService } from './auth-kakao.service';

import { AllConfigType } from '../config/config.type';

@Controller('auth/kakao')
export class AuthKakaoController {
    constructor(
        private readonly authService: AuthService,
        private readonly authKakaoService: AuthKakaoService,
        private readonly configService: ConfigService<AllConfigType>,
    ) {}

    @Get('login')
    async kakaoAuthorize(@Res({ passthrough: true }) response: Response): Promise<void> {
        const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.getOrThrow('kakao.clientId', { infer: true })}&redirect_uri=${this.configService.getOrThrow('kakao.redirectURI', { infer: true })}&scope=account_email,profile_nickname,profile_image`;

        response.redirect(url);
    }

    @Get('callback')
    async kakaoCallback(@Query('code') authorizeCode, @Res({ passthrough: true }) response: Response) {
        if (!authorizeCode) response.sendStatus(HttpStatus.BAD_REQUEST);

        const socialData = await this.authKakaoService.getProfile(authorizeCode);
        const loginData = await this.authService.validateSocialLogin('kakao', socialData);

        // TODO: cookie 설정하는 부분은 추후 naver, kakao까지 구현 후 분리 필요
        const baseCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: this.configService.getOrThrow('app.nodeEnv', { infer: true }) === 'prod',
            sameSite: 'lax',
        };

        response.cookie('accessToken', loginData.accessToken, {
            ...baseCookieOptions,
            maxAge: parse(this.configService.getOrThrow('token.accessTokenLifeTime', { infer: true })),
        });
        response.cookie('refreshToken', loginData.refreshToken, {
            ...baseCookieOptions,
            maxAge: parse(this.configService.getOrThrow('token.refreshTokenLifeTime', { infer: true })),
        });

        response.redirect('http://localhost:3000/me');
    }
}
