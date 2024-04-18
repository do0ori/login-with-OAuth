import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('api/auth/kakao')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  @Post()
  async kakaoLogin(
    @Body('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.kakaoLogin(code);

    response.cookie('access-token', data['access_token'], {
      httpOnly: true,
      maxAge: data['expires_in'] * 1000, // [ms]
    });
  }

  @Get('/me')
  async kakaoUserInfo(@Req() request: Request) {
    const accessToken = request.cookies['access-token'];

    if (!accessToken) return;

    const data = await this.authService.kakaoUserInfo(accessToken);

    this.logger.log(data);

    return {
      nickname: data.kakao_account.profile.nickname,
      profile_image_url: data.kakao_account.profile.profile_image_url,
      email: data.kakao_account.email,
    };
  }
}
