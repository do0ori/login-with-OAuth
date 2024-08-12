import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AuthGoogleController } from './auth-google.controller';

import { GoogleStrategy } from './strategies/google.strategy';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [HttpModule, ConfigModule, AuthModule],
    controllers: [AuthGoogleController],
    providers: [GoogleStrategy],
})
export class AuthGoogleModule {}
