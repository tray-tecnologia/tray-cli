import type { RemoveError } from '#cli/types';

export declare type RemoveCommandResponse = {
  total: number;
  succeed: number;
  fails: RemoveError[];
};
