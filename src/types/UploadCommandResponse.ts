import { UploadError } from './UploadError';

export declare type UploadCommandResponse = {
    total: number;
    succeed: number;
    errors: UploadError[];
};
