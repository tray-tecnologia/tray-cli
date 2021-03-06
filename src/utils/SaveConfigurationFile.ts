import { promises as fsp } from 'fs';
import yaml from 'yaml';

import { SaveConfigurationFileError } from '../errors/SaveConfigurationFileError';
import { ConfigurationFile } from '../types/ConfigurationFile';

/**
 * Save configs to config.yml file
 * @param {ConfigurationFile} param Configuration object with configs to be saved.
 * @return Promise<string> Return success message if promise resolves, SaveConfigurationFileError otherwise.
 */
export function saveConfigurationFile({
    key,
    password,
    themeId,
    previewUrl,
    debug,
}: ConfigurationFile): Promise<string> {
    const fileDataAsObject = {
        ':api_key': key,
        ':password': password,
        ':theme_id': themeId,
        ':preview_url': previewUrl,
        ':debug': debug,
    };

    const configFileData = yaml.stringify(fileDataAsObject);

    return fsp
        .writeFile('config.yml', configFileData)
        .then(() => Promise.resolve('Configuration file created'))
        .catch((error) => {
            const cliError = new SaveConfigurationFileError(error);
            return Promise.reject(cliError);
        });
}
