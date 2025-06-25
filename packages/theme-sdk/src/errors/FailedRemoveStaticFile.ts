import { BaseError } from './BaseError';

export class FailedRemoveStaticFile extends BaseError {
  constructor(data: object) {
    super({
      code: 'SDK::0006',
      message: 'Failed to remove static file. Please try again in few moments.',
      data,
    });
    this.name = 'FailedRemoveStaticFile';
  }
}
