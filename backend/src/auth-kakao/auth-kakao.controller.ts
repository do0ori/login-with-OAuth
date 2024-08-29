import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { SocialProfileDto } from '../auth/dto/social-profile.dto';
import { CookieSettingHelper } from '../helpers/cookie-setting.helper';
import { SocialProfile } from '../users/decorators/user.decorator';

@Controller('auth/kakao')
export class AuthKakaoController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookieSettingHelper: CookieSettingHelper,
    ) {}

    @Get('login')
    @UseGuards(AuthGuard('kakao'))
    async googleAuthorize(): Promise<void> {}

    @Get('callback')
    @UseGuards(AuthGuard('kakao'))
    async googleCallback(
        @SocialProfile() socialProfileDto: SocialProfileDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        const loginAuthDto = await this.authService.validateSocialLogin(socialProfileDto);
        this.cookieSettingHelper.setCookies(response, loginAuthDto);
        response.redirect('http://localhost:3000/me');
    }
}
