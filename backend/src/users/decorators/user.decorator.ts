import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { SocialProfileDto } from '../../auth/dto/social-profile.dto';

// TODO: Replace return type any with User type later
export const User = createParamDecorator((data: never, context: ExecutionContext): Promise<any> => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});

export const SocialProfile = createParamDecorator(
    (data: never, context: ExecutionContext): Promise<SocialProfileDto> => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);
