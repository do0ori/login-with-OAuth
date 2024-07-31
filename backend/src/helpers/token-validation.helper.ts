import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AccessTokenPayload } from '../token/interfaces/access-token-payload.interface';
import { RefreshTokenPayload } from '../token/interfaces/refresh-token-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokenValidationHelper {
    constructor(private readonly usersService: UsersService) {}

    // TODO: Add return type User after implement User entity
    async validatePayload(payload: AccessTokenPayload | RefreshTokenPayload) {
        if (!payload.id) {
            throw new UnauthorizedException();
        }

        const user = await this.usersService.findById(payload.id);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
