import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AuthNaverController } from './auth-naver.controller';
import { AuthNaverService } from './auth-naver.service';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [HttpModule, ConfigModule, AuthModule],
    controllers: [AuthNaverController],
    providers: [AuthNaverService],
    exports: [AuthNaverService],
})
export class AuthNaverModule {}
