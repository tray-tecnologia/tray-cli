import { ApiError } from '@tray-tecnologia/opencode-sdk';

import { CliError } from '../errors/CliError';

export declare type DownloadError = {
    file: string;
    error: CliError | ApiError;
};
