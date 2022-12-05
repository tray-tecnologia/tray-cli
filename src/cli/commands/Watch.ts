import chalk from 'chalk';
import chokidar from 'chokidar';
import { program } from 'commander';
import ora from 'ora';
import slash from 'slash';

import { Tray } from '../../Tray';
import { RemoveCommandResponse } from '../../types/RemoveCommandResponse';
import { UploadCommandResponse } from '../../types/UploadCommandResponse';

/**
 * Auxiliar constants
 */

const timeout: number = 100;

type Paths = {
    add: string[];
    change: string[];
    remove: string[];
};

type Timers = {
    add: NodeJS.Timeout | undefined;
    change: NodeJS.Timeout | undefined;
    remove: NodeJS.Timeout | undefined;
};

const paths: Paths = {
    add: [],
    change: [],
    remove: [],
};

const timers: Timers = {
    add: undefined,
    change: undefined,
    remove: undefined,
};

const uploadActionTexts: any = {
    add: {
        initial: 'Adding',
        success: 'added',
        error: 'add',
    },
    change: {
        initial: 'Updating',
        success: 'updated',
        error: 'update',
    },
};

/**
 * Auxiliar functions
 */

/**
 * Upload after get all paths to prevent UI bug
 * @param {Tray} tray Instance of Tray CLI Api
 * @param {string} origin Origin of operation. Could be add or change.
 */
async function doUploadAction(tray: Tray, origin: string) {
    const target = origin === 'add' ? paths.add : paths.change;

    for (let index = 0; index < target.length; index++) {
        const path = target[index];

        const loader = ora(`${uploadActionTexts[origin].initial} ${chalk.magenta(path)} file...`).start();

        // eslint-disable-next-line no-await-in-loop
        const response: UploadCommandResponse | void = await tray.upload([path]).catch((error) => {
            loader.fail(error.toString());
        });

        if (response) {
            if (response.fails.length) {
                loader.fail(
                    `Could not ${uploadActionTexts[origin].error} file ${chalk.magenta(path)} due to error - ${
                        response.fails[0].error.message
                    }`
                );
            } else {
                loader.succeed(`File ${chalk.magenta(path)} ${uploadActionTexts[origin].success}`);
            }
        }
    }

    if (origin === 'add') {
        paths.add = [];
        timers.add = undefined;
    } else {
        paths.change = [];
        timers.change = undefined;
    }
}

/**
 * Remove after get all paths to prevent UI bug
 * @param {Tray} tray Instance of Tray CLI Api
 */
async function doRemoveAction(tray: Tray) {
    for (let index = 0; index < paths.remove.length; index++) {
        const path = paths.remove[index];

        const loader = ora(`Removing ${chalk.magenta(path)} file...`).start();

        // eslint-disable-next-line no-await-in-loop
        const response: RemoveCommandResponse | void = await tray.remove([path]).catch((error) => {
            loader.fail(error.toString());
        });

        if (response) {
            if (response.fails.length) {
                loader.fail(
                    `Could not remove file ${chalk.magenta(path)} due to error - ${response.fails[0].error.message}`
                );
            } else {
                loader.succeed(`File ${chalk.magenta(path)} removed`);
            }
        }
    }

    paths.remove = [];
    timers.remove = undefined;
}

/**
 * Watch command
 */
export default function watch() {
    program
        .command('watch')
        .description('Watch theme files for changes and reflect into store')
        .action(() => {
            Tray.initiateFromConfigFile()
                .then((tray) => {
                    const watcher = chokidar.watch('.', {
                        ignored: /(^|[/\\])\../, // ignore dotfiles
                        persistent: true,
                        ignoreInitial: true,
                    });

                    watcher
                        .on('ready', () => {
                            ora().info('Watching files...');
                        })

                        .on('add', async (path) => {
                            paths.add.push(slash(path));

                            if (timers.add) {
                                clearTimeout(timers.add);
                            }

                            timers.add = setTimeout(() => {
                                doUploadAction(tray, 'add');
                            }, timeout);
                        })

                        .on('change', async (path) => {
                            paths.change.push(slash(path));

                            if (timers.change) {
                                clearTimeout(timers.change);
                            }

                            timers.change = setTimeout(() => {
                                doUploadAction(tray, 'change');
                            }, timeout);
                        })

                        .on('unlink', async (path) => {
                            paths.remove.push(slash(path));

                            if (timers.remove) {
                                clearTimeout(timers.remove);
                            }

                            timers.remove = setTimeout(() => {
                                doRemoveAction(tray);
                            }, timeout);
                        })

                        .on('addDir', (path) => {
                            ora().warn(
                                `Creating folder ${chalk.magenta(path)} is not supported by Tray API... ${chalk.yellow(
                                    'Ignored'
                                )}`
                            );
                        })

                        .on('unlinkDir', (path) => {
                            ora().warn(
                                `Deleting folder ${chalk.magenta(path)} is not supported by Tray API... ${chalk.yellow(
                                    'Ignored'
                                )}`
                            );
                        })

                        .on('error', (error) => {
                            ora().fail(`Watcher error: ${error}`);
                        });
                })
                .catch((error) => {
                    ora().start().fail(error.toString());
                    process.exit(1);
                });
        });
}
