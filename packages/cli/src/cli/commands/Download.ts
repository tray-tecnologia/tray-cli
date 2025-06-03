import chalk from 'chalk';
import { program } from 'commander';
import ora from 'ora';
import { EOL } from 'os';

import { Tray } from '../../Tray';

/**
 * Download theme files from store
 */
export default function download() {
    program
        .command('download')
        .argument('[files...]', 'Files to download. (Default: all files)')
        .description('Download theme files from store')
        .action((files) => {
            Tray.initiateFromConfigFile()
                .then((tray) => {
                    const type = files && files.length ? 'Files' : 'Theme';
                    const loader = ora(`Downloading ${type.toLowerCase()}...`).start();

                    tray.download(files)
                        .then((response) => {
                            if (response.fails.length) {
                                const errorCount = response.fails.length;
                                const errors = response.fails
                                    .map((fail) => `${chalk.magenta(fail.file)} -> ${fail.error.message}`)
                                    .join(EOL);

                                if (errorCount === response.total) {
                                    loader.fail(
                                        `Unable to download ${type.toLowerCase()} correctly due to errors. Files affected listed bellow:`
                                    );
                                } else {
                                    loader.warn(
                                        `${type} download with ${errorCount} errors. Files affected listed bellow:`
                                    );
                                }

                                console.log(errors);
                            } else {
                                loader.succeed(`${type} downloaded.`);
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
