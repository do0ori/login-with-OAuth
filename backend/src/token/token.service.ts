import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenConfig } from './config/token-config.type';
import { AccessTokenPayload } from './interfaces/access-token-payload.interface';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';
import { TokenType } from './types/token.type';

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

    async signAccessToken(user: any): Promise<string> {
        const payload: AccessTokenPayload = {
            id: user.id,
            role: user.role,
            type: 'access',
        };

        const newToken = await this.jwtService.signAsync(payload, {
            secret: this.token.accessSecret,
            expiresIn: this.token.accessTokenLifeTime,
        });

        return newToken;
    }

    async signRefreshToken(user: any): Promise<string> {
        const payload: RefreshTokenPayload = {
            id: user.id,
            type: 'refresh',
        };

        const newToken = await this.jwtService.signAsync(payload, {
            secret: this.token.refreshSecret,
            expiresIn: this.token.refreshTokenLifeTime,
        });

        return newToken;
    }

    async verify(token: string, type: TokenType): Promise<AccessTokenPayload | RefreshTokenPayload> {
        const payload = await this.jwtService.verifyAsync(token, {
            ignoreExpiration: false,
        });

        if (payload.type !== type) {
            throw new UnauthorizedException(`Invalid token type: expected ${type}, but received ${payload.type}`);
        }

        return payload;
    }
}
