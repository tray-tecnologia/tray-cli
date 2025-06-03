import { ApiError } from '@tray-tecnologia/theme-sdk';

import { CliError } from '../errors/CliError';

export declare type DownloadError = {
  file: string;
  error: CliError | ApiError;
};
