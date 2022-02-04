import { ApiError } from 'opencode-sdk/dist';

import { CliError } from '../errors/CliError';

export declare type UploadError = {
    file: string;
    error: CliError | ApiError;
};
