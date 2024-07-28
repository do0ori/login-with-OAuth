import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import googleConfig from './auth-google/config/google.config';
import appConfig from './config/app.config';
import tokenConfig from './token/config/token.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, tokenConfig, googleConfig],
            envFilePath: ['.env'],
        }),
        AuthModule,
        AuthGoogleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
