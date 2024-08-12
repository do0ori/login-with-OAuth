import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { SocialData } from '../../auth/interfaces/social-data.interface';

// TODO: Replace return type any with User type later
export const User = createParamDecorator((data: never, context: ExecutionContext): Promise<any> => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});

export const SocialProfile = createParamDecorator((data: never, context: ExecutionContext): Promise<SocialData> => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});
