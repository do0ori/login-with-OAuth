import { Controller, Get, Logger, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

import { AuthService } from './auth.service';

import { CookieService } from '../utils/cookie-service.util';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
    ) {}

    private readonly logger = new Logger(AuthController.name);

    @Get('kakao')
    async kakaoAuthorize(@Res({ passthrough: true }) response: Response) {
        const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&scope=account_email,profile_nickname,profile_image`;

        response.redirect(url);
    }

    @Get('kakao/callback')
    async kakaoCallback(@Query('code') autherizeCode, @Res({ passthrough: true }) response: Response) {
        if (!autherizeCode) response.sendStatus(400);

        const data = await this.authService.kakaoLogin(autherizeCode);

        const newToken = this.authService.signToken(data['access_token'], data['expires_in'], 'kakao');

        response.cookie('access-token', newToken, {
            httpOnly: true,
            maxAge: data['expires_in'] * 1000, // [ms]
        });

        response.redirect('http://localhost:3000/me');
    }

    @Get('naver')
    async naverAuthorize(@Res({ passthrough: true }) response: Response) {
        const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${encodeURI(process.env.NAVER_REDIRECT_URI)}&state=naverLoginState`;

        response.redirect(url);
    }

    @Get('naver/callback')
    async naverCallback(@Query('code') autherizeCode, @Res({ passthrough: true }) response: Response) {
        if (!autherizeCode) response.sendStatus(400);

        const data = await this.authService.naverLogin(autherizeCode);

        const newToken = this.authService.signToken(data['access_token'], data['expires_in'], 'naver');

        response.cookie('access-token', newToken, {
            httpOnly: true,
            maxAge: data['expires_in'] * 1000, // [ms]
        });

        response.redirect('http://localhost:3000/me');
    }

    @Get('google')
    async googleAuthorize(@Res({ passthrough: true }) response: Response) {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;

        response.redirect(url);
    }

    @Get('google/callback')
    async googleCallback(@Query('code') autherizeCode, @Res({ passthrough: true }) response: Response) {
        if (!autherizeCode) response.sendStatus(400);

        const data = await this.authService.googleLogin(autherizeCode);

        const newToken = this.authService.signToken(data['access_token'], data['expires_in'], 'google');

        response.cookie('access-token', newToken, {
            httpOnly: true,
            maxAge: data['expires_in'] * 1000, // [ms]
        });

        response.redirect('http://localhost:3000/me');
    }

    @Get('/me')
    async userInfo(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const accessToken = request.cookies['access-token'];

        if (!accessToken) response.sendStatus(400);

        const oauthAccessToken = this.authService.decodeToken(accessToken);

        this.logger.log(`provider: ${oauthAccessToken.provider}`);
        switch (oauthAccessToken.provider) {
            case 'kakao':
                const kakaoData = await this.authService.kakaoUserInfo(oauthAccessToken.oauthAccessToken);

                return {
                    name: kakaoData.kakao_account.name || kakaoData.kakao_account.profile.nickname,
                    profile_image_url: kakaoData.kakao_account.profile.profile_image_url,
                    email: kakaoData.kakao_account.email,
                };
            case 'naver':
                const naverData = await this.authService.naverUserInfo(oauthAccessToken.oauthAccessToken);

                return {
                    name: naverData.response.name || naverData.response.nickname,
                    profile_image_url: naverData.response.profile_image,
                    email: naverData.response.email,
                };
            case 'google':
                const googleData = await this.authService.googleUserInfo(oauthAccessToken.oauthAccessToken);

                return {
                    name: googleData.name,
                    profile_image_url: googleData.picture,
                    email: googleData.email,
                };
        }
    }

    @Get('logout')
    async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
        this.cookieService.clearCookies(response);

        response.redirect('http://localhost:3000/');
    }
}
