import { promises as fsp } from 'fs';
import yaml from 'yaml';

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
            const config: ConfigurationFile = keysToCamel(yaml.parse(data));
            return Promise.resolve(config);
        })
        .catch((error) => Promise.reject(error));
}
