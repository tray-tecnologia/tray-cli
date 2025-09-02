import { ResponseError } from './ResponseError';

export class AssetNotFoundError extends ResponseError {
  constructor(body: unknown) {
    super({
      code: 'SDK::0007',
      message: 'Asset not found. Please verify the asset ID and try again.',
      status: 404,
      body,
    });
    this.name = 'AssetNotFoundError';
  }
}
