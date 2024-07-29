import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { TokenModule } from '../token/token.module';
import { UsersService } from '../users/users.service';
import { CookieService } from '../utils/cookie-service.util';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        JwtModule.register({
            global: true,
            secret: 'my_secret',
        }),
        TokenModule,
    ],
    controllers: [AuthController],
    providers: [UsersService, AuthService, CookieService],
    exports: [AuthService, CookieService],
})
export class AuthModule {}
