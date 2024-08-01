import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

import { AuthService } from './auth.service';

import { JwtAuthGuard } from './guards/auth.guard';

import { JwtRefreshGuard } from './guards/refresh.guard';

import { CookieSettingHelper } from '../helpers/cookie-setting.helper';
import { User } from '../users/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly cookieSettingHelper: CookieSettingHelper,
    ) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    // TODO: Replace return type any with User type and move this method to UsersController later,
    async getUserInfo(@User() user: any | never) {
        return user;
    }

    @Get('refresh')
    @UseGuards(JwtRefreshGuard)
    // TODO: Implement refreshAccessToken method
    async refreshAccessToken() {}

    @Get('logout')
    async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
        this.cookieSettingHelper.clearCookies(response);

        response.redirect('http://localhost:3000/');
    }
}
