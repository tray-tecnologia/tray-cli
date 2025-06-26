import { ResponseError } from './ResponseError';

export class ServerError extends ResponseError {
  constructor(body: unknown) {
    super({
      code: 'SDK::0004',
      message: 'Server error. Please try again.',
      status: 500,
      body,
    });
    this.name = 'ServerError';
  }
}
