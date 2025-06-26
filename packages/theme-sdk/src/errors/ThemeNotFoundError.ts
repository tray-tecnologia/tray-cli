import { ResponseError } from './ResponseError';

export class ThemeNotFoundError extends ResponseError {
  constructor(body: unknown) {
    super({
      code: 'SDK::0006',
      message: 'Theme not found. Please verify the theme ID and try again.',
      status: 404,
      body,
    });
    this.name = 'ThemeNotFoundError';
  }
}
