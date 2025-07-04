import { promises as fsp } from 'fs';

import { SaveConfigurationFileError } from '#cli/errors';
import type { ConfigurationFile } from '#cli/types/ConfigurationFile';

/**
 * Save configs to config.json file
 * @param {ConfigurationFile} param Configuration object with configs to be saved.
 * @return Promise<string> Return success message if promise resolves, SaveConfigurationFileError otherwise.
 */
export function saveConfigurationFile({
  token,
  themeId,
  previewUrl,
  debug,
}: ConfigurationFile): Promise<string> {
  const fileDataAsObject = {
    token: token,
    theme_id: themeId,
    preview_url: previewUrl,
    debug: debug,
  };

  const configFileData = JSON.stringify(fileDataAsObject, null, 2);

  return fsp
    .writeFile('config.json', configFileData)
    .then(() => Promise.resolve('Configuration file created'))
    .catch((error) => {
      const cliError = new SaveConfigurationFileError(error);
      return Promise.reject(cliError);
    });
}
