import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SocialData } from 'src/auth/interfaces/social-data.interface';
import { AllConfigType } from 'src/config/config.type';

import { NaverToken } from './interfaces/naver-token.interface';
import { NaverUserInfo } from './interfaces/naver-user-info.interface';

import { SocialConfig } from '../auth/types/social-config.type';

@Injectable()
export class AuthNaverService {
    private naver: SocialConfig;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService<AllConfigType>,
    ) {
        this.naver = this.configService.getOrThrow('naver', { infer: true });
    }

    private readonly logger = new Logger(AuthNaverService.name);

    async getProfile(authorizeCode: string): Promise<SocialData> {
        const { access_token: accessToken } = await this.getToken(authorizeCode);
        const userInfo = await this.getUserInfo(accessToken);

        return {
            id: userInfo.response.id,
            name: userInfo.response.nickname,
            email: userInfo.response.email,
            profileImageUrl: userInfo.response.profile_image,
        };
    }

    private async getToken(authorizeCode: string): Promise<NaverToken> {
        const { data } = await firstValueFrom(
            this.httpService.get<NaverToken>(this.naver.tokenAPI, {
                params: {
                    client_id: this.naver.clientId,
                    client_secret: this.naver.clientSecret,
                    code: authorizeCode,
                    grant_type: 'authorization_code',
                    state: 'naverLoginState',
                },
            }),
        );

        return data;
    }

    private async getUserInfo(accessToken: string): Promise<NaverUserInfo> {
        const { data } = await firstValueFrom(
            this.httpService.get<NaverUserInfo>(this.naver.userInfoAPI, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        );

        this.logger.log(data);

        return data;
    }
}
