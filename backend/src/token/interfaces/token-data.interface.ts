import { DefaultTokenPayload } from './default-token-payload.interface';

export interface TokenData extends DefaultTokenPayload {
    token: string;
}
