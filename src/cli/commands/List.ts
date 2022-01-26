import { program } from 'commander';
import ora from 'ora';

import { Tray } from '../../Tray';
import keysToCamel from '../../utils/KeysToCamel';
import { loadConfigurationFile } from '../../utils/LoadConfigurationFile';

/**
 * List all themes available at store
 */
export default function list() {
    program
        .command('list')
        .description('List all themes available on store')
        .action(() => {
            loadConfigurationFile()
                .then((config) => {
                    const { apiKey: key, password, themeId, debug } = keysToCamel(config);

                    const tray = new Tray({
                        key,
                        password,
                        themeId,
                        debug,
                    });

                    const loader = ora('Getting all available themes').start();

                    tray.list()
                        .then((data) => {
                            loader.succeed(`Themes retrieved. Showing available:`);
                            console.table(data.themes);
                        })
                        .catch((error) => {
                            loader.fail(error.toString());
                        });
                })
                .catch((error) => {
                    ora().start().fail(error.toString());
                });
        });
}
