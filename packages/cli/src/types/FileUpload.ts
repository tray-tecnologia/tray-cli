import * as Buffer from 'buffer';

export declare type FileUpload = {
    filename: string;
    content: Buffer;
    isBinary: boolean;
};
