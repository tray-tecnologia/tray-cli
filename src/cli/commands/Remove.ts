import chalk from 'chalk';
import { program } from 'commander';
import glob from 'glob';
import inquirer from 'inquirer';
import ora from 'ora';
import { EOL } from 'os';
import { extname } from 'path';

import { Tray } from '../../Tray';

export default function remove() {
    program
        .command('remove')
        .argument('<files...>', 'Files to remove')
        .description('Removes files from theme')
        .action(async (files: string[]) => {
            inquirer
                .prompt({
                    type: 'confirm',
                    message: 'Do you really want to delete this files? This action cannot be undone.',
                    name: 'confirm',
                    default: false,
                })
                .then((answers) => {
                    if (answers.confirm) {
                        Tray.initiateFromConfigFile()
                            .then((tray) => {
                                let globbed: any = [];

                                files.forEach((file) => {
                                    if (glob.hasMagic(file) || extname(file)) {
                                        globbed.push(glob.sync(file, { nodir: true }));
                                    }
                                });

                                globbed = globbed.flat();
                                globbed = globbed.filter((path: string) => path !== 'config.yml');

                                console.log(
                                    `${chalk.yellow('[Warn]')} Folder paths are not supported and will be ignored.`
                                );

                                const loader = ora(`Deleting files...`).start();

                                tray.remove(globbed)
                                    .then((response) => {
                                        if (response.fails.length) {
                                            const errorCount = response.fails.length;
                                            const errors = response.fails
                                                .map((fail) => `${chalk.magenta(fail.file)} -> ${fail.error.message}`)
                                                .join(EOL);

                                            if (errorCount === response.total) {
                                                loader.fail(
                                                    `Unable to delete files due to lot of errors. Files affected listed bellow:`
                                                );
                                            } else {
                                                loader.warn(
                                                    `Files deleted with ${errorCount} errors. Files affected listed bellow:`
                                                );
                                            }

                                            console.log(errors);
                                        } else {
                                            loader.succeed(`Files deleted.`);
                                        }
                                    })
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
