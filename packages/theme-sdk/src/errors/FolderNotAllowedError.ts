import { BaseError } from './BaseError';

export class FolderNotAllowedError extends BaseError {
  constructor(folders: string) {
    super({
      code: 'SDK::0009',
      message: `Folder not allowed. Allowed folders: ${folders}.`,
    });
    this.name = 'FolderNotAllowedError';
  }
}
