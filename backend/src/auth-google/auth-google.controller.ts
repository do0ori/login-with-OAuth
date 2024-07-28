import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { parse } from 'src/utils/ms.util';

import { AuthGoogleService } from './auth-google.service';

import { AllConfigType } from '../config/config.type';

@Controller('auth/google')
export class AuthGoogleController {
    constructor(
        private readonly authService: AuthService,
        private readonly authGoogleService: AuthGoogleService,
        private readonly configService: ConfigService<AllConfigType>,
    ) { }

    @Get('login')
    async googleAuthorize(@Res({ passthrough: true }) response: Response): Promise<void> {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;

        response.redirect(url);
    }

    @Get('callback')
    async googleCallback(@Query('code') authorizeCode, @Res({ passthrough: true }) response: Response) {
        if (!authorizeCode) response.sendStatus(HttpStatus.BAD_REQUEST);

        const socialData = await this.authGoogleService.getProfile(authorizeCode);
        const loginData = await this.authService.validateSocialLogin('google', socialData);

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
