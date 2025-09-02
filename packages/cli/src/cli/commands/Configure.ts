import { program } from 'commander';
import { input, confirm } from '@inquirer/prompts';
import ora from 'ora';

import { Tray } from '#cli/Tray';

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
      let answers = {
        token,
        themeId: theme_id,
        debug: options.debug ?? false,
      };

      if (!answers.token) {
        answers.token = await input({
          message: 'Enter api token',
        });
      }

      if (!answers.themeId) {
        answers.themeId = await input({
          message: 'Enter theme id',
        });
      }

      if (!answers.token || !answers.themeId) {
        answers.debug = await confirm({
          message: 'Enabled debug mode?',
          default: false,
        });
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
