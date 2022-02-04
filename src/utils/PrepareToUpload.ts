import { promises as fsp } from 'fs';
import { isBinaryFile } from 'isbinaryfile';

import { LoadThemeAssetError } from '../errors/LoadThemeAssetError';
import { FileUpload } from '../types/FileUpload';

export function prepareToUpload(filename: string): Promise<FileUpload> {
    const correctFilename = filename.startsWith('/') ? filename : `/${filename}`;

    return fsp
        .readFile(`.${correctFilename}`)
        .then((content) =>
            isBinaryFile(`.${correctFilename}`).then((success) => {
                const response: FileUpload = {
                    filename: correctFilename,
                    content,
                    isBinary: success,
                };

                return Promise.resolve(response);
            })
        )
        .catch((error) => Promise.reject(new LoadThemeAssetError(error.message)));
}
