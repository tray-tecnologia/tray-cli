import { ApiError } from './ApiError';

export class InvalidLayoutError extends ApiError {
    constructor(data: object) {
        super({
            code: 'SDK::0004',
            message: 'Invalid layout passed. Please verify and try again.',
            data,
        });
        this.name = 'InvalidLayoutError';
    }
}
