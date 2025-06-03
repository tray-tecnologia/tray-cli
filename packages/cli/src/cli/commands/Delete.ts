import { program } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';

import { Tray } from '../../Tray';

/**
 * Delete a theme from store
 */
export default function del() {
    program
        .command('delete')
        .argument('[theme-id]', 'Theme id to be deleted. (Default: current theme)')
        .description('Delete theme from store')
        .action((id) => {
            inquirer
                .prompt({
                    type: 'confirm',
                    message: 'Do you really want to delete this theme? This action cannot be undone.',
                    name: 'confirm',
                    default: false,
                })
                .then((answers) => {
                    if (answers.confirm) {
                        Tray.initiateFromConfigFile()
                            .then((tray) => {
                                const desiredThemeId = id ?? tray.themeId;

                                const loader = ora(`Deleting theme ${desiredThemeId}...`).start();

                                tray.delete(desiredThemeId)
                                    .then(() => loader.succeed(`Theme deleted.`))
                                    .catch((error) => {
                                        loader.fail(error.toString());
                                    });
                            })
                            .catch((error) => {
                                ora().start().fail(error.toString());
                            });
                    } else {
                        ora().fail('Operation aborted by user');
                    }
                });
        });
}
