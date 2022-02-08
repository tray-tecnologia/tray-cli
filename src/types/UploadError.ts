import { ApiError } from '@tray-tecnologia/opencode-sdk';

import { CliError } from '../errors/CliError';

export declare type UploadError = {
    file: string;
    error: CliError | ApiError;
};
