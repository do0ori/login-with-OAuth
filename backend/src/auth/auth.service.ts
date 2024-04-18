import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(AuthService.name);

  async kakaoLogin(code: string) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        {
          code,
          grant_type: 'authorization_code',
          client_id: process.env.REST_API_KEY,
          redirect_uri: process.env.REDIRECT_URI,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      ),
    );

    return data;
  }

  async kakaoUserInfo(accessToken: string) {
    const { data } = await firstValueFrom(
      this.httpService.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }),
    );

    return data;
  }
}
