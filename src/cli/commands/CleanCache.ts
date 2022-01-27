import { program } from 'commander';
import ora from 'ora';

import { Tray } from '../../Tray';

/**
 * List all themes available at store
 */
export default function cleanCache() {
    program
        .command('clean-cache')
        .description('Clean theme cache on store')
        .argument('[theme-id]', 'Id of theme to clean cache. If not passed default to configured one.')
        .action((id) => {
            Tray.initiateFromConfigFile()
                .then((tray) => {
                    const desiredThemeId = id ?? tray.themeId;
                    const loader = ora().start(`Cleaning cache from theme with id ${desiredThemeId}..`);

                    tray.cleanCache(desiredThemeId);

                    loader.succeed(`Cache from theme ${desiredThemeId} cleaned.`);
                })
                .catch((error) => {
                    ora().start().fail(error.toString());
                });
        });
}
