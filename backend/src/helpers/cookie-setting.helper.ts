import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

import { LoginData } from '../auth/interfaces/login-data.interface';
import { AllConfigType } from '../config/config.type';
import { parse } from '../utils/ms.util';

@Injectable()
export class CookieSettingHelper {
    private readonly baseCookieOptions: CookieOptions;
    private readonly accessCookieOptions: CookieOptions;
    private readonly refreshCookieOptions: CookieOptions;

    constructor(private readonly configService: ConfigService<AllConfigType>) {
        const isProd = this.configService.getOrThrow('app.nodeEnv', { infer: true }) === 'prod';

        this.baseCookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
        };

        this.accessCookieOptions = {
            ...this.baseCookieOptions,
            maxAge: parse(this.configService.getOrThrow('token.accessTokenLifeTime', { infer: true })),
        };

        this.refreshCookieOptions = {
            ...this.baseCookieOptions,
            maxAge: parse(this.configService.getOrThrow('token.refreshTokenLifeTime', { infer: true })),
        };
    }

    setCookies(response: Response, loginData: LoginData): void {
        response.cookie('access_token', loginData.accessToken, this.accessCookieOptions);
        response.cookie('refresh_token', loginData.refreshToken, this.refreshCookieOptions);
        response.cookie('provider', loginData.provider, this.baseCookieOptions);
    }

    clearCookies(response: Response): void {
        response.clearCookie('access_token', this.accessCookieOptions);
        response.clearCookie('refresh_token', this.refreshCookieOptions);
        response.clearCookie('provider', this.baseCookieOptions);
    }
}
