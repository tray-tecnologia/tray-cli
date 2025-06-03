import { ApiError } from './ApiError';

export class UnknownError extends ApiError {
    constructor(message?: string) {
        super({
            code: 'SDK::9999',
            message: message ?? 'Unable to process request. Please try again in few moments.',
        });
        this.name = 'UnknownError';
    }
}
