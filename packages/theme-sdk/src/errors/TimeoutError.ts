import { ResponseError } from './ResponseError';

export class TimeoutError extends ResponseError {
  constructor(body: unknown) {
    super({
      code: 'SDK::0003',
      message: 'Request timed out. Please try again.',
      status: 408,
      body,
    });
    this.name = 'TimeoutError';
  }
}
