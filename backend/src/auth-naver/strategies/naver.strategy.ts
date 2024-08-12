import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Profile, Strategy } from 'passport-naver';

import { AllConfigType } from '../../config/config.type';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor(configService: ConfigService<AllConfigType>) {
        super({
            clientID: configService.getOrThrow('naver.clientId', { infer: true }),
            clientSecret: configService.getOrThrow('naver.clientSecret', { infer: true }),
            callbackURL: configService.getOrThrow('naver.redirectURI', { infer: true }),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const { id, _json, provider } = profile;
        const user = {
            id,
            name: _json.nickname,
            email: _json.email,
            profileImageUrl: _json.profile_image,
            provider,
        };
        return user;
    }
}
