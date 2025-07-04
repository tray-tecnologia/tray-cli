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
    .argument('[token]', 'Api token')
    .argument('[theme-id]', 'Theme id')
    .option('--debug', 'Enable debug mode')
    .description('Create config.json file')
    .action(async (token, theme_id, options) => {
      const questions = [];

      let answers = {
        token,
        themeId: theme_id,
        debug: options.debug ?? false,
      };

      if (!answers.token) {
        questions.push({
          type: 'input',
          message: 'Enter api token',
          name: 'token',
        });
      }

      if (!answers.themeId) {
        questions.push({
          type: 'input',
          message: 'Enter theme id',
          name: 'themeId',
        });
      }

      if (!answers.token || !answers.themeId) {
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
        themeId: answers.themeId,
        debug: answers.debug,
      });

      const loader = ora('Setting up CLI...').start();

      tray
        .configure()
        .then((success) => {
          loader.succeed(success);
        })
        .catch((error) => {
          loader.fail(error.toString());
        });

      loader.succeed('CLI configured successfully');
    });
}
