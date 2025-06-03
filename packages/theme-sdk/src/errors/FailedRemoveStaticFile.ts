import { ApiError } from './ApiError';

export class FailedRemoveStaticFile extends ApiError {
    constructor(data: object) {
        super({
            code: 'SDK::0006',
            message: 'Failed to remove static file. Please try again in few moments.',
            data,
        });
        this.name = 'FailedRemoveStaticFile';
    }
}
