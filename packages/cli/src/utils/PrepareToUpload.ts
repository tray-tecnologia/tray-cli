import { promises as fsp } from 'node:fs';

import { LoadThemeAssetError } from '#cli/errors';
import type { FileUpload } from '#cli/types';

export function prepareToUpload(filename: string): Promise<FileUpload> {
  const correctFilename = filename.startsWith('/') ? filename : `/${filename}`;

  return fsp
    .readFile(`.${correctFilename}`)
    .then((content) => {
      const response: FileUpload = {
        filename: correctFilename,
        content,
      };

      return Promise.resolve(response);
    })
    .catch((error) => Promise.reject(new LoadThemeAssetError(error.message)));
}
