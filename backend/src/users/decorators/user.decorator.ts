import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// TODO: Replace return type any with User type later
export const User = createParamDecorator((data: never, context: ExecutionContext): Promise<any> => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});
