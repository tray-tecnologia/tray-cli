import type { BaseError } from '@tray-tecnologia/theme-sdk';
import { CliError } from '#cli/errors';

export declare type DownloadError = {
  file: string;
  error: CliError | BaseError;
};
