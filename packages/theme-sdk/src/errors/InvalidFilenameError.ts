import { BaseError } from './BaseError';

export class InvalidFilenameError extends BaseError {
  constructor() {
    super({
      code: 'SDK::0010',
      message: `The filename contains invalid characters. Only letters, numbers, ".", "_" and "-" are allowed.`,
    });
    this.name = 'InvalidFilenameError';
  }
}
