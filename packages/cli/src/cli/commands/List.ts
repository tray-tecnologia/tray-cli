import { program } from 'commander';
import ora from 'ora';

import { Tray } from '../../Tray';

/**
 * List all themes available at store
 */
export default function list() {
    program
        .command('list')
        .description('List all themes available on store')
        .action(() => {
            Tray.initiateFromConfigFile()
                .then((tray) => {
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
