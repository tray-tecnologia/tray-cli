import type { DownloadError } from '#cli/types';

export declare type DownloadCommandResponse = {
  total: number;
  succeed: number;
  fails: DownloadError[];
};
