import { ResponseError } from './ResponseError';

export class AuthenticationError extends ResponseError {
  constructor(body: unknown) {
    super({
      code: 'SDK::0001',
      message: 'Token is invalid or not present. Please verify and try again.',
      status: 401,
      body,
    });
    this.name = 'AuthenticationError';
  }
}
