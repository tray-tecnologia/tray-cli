import { promises as fsp } from 'node:fs';

import { FileNotFoundError, UnknownError } from '#cli/errors';
import type { ConfigurationFile } from '#cli/types/ConfigurationFile';
import keysToCamel from './KeysToCamel';

/**
 * Load configs from config.json file
 * @return Promise<ConfigurationFile> Return ConfigurationFile if promise resolves, Error otherwise.
 */
export async function loadConfigurationFile(): Promise<ConfigurationFile> {
  return fsp
    .readFile('config.json', { encoding: 'utf8' })
    .then((data) => {
      const { token, themeId, previewUrl, debug } = keysToCamel(JSON.parse(data));



      const config = {
        token,
        themeId,
        previewUrl,
        debug,
      };

      return Promise.resolve(config);
    })
    .catch((error) => {
      const cliError =
        error.code === 'ENOENT'
          ? new FileNotFoundError({ file: 'config.json', details: error.toString() })
          : new UnknownError();
      return Promise.reject(cliError);
    });
}
