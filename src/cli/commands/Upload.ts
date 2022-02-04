import chalk from 'chalk';
import { program } from 'commander';
import glob from 'glob';
import ora from 'ora';
import { EOL } from 'os';
import { extname } from 'path';

import { Tray } from '../../Tray';

/**
 * Upload theme files from store
 */
export default function upload() {
    program
        .command('upload')
        .argument('[files...]', 'Files to upload. (Default: all files)')
        .option('--core', 'Removes settings.json and images folder from upload')
        .description('Upload files to theme. Folder paths are not supported and will be ignored.')
        .action((assets: string[], options) => {
            Tray.initiateFromConfigFile()
                .then((tray) => {
                    let method: keyof typeof tray = 'upload';
                    let globbed: any = [];

                    if (assets.length) {
                        if (options.core) {
                            console.log(
                                `${chalk.yellow(
                                    'Warn'
                                )} Core option has no affect when used together with files parameter. Option ignored.`
                            );
                        }

                        assets.forEach((asset) => {
                            if (glob.hasMagic(asset) || extname(asset)) {
                                globbed.push(glob.sync(asset, { nodir: true }));
                            }
                        });

                        globbed = globbed.flat();
                        globbed = globbed.filter((path: string) => path !== 'config.yml');
                    } else if (options.core) {
                        method = 'uploadCore';
                    }

                    console.log(`${chalk.yellow('[Warn]')} Folder paths are not supported and will be ignored.`);

                    const loader = ora(`Uploading files...`).start();

                    tray[method](globbed)
                        .then((response) => {
                            if (response.errors.length) {
                                const errorCount = response.errors.length;
                                const errors = response.errors.map((error) => error.file).join(EOL);

                                if (errorCount === response.total) {
                                    loader.fail(
                                        `Unable to upload files due to lot of errors. Files affected listed bellow:`
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
