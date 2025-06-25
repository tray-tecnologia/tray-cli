import { BaseError } from './BaseError';

export class InvalidLayoutError extends BaseError {
  constructor(data: object) {
    super({
      code: 'SDK::0004',
      message: 'Invalid layout passed. Please verify and try again.',
      data,
    });
    this.name = 'InvalidLayoutError';
  }
}
