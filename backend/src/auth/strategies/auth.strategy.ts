import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import { AllConfigType } from '../../config/config.type';
import { TokenValidationHelper } from '../../helpers/token-validation.helper';
import { AccessTokenPayload } from '../../token/interfaces/access-token-payload.interface';

@Injectable()
export class AuthStrategy extends PassportStrategy(JwtStrategy, 'auth') {
    constructor(
        private readonly tokenValidationHelper: TokenValidationHelper,
        configService: ConfigService<AllConfigType>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromCookie('access_token'),
            secretOrKey: configService.get('token.accessSecret', { infer: true }),
        });
    }

    // TODO: Replace return type any with User type later
    async validate(payload: AccessTokenPayload): Promise<any | never> {
        return this.tokenValidationHelper.validatePayload(payload);
    }
}
