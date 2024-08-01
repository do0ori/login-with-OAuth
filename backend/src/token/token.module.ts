import { Module } from '@nestjs/common';

import { JwtModule, JwtService } from '@nestjs/jwt';

import { TokenService } from './token.service';

@Module({
    imports: [JwtModule.register({})],
    providers: [TokenService, JwtService],
    exports: [TokenService, JwtService],
})
export class TokenModule {}
