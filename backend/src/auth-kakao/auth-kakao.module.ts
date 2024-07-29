import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AuthKakaoController } from './auth-kakao.controller';
import { AuthKakaoService } from './auth-kakao.service';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [HttpModule, ConfigModule, AuthModule],
    controllers: [AuthKakaoController],
    providers: [AuthKakaoService],
    exports: [AuthKakaoService],
})
export class AuthKakaoModule {}
