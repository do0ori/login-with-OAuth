import { Injectable, Logger } from '@nestjs/common';

import { LoginAuthDto, TokenAuthDto } from './dto/auth.dto';
import { SocialProfileDto } from './dto/social-profile.dto';

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

    private readonly logger = new Logger(AuthService.name);

    async validateSocialLogin(socialProfileDto: SocialProfileDto): Promise<LoginAuthDto> {
        let user = await this.usersService.findBySocialId(socialProfileDto.id);

        if (!user) {
            user = await this.usersService.create({
                socialId: socialProfileDto.id,
                email: socialProfileDto.email,
                name: socialProfileDto.name,
                profileImageUrl: socialProfileDto.profileImageUrl,
                provider: socialProfileDto.provider,
                role: ROLE.User,
                status: STATUS.Active,
            });

            await this.userTokenService.create({ userId: user.id });
        }

        const { accessToken, refreshToken } = await this.generateAndSaveTokens(user);

        return {
            accessToken,
            refreshToken,
            provider: socialProfileDto.provider,
        };
    }

    async generateAndSaveTokens(user: any): Promise<TokenAuthDto> {
        const { token: accessToken } = await this.tokenService.signAccessToken(user);
        const { token: refreshToken, iat, exp } = await this.tokenService.signRefreshToken(user);

        await this.userTokenService.update(user.id, { iat, exp });
        this.logger.debug(`Refresh token data successfully updated for user: ${user.id}`);

        return {
            accessToken,
            refreshToken,
        };
    }

    async deleteRefreshTokenData(user: any): Promise<void> {
        await this.userTokenService.update(user.id, { iat: null, exp: null });
        this.logger.debug(`Refresh token data successfully deleted for user: ${user.id}`);
    }
}
