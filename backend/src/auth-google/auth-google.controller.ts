import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { AuthGoogleService } from './auth-google.service';

import { AllConfigType } from '../config/config.type';
import { CookieService } from '../utils/cookie-service.util';

@Controller('auth/google')
export class AuthGoogleController {
    constructor(
        private readonly authService: AuthService,
        private readonly authGoogleService: AuthGoogleService,
        private readonly configService: ConfigService<AllConfigType>,
        private readonly cookieService: CookieService,
    ) {}

    @Get('login')
    async googleAuthorize(@Res({ passthrough: true }) response: Response): Promise<void> {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.configService.getOrThrow('google.clientId', { infer: true })}&redirect_uri=${this.configService.getOrThrow('google.redirectURI', { infer: true })}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;

        response.redirect(url);
    }

    @Get('callback')
    async googleCallback(@Query('code') authorizeCode, @Res({ passthrough: true }) response: Response) {
        if (!authorizeCode) response.sendStatus(HttpStatus.BAD_REQUEST);

        const socialData = await this.authGoogleService.getProfile(authorizeCode);
        const loginData = await this.authService.validateSocialLogin('google', socialData);

        this.cookieService.setCookies(response, loginData);

        response.redirect('http://localhost:3000/me');
    }
}
