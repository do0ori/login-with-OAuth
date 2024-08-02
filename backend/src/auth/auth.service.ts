import { Injectable } from '@nestjs/common';

import { LoginData } from './interfaces/login-data.interface';
import { SocialData } from './interfaces/social-data.interface';

import { OauthProvider } from './types/auth-providers.type';

import { TokenService } from '../token/token.service';
import { UserTokenService } from '../userToken/userToken.service';
import { ROLE } from '../users/types/role.type';
import { STATUS } from '../users/types/status.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly usersService: UsersService,
        private readonly userTokenService: UserTokenService,
    ) {}

    async validateSocialLogin(provider: OauthProvider, socialData: SocialData): Promise<LoginData> {
        let user = await this.usersService.findBySocialId(socialData.id);

        if (!user) {
            user = await this.usersService.create({
                socialId: socialData.id,
                email: socialData.email,
                name: socialData.name,
                profileImageUrl: socialData.profileImageUrl,
                provider,
                role: ROLE.User,
                status: STATUS.Active,
            });

            await this.userTokenService.create({ userId: user.id });
        }

        const { token: accessToken } = await this.tokenService.signAccessToken(user);
        const { token: refreshToken, iat, exp } = await this.tokenService.signRefreshToken(user);

        await this.userTokenService.update(user.id, { iat, exp });

        return {
            accessToken,
            refreshToken,
            provider,
        };
    }
}
