import { BaseError } from './BaseError';

export class SubfolderNotAllowedError extends BaseError {
  constructor(subfolders: string) {
    super({
      code: 'SDK::0010',
      message: `Subfolders not allowed in this folder. Folders that allow subfolders: ${subfolders}.`,
    });
    this.name = 'SubfolderNotAllowedError';
  }
}
