import { RemoveError } from './RemoveError';

export declare type RemoveCommandResponse = {
    total: number;
    succeed: number;
    fails: RemoveError[];
};
