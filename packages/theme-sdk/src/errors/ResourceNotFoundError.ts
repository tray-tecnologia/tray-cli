import { ApiError } from './ApiError';

export class ResourceNotFoundError extends ApiError {
    constructor(data: object) {
        super({
            code: 'SDK::0005',
            message: 'Request resource not found or nor valid.',
            data,
        });
        this.name = 'ResourceNotFoundError';
    }
}
