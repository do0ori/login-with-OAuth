import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { AuthStrategy } from './strategies/auth.strategy';

import { RefreshStrategy } from './strategies/refresh.strategy';

import { CookieSettingHelper } from '../helpers/cookie-setting.helper';
import { TokenValidationHelper } from '../helpers/token-validation.helper';
import { TokenModule } from '../token/token.module';
import { UsersService } from '../users/users.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        TokenModule,
    ],
    controllers: [AuthController],
    providers: [UsersService, AuthService, CookieSettingHelper, TokenValidationHelper, AuthStrategy, RefreshStrategy],
    exports: [AuthService, CookieSettingHelper],
})
export class AuthModule {}
