import { program } from 'commander';
import { input, confirm } from '@inquirer/prompts';
import ora from 'ora';

import { Tray } from '#cli/Tray';

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
      let answers = {
        token,
        debug: options.debug ?? false,
      };

      if (!answers.token) {
        answers.token = await input({
          message: 'Enter api token',
        });

        answers.debug = await confirm({
          message: 'Enabled debug mode?',
          default: false,
        });
      }

      const tray = new Tray({
        token: answers.token,
        debug: answers.debug,
      });

      const loader = ora(`Creating clean theme...`).start();

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
