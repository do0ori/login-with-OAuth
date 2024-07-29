import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { parse } from 'src/utils/ms.util';

import { AuthNaverService } from './auth-naver.service';

import { AllConfigType } from '../config/config.type';

@Controller('auth/naver')
export class AuthNaverController {
    constructor(
        private readonly authService: AuthService,
        private readonly authNaverService: AuthNaverService,
        private readonly configService: ConfigService<AllConfigType>,
    ) {}

    @Get('login')
    async naverAuthorize(@Res({ passthrough: true }) response: Response): Promise<void> {
        const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${encodeURI(process.env.NAVER_REDIRECT_URI)}&state=naverLoginState`;

        response.redirect(url);
    }

    @Get('callback')
    async naverCallback(@Query('code') authorizeCode, @Res({ passthrough: true }) response: Response) {
        if (!authorizeCode) response.sendStatus(HttpStatus.BAD_REQUEST);

        const socialData = await this.authNaverService.getProfile(authorizeCode);
        const loginData = await this.authService.validateSocialLogin('naver', socialData);

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
