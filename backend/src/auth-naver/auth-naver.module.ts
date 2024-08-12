import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AuthNaverController } from './auth-naver.controller';

import { NaverStrategy } from './strategies/naver.strategy';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [HttpModule, ConfigModule, AuthModule],
    controllers: [AuthNaverController],
    providers: [NaverStrategy],
})
export class AuthNaverModule {}
