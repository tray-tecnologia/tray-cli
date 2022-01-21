import { program } from 'commander';
import inquirer from 'inquirer';

import Tray from '../../Tray';

/**
 * Create configure file
 */
export default function configure() {
    program
        .command('configure')
        .argument('[key]', 'Api key')
        .argument('[password]', 'Api password')
        .argument('[theme_id]', 'Theme id')
        .option('--debug', 'Enable debug mode')
        .action((key, password, theme_id, options) => {
            const questions = [];

            let answers = {
                key,
                password,
                themeId: theme_id,
                debug: options.debug ?? false,
            };

            if (!answers.key) {
                questions.push({
                    type: 'input',
                    message: 'Enter api key',
                    name: 'key',
                });
            }

            if (!answers.password) {
                questions.push({
                    type: 'input',
                    message: 'Enter api password',
                    name: 'password',
                });
            }

            if (!answers.themeId) {
                questions.push({
                    type: 'input',
                    message: 'Enter theme id',
                    name: 'themeId',
                });
            }

            if (!answers.key || !answers.password || !answers.themeId) {
                questions.push({
                    type: 'confirm',
                    message: 'Enabled debug mode?',
                    name: 'debug',
                    default: false,
                });
            }

            if (questions.length > 0) {
                inquirer.prompt(questions).then((missingAnswers) => {
                    answers = { ...answers, ...missingAnswers };

                    const tray = new Tray({
                        key: answers.key,
                        password: answers.password,
                        themeId: answers.themeId,
                        debug: answers.debug,
                        verbose: true,
                    });

                    tray.configure();
                });
            }
        });
}
