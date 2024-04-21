import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'my secret',
    }),
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
})
export class AuthModule {}
