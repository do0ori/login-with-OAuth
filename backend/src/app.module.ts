import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import googleConfig from './auth-google/config/google.config';
import { AuthKakaoModule } from './auth-kakao/auth-kakao.module';
import kakaoConfig from './auth-kakao/config/kakao.config';
import { AuthNaverModule } from './auth-naver/auth-naver.module';
import naverConfig from './auth-naver/config/naver.config';
import appConfig from './config/app.config';
import tokenConfig from './token/config/token.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, tokenConfig, googleConfig, kakaoConfig, naverConfig],
            envFilePath: ['.env'],
        }),
        AuthModule,
        AuthGoogleModule,
        AuthKakaoModule,
        AuthNaverModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
