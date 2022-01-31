import { program } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';

import { Tray } from '../../Tray';

/**
 * List all themes available at store
 */
export default function create() {
    program
        .command('create')
        .argument('[key]', 'Api key')
        .argument('[password]', 'Api password')
        .argument('[theme-name]', 'Name of the theme')
        .argument('[theme-base]', 'Base theme for this new theme (default: default)')
        .option('--debug', 'Enable debug mode')
        .description('Create a new theme in store')
        // eslint-disable-next-line default-param-last
        .action(async (key, password, name, base = 'default', options) => {
            const questions = [];

            let answers = {
                key,
                password,
                name,
                base,
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

            if (!answers.name) {
                questions.push({
                    type: 'input',
                    message: 'Enter theme name',
                    name: 'name',
                });
            }

            if (!answers.key || !answers.password || !answers.name) {
                questions.push({
                    type: 'input',
                    message: 'Enter base theme',
                    name: 'base',
                    default: 'default',
                });

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
                debug: answers.debug,
            });

            const loader = ora(`Creating theme ${name} based on ${base}...`).start();

            tray.create(answers.name, answers.base, true)
                .then((data) => {
                    loader.succeed(`Theme created under id ${data.themeId}.`);
                })
                .catch((error) => {
                    loader.fail(error.toString());
                });
        });
}
