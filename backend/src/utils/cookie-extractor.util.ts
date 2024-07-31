import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';

/**
 * Creates an extractor function to retrieve a token from a field in the request cookie.
 *
 * @param {string} field_name - The name of the field to extract the token from.
 * @returns {JwtFromRequestFunction} A function that takes a request object and returns the extracted token.
 */
export function fromCookie(field_name: string): JwtFromRequestFunction {
    return (req: Request) => {
        let token = null;
        if (req.cookies && field_name in req.cookies && req.cookies[field_name].length > 0) {
            token = req.cookies[field_name];
        }
        return token;
    };
}
