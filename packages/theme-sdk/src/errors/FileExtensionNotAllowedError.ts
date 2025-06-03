import { ApiError } from './ApiError';

export class FileExtensionNotAllowedError extends ApiError {
    constructor(extensions: string) {
        super({
            code: 'SDK::0008',
            message: `File extension not allowed. Allowed extensions: ${extensions}.`,
        });
        this.name = 'FileExtensionNotAllowedError';
    }
}
