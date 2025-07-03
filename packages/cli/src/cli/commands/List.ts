import { program } from 'commander';
import ora from 'ora';

import { Tray } from '../../Tray';
import { UnknownError } from '@tray-tecnologia/theme-sdk';

/**
 * List all themes available at store
 */
export default function list() {
  program
    .command('list')
    .description('List all themes available on store')
    .action(() => {
      Tray.initiateFromConfigFile()
        .then((tray) => {
          const loader = ora('Getting all available themes').start();

          tray
            .list()
            .then((data) => {
              loader.succeed(`Themes retrieved. Showing available:`);

              if(!data) throw new UnknownError('No themes found');

              const list = data.map(theme => {
                const { id, name, created_at, updated_at, theme_id } = theme;

                return {
                  id,
                  theme_id,
                  name,
                  created_at,
                  updated_at,
                }
              })

              console.table(list);
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
