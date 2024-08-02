import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { AuthStrategy } from './strategies/auth.strategy';

import { RefreshStrategy } from './strategies/refresh.strategy';

import { CookieSettingHelper } from '../helpers/cookie-setting.helper';
import { TokenValidationHelper } from '../helpers/token-validation.helper';
import { TokenModule } from '../token/token.module';
import { UserTokenService } from '../userToken/userToken.service';
import { UsersService } from '../users/users.service';

@Module({
    imports: [TokenModule],
    controllers: [AuthController],
    providers: [
        UsersService,
        AuthService,
        UserTokenService,
        CookieSettingHelper,
        TokenValidationHelper,
        AuthStrategy,
        RefreshStrategy,
    ],
    exports: [AuthService, CookieSettingHelper],
})
export class AuthModule {}
