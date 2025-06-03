import { ApiError } from './ApiError';

export class AuthenticationError extends ApiError {
    constructor(details: string, data: object) {
        super({
            code: 'SDK::0001',
            message: 'Key or password incorrect. Please verify and try again.',
            details,
            data,
        });
        this.name = 'AuthenticationError';
    }
}
