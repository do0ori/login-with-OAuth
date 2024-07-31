import { ExtractJwt as OriginalExtractJwt } from 'passport-jwt';

import { fromCookie } from '../utils/cookie-extractor.util';

declare module 'passport-jwt' {
    namespace ExtractJwt {
        export function fromCookie(field_name: string): JwtFromRequestFunction;
    }
}

OriginalExtractJwt.fromCookie = fromCookie;
