import { BaseError } from './BaseError';

export class FailedConfigurationError extends BaseError {
  constructor(data: object) {
    super({
      code: 'SDK::0002',
      message:
        'Theme configuration incorrect, maybe theme id is not valid. Please verify and try again.',
      data,
    });
    this.name = 'FailedConfigurationError';
  }
}
