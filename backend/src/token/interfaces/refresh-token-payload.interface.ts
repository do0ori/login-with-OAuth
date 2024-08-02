import { DefaultTokenPayload } from './default-token-payload.interface';

export interface RefreshTokenPayload extends Partial<DefaultTokenPayload> {
    id: number;
    type: 'refresh';
}
