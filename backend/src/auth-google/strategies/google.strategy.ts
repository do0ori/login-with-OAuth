import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { AllConfigType } from '../../config/config.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(configService: ConfigService<AllConfigType>) {
        super({
            clientID: configService.getOrThrow('google.clientId', { infer: true }),
            clientSecret: configService.getOrThrow('google.clientSecret', { infer: true }),
            callbackURL: configService.getOrThrow('google.redirectURI', { infer: true }),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const { id, displayName, emails, photos, provider } = profile;
        const user = {
            id,
            name: displayName,
            email: emails[0].value,
            profileImageUrl: photos[0].value,
            provider,
        };
        return user;
    }
}
