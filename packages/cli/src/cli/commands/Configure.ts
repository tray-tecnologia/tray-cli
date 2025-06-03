import { program } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';

import { Tray } from '../../Tray';

/**
 * Create configure file
 */
export default function configure() {
    program
        .command('configure')
        .argument('[key]', 'Api key')
        .argument('[password]', 'Api password')
        .argument('[theme-id]', 'Theme id')
        .option('--debug', 'Enable debug mode')
        .description('Create config.yml file')
        .action(async (key, password, theme_id, options) => {
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
                const missingAnswers = await inquirer.prompt(questions);
                answers = { ...answers, ...missingAnswers };
            }

            const tray = new Tray({
                key: answers.key,
                password: answers.password,
                themeId: answers.themeId,
                debug: answers.debug,
            });

            const loader = ora('Setting up CLI...').start();

            tray.configure()
                .then((success) => {
                    loader.succeed(success);
                })
                .catch((error) => {
                    loader.fail(error.toString());
                });
        });
}
