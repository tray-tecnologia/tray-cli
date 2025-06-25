import { BaseError } from './BaseError';

export class ResourceNotFoundError extends BaseError {
  constructor(data: object) {
    super({
      code: 'SDK::0005',
      message: 'Request resource not found or nor valid.',
      data,
    });
    this.name = 'ResourceNotFoundError';
  }
}
