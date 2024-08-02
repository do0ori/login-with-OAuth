import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { TokenConfig } from './config/token-config.type';
import { AccessTokenPayload } from './interfaces/access-token-payload.interface';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';

import { TokenData } from './interfaces/token-data.interface';

import { AllConfigType } from '../config/config.type';

@Injectable()
export class TokenService {
    private token: TokenConfig;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<AllConfigType>,
    ) {
        this.token = this.configService.getOrThrow('token', { infer: true });
    }

    async signAccessToken(user: any): Promise<TokenData> {
        const payload: AccessTokenPayload = {
            id: user.id,
            role: user.role,
            type: 'access',
        };

        return this.signToken(payload, {
            secret: this.token.accessSecret,
            expiresIn: this.token.accessTokenLifeTime,
        });
    }

    async signRefreshToken(user: any): Promise<TokenData> {
        const payload: RefreshTokenPayload = {
            id: user.id,
            type: 'refresh',
        };

        return this.signToken(payload, {
            secret: this.token.refreshSecret,
            expiresIn: this.token.refreshTokenLifeTime,
        });
    }

    private async signToken(payload: Buffer | object, options?: JwtSignOptions): Promise<TokenData> {
        const token = await this.jwtService.signAsync(payload, options);
        const { iat, exp } = this.jwtService.decode(token);

        return { token, iat, exp };
    }
}
