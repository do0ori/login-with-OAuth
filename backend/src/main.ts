import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService<AllConfigType>);

    app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
        exclude: ['/'],
    });

    app.enableCors({
        origin: [configService.getOrThrow('app.frontendDomain', { infer: true })],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        credentials: true,
    });

    app.use(cookieParser());

    await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
bootstrap();
