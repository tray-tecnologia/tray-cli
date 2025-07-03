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
    .argument('[token]', 'Api token')
    .option('--debug', 'Enable debug mode')
    .description('Create a new theme in store')
    // eslint-disable-next-line default-param-last
    .action(async (token, options) => {
      const questions = [];

      let answers = {
        token,
        debug: options.debug ?? false,
      };

      if (!answers.token) {
        questions.push({
          type: 'input',
          message: 'Enter api token',
          name: 'token',
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
        token: answers.token,
        debug: answers.debug,
      });

      const loader = ora(`Creating theme clean...`).start();

      tray
        .createCleanTheme()
        .then((data) => {
          loader.succeed(`Theme created under id ${data?.id}.`);
        })
        .catch((error) => {
          loader.fail(error.toString());
        });
    });
}
