import { Role } from '../../users/types/role.type';

export interface AccessTokenPayload {
    id: number;
    role: Role;
    type: 'access';
}
