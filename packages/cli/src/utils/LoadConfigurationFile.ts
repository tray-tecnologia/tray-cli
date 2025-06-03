import { promises as fsp } from 'fs';
import yaml from 'yaml';

import { FileNotFoundError } from '../errors/FileNotFoundError';
import { UnknownError } from '../errors/UnknownError';
import { ConfigurationFile } from '../types/ConfigurationFile';
import keysToCamel from './KeysToCamel';

/**
 * Load configs from config.yml file
 * @return Promise<ConfigurationFile> Return ConfigurationFile if promise resolves, Error otherwise.
 */
export function loadConfigurationFile(): Promise<ConfigurationFile> {
    return fsp
        .readFile('config.yml', { encoding: 'utf8' })
        .then((data) => {
            const { apiKey: key, password, themeId, previewUrl, debug } = keysToCamel(yaml.parse(data));

            const config = {
                key,
                password,
                themeId,
                previewUrl,
                debug,
            };

            return Promise.resolve(config);
        })
        .catch((error) => {
            const cliError =
                error.code === 'ENOENT'
                    ? new FileNotFoundError({ file: 'config.yml', details: error.toString() })
                    : new UnknownError();
            return Promise.reject(cliError);
        });
}
