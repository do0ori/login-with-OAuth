import { IsEmail, IsIn, IsString, IsUrl } from 'class-validator';

import { AUTH_PROVIDERS, AuthProvider } from '../types/auth-providers.type';

export class SocialProfileDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsUrl()
    profileImageUrl: string;

    @IsIn(AUTH_PROVIDERS)
    provider: AuthProvider;
}
