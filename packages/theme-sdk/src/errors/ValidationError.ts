import { ResponseError } from './ResponseError';

export class ValidationError extends ResponseError {
  constructor(body: unknown) {
    super({
      code: 'SDK::0002',
      message: 'Provided data was invalid or contain errors. Please verify and try again.',
      status: 422,
      body,
    });
    this.name = 'ValidationError';
  }
}
