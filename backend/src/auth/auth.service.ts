import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

import { LoginData } from './interfaces/login-data.interface';
import { SocialData } from './interfaces/social-data.interface';

import { OauthProvider } from './types/auth-providers.type';

import { TokenService } from '../token/token.service';
import { ROLE } from '../users/types/role.type';
import { STATUS } from '../users/types/status.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly httpService: HttpService,
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(AuthService.name);

    signToken(oauthAccessToken: string, expiresIn: number, provider: 'kakao' | 'naver' | 'google') {
        const newToken = this.jwtService.sign(
            {
                oauthAccessToken,
                provider,
            },
            {
                expiresIn, // [s]
            },
        );

        return newToken;
    }

    decodeToken(token: string) {
        const data = this.jwtService.verify<{
            oauthAccessToken: string;
            provider: string;
        }>(token);

        return data;
    }

    async kakaoLogin(autherizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(
                'https://kauth.kakao.com/oauth/token',
                {
                    code: autherizeCode,
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_REST_API_KEY,
                    redirect_uri: process.env.KAKAO_REDIRECT_URI,
                    client_secret: process.env.KAKAO_CLIENT_SECRET,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                },
            ),
        );

        return data;
    }

    async kakaoUserInfo(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            }),
        );

        this.logger.log(data);

        return data;
    }

    async naverLogin(autherizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(
                `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&code=${autherizeCode}&state=naverLoginState`,
            ),
        );

        return data;
    }

    async naverUserInfo(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get('https://openapi.naver.com/v1/nid/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        );

        this.logger.log(data);

        return data;
    }

    async googleLogin(autherizeCode: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(`https://oauth2.googleapis.com/token`, {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code: autherizeCode,
                grant_type: 'authorization_code',
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            }),
        );

        return data;
    }

    async googleUserInfo(accessToken: string) {
        const { data } = await firstValueFrom(
            this.httpService.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        );

        this.logger.log(data);

        return data;
    }

    async validateSocialLogin(provider: OauthProvider, socialData: SocialData): Promise<LoginData> {
        let user = await this.usersService.findBySocialId(socialData.id);

        if (!user) {
            user = await this.usersService.create({
                socialId: socialData.id,
                email: socialData.email,
                name: socialData.name,
                provider,
                role: ROLE.User,
                status: STATUS.Active,
            });

            user = await this.usersService.findById(user.id);
        }

        const accessToken = await this.tokenService.signAccessToken(user);
        const refreshToken = await this.tokenService.signRefreshToken(user);

        return {
            accessToken,
            refreshToken,
            provider,
        };
    }
}
