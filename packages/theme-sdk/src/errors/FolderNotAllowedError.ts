import { BaseError } from './BaseError';

export class FolderNotAllowedError extends BaseError {
  constructor(details: string) {
    super({
      code: 'SDK::0009',
      message: `Folder not allowed. ${details}.`,
    });
    this.name = 'FolderNotAllowedError';
  }
}
