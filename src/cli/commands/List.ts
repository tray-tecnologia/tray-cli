import { program } from 'commander';

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
                        verbose: true,
                    });

                    tray.list('stdout');
                })
                .catch((error) => {
                    console.log(error);
                });
        });
}
