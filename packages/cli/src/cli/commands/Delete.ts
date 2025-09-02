import { program } from 'commander';
import { confirm } from '@inquirer/prompts';
import ora from 'ora';

import { Tray } from '#cli/Tray';

/**
 * Delete a theme from store
 */
export default function del() {
  program
    .command('delete')
    .argument('[theme-id]', 'Theme id to be deleted. (Default: current theme)')
    .description('Delete theme from store')
    .action(async (id) => {
      const confirmDelete = await confirm({
        message: 'Do you really want to delete this theme? This action cannot be undone.',
        default: false,
      });

      if (confirmDelete) {
        try {
          const tray = await Tray.initiateFromConfigFile();
          const desiredThemeId = id ?? tray.themeId;

          const loader = ora(`Deleting theme ${desiredThemeId}...`).start();

          await tray.delete(desiredThemeId);
          loader.succeed(`Theme deleted.`);
        } catch (error) {
          ora().start().fail((error as Error).toString());
        }
      } else {
        ora().fail('Operation aborted by user');
      }
    });
}
