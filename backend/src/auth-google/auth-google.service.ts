import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SocialData } from 'src/auth/interfaces/social-data.interface';
import { AllConfigType } from 'src/config/config.type';

import { GoogleConfig } from './config/google-config.type';
import { GoogleToken } from './interfaces/google-token.interface';
import { GoogleUserInfo } from './interfaces/google-user-info.interface';

@Injectable()
export class AuthGoogleService {
    private google: GoogleConfig;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService<AllConfigType>,
    ) {
        this.google = this.configService.getOrThrow('google', { infer: true });
    }

    private readonly logger = new Logger(AuthGoogleService.name);

    async getProfile(authorizeCode: string): Promise<SocialData> {
        const { access_token: accessToken } = await this.getToken(authorizeCode);
        const userInfo = await this.getUserInfo(accessToken);

        return {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            profileImageUrl: userInfo.picture,
        };
    }

    private async getToken(authorizeCode: string): Promise<GoogleToken> {
        const { data } = await firstValueFrom(
            this.httpService.post<GoogleToken>(this.google.tokenAPI, {
                client_id: this.google.clientId,
                client_secret: this.google.clientSecret,
                code: authorizeCode,
                grant_type: 'authorization_code',
                redirect_uri: this.google.redirectURI,
            }),
        );

        return data;
    }

    private async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
        const { data } = await firstValueFrom(
            this.httpService.get<GoogleUserInfo>(this.google.userInfoAPI, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        );

        this.logger.log(data);

        return data;
    }
}
