import { BaseError } from './BaseError';

export class InvalidOrNotSentParamsError extends BaseError {
  constructor(data: object) {
    super({
      code: 'SDK::0003',
      message: 'Required params not sent or invalid param sent.',
      data,
    });
    this.name = 'InvalidOrNotSentParamsError';
  }
}
