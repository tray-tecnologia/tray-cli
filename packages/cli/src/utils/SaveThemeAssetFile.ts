import { promises as fsp } from 'fs';
import { dirname } from 'path';

import { SaveThemeAssetError } from '../errors/SaveThemeAssetError';

/**
 * Save theme file to disk. With folder not exists it will be created.
 * @param {string} path File path where file needs to be created with file name.
 * @param {Buffer} data File content to be saved.
 * @return {Promise} Returns true when promises resolves, CliError otherwise.
 */
export function saveThemeAssetFile(path: string, data: Buffer): Promise<boolean> {
    const correctPath = `.${path}`;
    const fileDirname = dirname(correctPath);

    return fsp
        .access(fileDirname)
        .catch(() => fsp.mkdir(fileDirname, { recursive: true }))
        .then(() => fsp.writeFile(correctPath, data))
        .then(() => Promise.resolve(true))
        .catch((error) => Promise.reject(new SaveThemeAssetError(error.message)));
}
