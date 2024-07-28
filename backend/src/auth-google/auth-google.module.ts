import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [HttpModule, ConfigModule, AuthModule],
    controllers: [AuthGoogleController],
    providers: [AuthGoogleService],
    exports: [AuthGoogleService],
})
export class AuthGoogleModule {}
