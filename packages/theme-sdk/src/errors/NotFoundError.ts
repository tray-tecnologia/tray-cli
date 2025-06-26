import { ResponseError } from './ResponseError';

export class NotFoundError extends ResponseError {
  constructor(body: unknown) {
    super({
      code: 'SDK::0005',
      message: 'Resource not found. Please verify and try again.',
      status: 404,
      body,
    });
    this.name = 'NotFoundError';
  }
}
