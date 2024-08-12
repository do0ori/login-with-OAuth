import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AuthKakaoController } from './auth-kakao.controller';

import { KakaoStrategy } from './strategies/kakao.strategy';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [HttpModule, ConfigModule, AuthModule],
    controllers: [AuthKakaoController],
    providers: [KakaoStrategy],
})
export class AuthKakaoModule {}
