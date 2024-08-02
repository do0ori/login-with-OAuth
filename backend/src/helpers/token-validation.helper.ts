import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { AccessTokenPayload } from '../token/interfaces/access-token-payload.interface';
import { RefreshTokenPayload } from '../token/interfaces/refresh-token-payload.interface';
import { UserTokenService } from '../userToken/userToken.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokenValidationHelper {
    constructor(
        private readonly usersService: UsersService,
        private readonly userTokenService: UserTokenService,
    ) {}

    private readonly logger = new Logger(TokenValidationHelper.name);

    // TODO: Add return type User after implement User entity
    async validatePayload(payload: AccessTokenPayload | RefreshTokenPayload): Promise<any | never> {
        this.logger.log(payload);

        if (!Number.isInteger(payload.id) || payload.id < 0) {
            this.logger.warn('Payload does not contain a valid user ID.');
            throw new UnauthorizedException('Invalid token.');
        }

        const user = await this.usersService.findById(payload.id);
        if (!user) {
            this.logger.warn(`No user found with ID: ${payload.id}`);
            throw new UnauthorizedException('Invalid token.');
        }

        if (payload.type === 'refresh') {
            const { iat, exp } = await this.userTokenService.find(user.id);
            if (payload.iat !== iat || payload.exp !== exp) {
                this.logger.warn(`Token iat or exp does not match for user ID: ${user.id}`);
                // TODO: Need reathentication -> use cutom error and clear cookie using custom interceptor
                throw new UnauthorizedException('Invalid token.');
            }
        }

        return user;
    }
}
