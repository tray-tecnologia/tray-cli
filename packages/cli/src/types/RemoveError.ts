import { ApiError } from '@tray-tecnologia/theme-sdk';

import { CliError } from '../errors/CliError';

export declare type RemoveError = {
  file: string;
  error: CliError | ApiError;
};
