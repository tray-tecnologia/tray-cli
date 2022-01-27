import { program } from 'commander';
import launch from 'open';
import ora from 'ora';

import { PreviewUrlNotDefinedError } from '../../errors/PreviewUrlNotDefinedError';
import { loadConfigurationFile } from '../../utils/LoadConfigurationFile';

export function open() {
    program.command('open').action(() => {
        const loader = ora('Opening theme preview page...').start();

        loadConfigurationFile()
            .then((config) => {
                if (!config.previewUrl) {
                    return Promise.reject(new PreviewUrlNotDefinedError());
                }

                return launch(config.previewUrl)
                    .then(() => loader.succeed('Theme preview page opened in default browser.'))
                    .catch((error) => Promise.reject(error));
            })
            .catch((error) => {
                loader.fail(error.toString());
            });
    });
}
