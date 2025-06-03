import { DownloadError } from './DownloadError';

export declare type DownloadCommandResponse = {
    total: number;
    succeed: number;
    fails: DownloadError[];
};
