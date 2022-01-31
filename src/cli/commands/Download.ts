import { program } from 'commander';
import ora from 'ora';
import { EOL } from 'os';

import { Tray } from '../../Tray';

/**
 * Download theme files from store
 */
export default function del() {
    program
        .command('download')
        .argument('[files...]', 'Files to download. (Default: all files)')
        .description('Download theme files from store')
        .action((files) => {
            Tray.initiateFromConfigFile()
                .then((tray) => {
                    const type = files ? 'Files' : 'Theme';
                    const loader = ora(`Downloading ${type.toLowerCase()}...`).start();

                    tray.download(files)
                        .then((response) => {
                            if (response.errors.length) {
                                const errorCount = response.errors.length;
                                const errors = response.errors.join(EOL);
                                const failMessage = `Unable to download ${type.toLowerCase()} due to lot of errors. Files affected listed bellow:`;
                                const warnMessage = `${type} download with ${errorCount} errors. Files affected listed bellow:`;

                                if (errorCount === files.length) {
                                    loader.fail(failMessage);
                                } else {
                                    loader.warn(warnMessage);
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
