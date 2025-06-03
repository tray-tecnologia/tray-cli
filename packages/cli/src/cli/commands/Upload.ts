import chalk from 'chalk';
import { program } from 'commander';
import glob from 'glob';
import ora from 'ora';
import { EOL } from 'os';
import { extname } from 'path';

import { Tray } from '../../Tray';
import { FileNotFoundError } from '../../errors/FileNotFoundError';

/**
 * Upload theme files from store
 */
export default function upload() {
    program
        .command('upload')
        .argument('[files...]', 'Files to upload. (Default: all files)')
        .option('--core', 'Removes settings.json and images folder from upload')
        .description('Upload files to theme')
        .action((assets: string[], options) => {
            Tray.initiateFromConfigFile()
                .then((tray) => {
                    let method: keyof typeof tray = 'upload';
                    let globbed: any = [];

                    if (assets.length) {
                        if (options.core) {
                            ora()
                                .start()
                                .warn(
                                    'Core option has no affect when used together with files parameter. Option ignored.'
                                );
                        }

                        assets.forEach((asset) => {
                            if (glob.hasMagic(asset) || extname(asset)) {
                                globbed.push(glob.sync(asset, { nodir: true }));
                            }
                        });

                        globbed = globbed.flat();
                        globbed = globbed.filter((path: string) => path !== 'config.yml');

                        if (globbed.length === 0) {
                            return Promise.reject(
                                new FileNotFoundError({
                                    details: 'Files passed through command was not found in specified path.',
                                })
                            );
                        }

                        if (globbed.length < assets.length) {
                            ora().start().warn('Some request files could not be found. Verify files after operation.');
                        }
                    } else if (options.core) {
                        method = 'uploadCore';
                    }

                    ora().start().warn('Folder paths are not supported and will be ignored.');

                    const loader = ora(`Uploading files...`).start();

                    tray[method](globbed)
                        .then((response) => {
                            if (response.fails.length) {
                                const errorCount = response.fails.length;
                                const errors = response.fails
                                    .map((fail) => `${chalk.magenta(fail.file)} -> ${fail.error.message}`)
                                    .join(EOL);

                                if (errorCount === response.total) {
                                    loader.fail(
                                        `Unable to upload files correctly due to errors. Files affected listed bellow:`
                                    );
                                } else {
                                    loader.warn(
                                        `Files upload with ${errorCount} errors. Files affected listed bellow:`
                                    );
                                }

                                console.log(errors);
                            } else {
                                loader.succeed(`Files uploaded.`);
                            }
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
