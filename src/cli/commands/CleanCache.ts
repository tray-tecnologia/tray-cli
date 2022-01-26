import { program } from 'commander';
import ora from 'ora';

import { Tray } from '../../Tray';
import keysToCamel from '../../utils/KeysToCamel';
import { loadConfigurationFile } from '../../utils/LoadConfigurationFile';

/**
 * List all themes available at store
 */
export default function cleanCache() {
    program
        .command('clean-cache')
        .description('Clean theme cache on store')
        .argument('[theme-id]', 'Id of theme to clean cache. If not passed default to configured one.')
        .action((id) => {
            loadConfigurationFile()
                .then((config) => {
                    const { apiKey: key, password, themeId, debug } = keysToCamel(config);

                    const tray = new Tray({
                        key,
                        password,
                        themeId,
                        debug,
                    });

                    const desiredThemeId = id ?? themeId;
                    const loader = ora().start(`Cleaning cache from configured theme id ${desiredThemeId}..`);

                    tray.cleanCache(desiredThemeId);

                    loader.succeed(`Cache from theme ${desiredThemeId} cleaned.`);
                })
                .catch((error) => {
                    ora().start().fail(error.toString());
                });
        });
}
