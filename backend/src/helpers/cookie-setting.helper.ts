import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

import { LoginAuthDto, TokenAuthDto } from '../auth/dto/auth.dto';
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

    setCookies(response: Response, authDto: TokenAuthDto | LoginAuthDto): void {
        response.cookie('access_token', authDto.accessToken, this.accessCookieOptions);
        response.cookie('refresh_token', authDto.refreshToken, this.refreshCookieOptions);

        if ('provider' in authDto) {
            response.cookie('provider', authDto.provider, this.baseCookieOptions);
        }
    }

    clearCookies(response: Response): void {
        response.clearCookie('access_token', this.accessCookieOptions);
        response.clearCookie('refresh_token', this.refreshCookieOptions);
        response.clearCookie('provider', this.baseCookieOptions);
    }
}
