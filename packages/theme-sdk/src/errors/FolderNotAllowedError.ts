import { ApiError } from './ApiError';

export class FolderNotAllowedError extends ApiError {
    constructor(folders: string) {
        super({
            code: 'SDK::0009',
            message: `Folder not allowed. Allowed folders: ${folders}.`,
        });
        this.name = 'FolderNotAllowedError';
    }
}
