import type { BaseError } from '@tray-tecnologia/theme-sdk';
import { CliError } from '#cli/errors';

export declare type UploadError = {
  file: string;
  error: CliError | BaseError;
};
