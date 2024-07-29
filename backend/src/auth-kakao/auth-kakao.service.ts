import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SocialData } from 'src/auth/interfaces/social-data.interface';
import { AllConfigType } from 'src/config/config.type';

import { KakaoToken } from './interfaces/kakao-token.interface';
import { KakaoUserInfo } from './interfaces/kakao-user-info.interface';

import { SocialConfig } from '../auth/types/social-config.type';

@Injectable()
export class AuthKakaoService {
    private kakao: SocialConfig;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService<AllConfigType>,
    ) {
        this.kakao = this.configService.getOrThrow('kakao', { infer: true });
    }

    private readonly logger = new Logger(AuthKakaoService.name);

    async getProfile(authorizeCode: string): Promise<SocialData> {
        const { access_token: accessToken } = await this.getToken(authorizeCode);
        const userInfo = await this.getUserInfo(accessToken);

        return {
            id: userInfo.id.toString(),
            name: userInfo.properties.nickname,
            email: userInfo.kakao_account.email,
            profileImageUrl: userInfo.properties.profile_image,
        };
    }

    private async getToken(authorizeCode: string): Promise<KakaoToken> {
        const { data } = await firstValueFrom(
            this.httpService.post<KakaoToken>(
                this.kakao.tokenAPI,
                {
                    client_id: this.kakao.clientId,
                    client_secret: this.kakao.clientSecret,
                    code: authorizeCode,
                    grant_type: 'authorization_code',
                    redirect_uri: this.kakao.redirectURI,
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

    private async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
        const { data } = await firstValueFrom(
            this.httpService.get<KakaoUserInfo>(this.kakao.userInfoAPI, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        );

        this.logger.log(data);

        return data;
    }
}
