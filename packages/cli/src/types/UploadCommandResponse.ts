import type { UploadError } from '#cli/types';

export declare type UploadCommandResponse = {
  total: number;
  succeed: number;
  fails: UploadError[];
};
