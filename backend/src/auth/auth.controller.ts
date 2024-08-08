import { Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';

import { JwtAuthGuard } from './guards/auth.guard';

import { JwtRefreshGuard } from './guards/refresh.guard';

import { CookieSettingHelper } from '../helpers/cookie-setting.helper';
import { User } from '../users/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookieSettingHelper: CookieSettingHelper,
    ) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    // TODO: Replace return type any with User type and move this method to UsersController later,
    async getUserInfo(@User() user: any): Promise<any | never> {
        return user;
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    async refreshAccessToken(@User() user: any, @Res({ passthrough: true }) response: Response): Promise<void> {
        const tokenData = await this.authService.generateAndSaveTokens(user);

        this.cookieSettingHelper.setCookies(response, tokenData);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@User() user: any, @Res({ passthrough: true }) response: Response): Promise<void> {
        await this.authService.deleteRefreshTokenData(user);

        this.cookieSettingHelper.clearCookies(response);
    }
}
