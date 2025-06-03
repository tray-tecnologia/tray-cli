import { ApiError } from './ApiError';

export class SubfolderNotAllowedError extends ApiError {
    constructor(subfolders: string) {
        super({
            code: 'SDK::0010',
            message: `Subfolders not allowed in this folder. Folders that allow subfolders: ${subfolders}.`,
        });
        this.name = 'SubfolderNotAllowedError';
    }
}
