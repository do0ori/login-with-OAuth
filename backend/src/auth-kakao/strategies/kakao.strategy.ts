import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Profile, Strategy } from 'passport-kakao';

import { AllConfigType } from '../../config/config.type';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(configService: ConfigService<AllConfigType>) {
        super({
            clientID: configService.getOrThrow('kakao.clientId', { infer: true }),
            clientSecret: configService.getOrThrow('kakao.clientSecret', { infer: true }),
            callbackURL: configService.getOrThrow('kakao.redirectURI', { infer: true }),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const { id, displayName, _json, provider } = profile;
        const user = {
            id: id.toString(),
            name: displayName,
            email: _json.kakao_account.email,
            profileImageUrl: _json.properties.profile_image,
            provider,
        };
        return user;
    }
}
