import { BaseError } from './BaseError';

export class FileExtensionNotAllowedError extends BaseError {
  constructor(extensions: string) {
    super({
      code: 'SDK::0008',
      message: `File extension not allowed. Allowed extensions: ${extensions}.`,
    });
    this.name = 'FileExtensionNotAllowedError';
  }
}
