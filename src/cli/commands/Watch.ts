import chalk from 'chalk';
import chokidar from 'chokidar';
import { program } from 'commander';
import ora from 'ora';
import slash from 'slash';

import { Tray } from '../../Tray';

export default function watch() {
    program
        .command('watch')
        .description('Watch theme files for changes and reflect into store')
        .action(() => {
            Tray.initiateFromConfigFile()
                .then((tray) => {
                    const watcher = chokidar.watch('./', {
                        ignored: /(^|[/\\])\../, // ignore dotfiles
                        persistent: true,
                        ignoreInitial: true,
                    });

                    let loader = ora('Starting...').start();

                    watcher
                        .on('ready', () => {
                            loader.info('Watching files...');
                        })
                        .on('add', (path) => {
                            const asset = slash(path);

                            loader = ora(`Uploading ${chalk.magenta(asset)} file...`).start();

                            tray.upload([asset])
                                .then((response) => {
                                    if (response.fails.length) {
                                        loader.fail(
                                            `Could not upload file ${chalk.magenta(asset)} due to error - ${
                                                response.fails[0].error.message
                                            }`
                                        );
                                    } else {
                                        loader.succeed(`File ${chalk.magenta(asset)} uploaded`);
                                    }
                                })
                                .catch((error) => {
                                    loader.fail(error.toString());
                                });
                        })
                        .on('change', (path) => {
                            const asset = slash(path);

                            loader = ora(`Updating ${chalk.magenta(asset)} file...`).start();

                            tray.upload([asset])
                                .then((response) => {
                                    if (response.fails.length) {
                                        loader.fail(
                                            `Could not update file ${chalk.magenta(asset)} due to error - ${
                                                response.fails[0].error.message
                                            }`
                                        );
                                    } else {
                                        loader.succeed(`File ${chalk.magenta(asset)} updated`);
                                    }
                                })
                                .catch((error) => {
                                    loader.fail(error.toString());
                                });
                        })
                        .on('unlink', (path) => {
                            const asset = slash(path);

                            loader = ora(`Removing ${chalk.magenta(path)} file...`).start();

                            tray.remove([asset])
                                .then((response) => {
                                    if (response.fails.length) {
                                        loader.fail(
                                            `Could not remove file ${chalk.magenta(asset)} due to error - ${
                                                response.fails[0].error.message
                                            }`
                                        );
                                    } else {
                                        loader.succeed(`File ${chalk.magenta(asset)} removed`);
                                    }
                                })
                                .catch((error) => {
                                    loader.fail(error.toString());
                                });
                        })
                        .on('addDir', () => {
                            ora().warn(`Creating folders is not supported by Tray API... ${chalk.yellow('Ignored')}`);
                        })
                        .on('unlinkDir', () => {
                            ora().warn(`Deleting folders is not supported by Tray API... ${chalk.yellow('Ignored')}`);
                        })
                        .on('error', (error) => {
                            ora().fail(`Watcher error: ${error}`);
                        });
                })
                .catch((error) => {
                    ora().start().fail(error.toString());
                });
        });
}
