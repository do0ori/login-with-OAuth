import { IntersectionType } from '@nestjs/mapped-types';
import { IsIn, IsString } from 'class-validator';

import { AUTH_PROVIDERS, AuthProvider } from '../types/auth-providers.type';

export class TokenAuthDto {
    @IsString()
    accessToken: string;

    @IsString()
    refreshToken: string;
}

export class LoginAuthDto extends IntersectionType(TokenAuthDto) {
    @IsIn(AUTH_PROVIDERS)
    provider: AuthProvider;
}
