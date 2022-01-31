import { promises as fsp } from 'fs';
import { dirname } from 'path';

export function saveThemeAssetFile(path: string, data: Buffer): Promise<any> {
    const correctPath = `.${path}`;
    const fileDirname = dirname(correctPath);

    return fsp
        .access(fileDirname)
        .catch(() => fsp.mkdir(fileDirname, { recursive: true }))
        .then(() =>
            fsp
                .writeFile(correctPath, data)
                .then(() => Promise.resolve(true))
                .catch((error) => Promise.reject(error))
        );
}
