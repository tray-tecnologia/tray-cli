import { BaseError } from './BaseError';

export class FailedRemoveDynamicFile extends BaseError {
  constructor(data: object) {
    super({
      code: 'SDK::0007',
      message: 'Failed to remove dynamic file. Please try again in few moments.',
      data,
    });
    this.name = 'FailedRemoveDynamicFile';
  }
}
