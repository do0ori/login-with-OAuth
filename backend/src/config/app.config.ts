import { registerAs } from '@nestjs/config';

import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

import { AppConfig } from './app-config.type';

import validateConfig from '../utils/validate-config.util';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariablesValidator {
    @IsEnum(Environment)
    @IsOptional()
    NODE_ENV: Environment;

    @IsUrl({ require_tld: false })
    @IsOptional()
    FRONTEND_DOMAIN: string;

    @IsUrl({ require_tld: false })
    @IsOptional()
    BACKEND_DOMAIN: string;

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsOptional()
    APP_PORT: number;

    @IsString()
    @IsOptional()
    API_PREFIX: string;
}

export default registerAs<AppConfig>('app', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        nodeEnv: process.env.NODE_ENV || 'development',
        name: process.env.APP_NAME || 'app',
        workingDirectory: process.env.PWD || process.cwd(),
        frontendDomain: process.env.FRONTEND_DOMAIN ?? 'http://localhost:3000',
        backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
        port: process.env.APP_PORT
            ? parseInt(process.env.APP_PORT, 10)
            : process.env.PORT
              ? parseInt(process.env.PORT, 10)
              : 3000,
        apiPrefix: process.env.API_PREFIX || 'api',
    };
});
