import { DefaultTokenPayload } from './default-token-payload.interface';

import { Role } from '../../users/types/role.type';

export interface AccessTokenPayload extends Partial<DefaultTokenPayload> {
    id: number;
    role: Role;
    type: 'access';
}
