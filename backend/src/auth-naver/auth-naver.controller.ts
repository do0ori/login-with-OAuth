import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { AuthNaverService } from './auth-naver.service';

import { AllConfigType } from '../config/config.type';
import { CookieService } from '../utils/cookie-service.util';

@Controller('auth/naver')
export class AuthNaverController {
    constructor(
        private readonly authService: AuthService,
        private readonly authNaverService: AuthNaverService,
        private readonly configService: ConfigService<AllConfigType>,
        private readonly cookieService: CookieService,
    ) {}

    @Get('login')
    async naverAuthorize(@Res({ passthrough: true }) response: Response): Promise<void> {
        const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${this.configService.getOrThrow('naver.clientId', { infer: true })}&redirect_uri=${encodeURI(this.configService.getOrThrow('naver.redirectURI', { infer: true }))}&state=naverLoginState`;

        response.redirect(url);
    }

    @Get('callback')
    async naverCallback(@Query('code') authorizeCode, @Res({ passthrough: true }) response: Response) {
        if (!authorizeCode) response.sendStatus(HttpStatus.BAD_REQUEST);

        const socialData = await this.authNaverService.getProfile(authorizeCode);
        const loginData = await this.authService.validateSocialLogin('naver', socialData);

        this.cookieService.setCookies(response, loginData);

        response.redirect('http://localhost:3000/me');
    }
}
