import { ApiError } from '@tray-tecnologia/opencode-sdk';

import { CliError } from '../errors/CliError';

export declare type RemoveError = {
    file: string;
    error: CliError | ApiError;
};
