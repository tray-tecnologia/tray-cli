import chalk from 'chalk';
import { program } from 'commander';
import { globSync, hasMagic } from 'glob';
import { confirm } from '@inquirer/prompts';
import ora from 'ora';
import { EOL } from 'node:os';
import { extname } from 'node:path';

import { Tray } from '#cli/Tray';

export default function remove() {
  program
    .command('remove')
    .argument('<files...>', 'Files to remove')
    .description('Removes files from theme')
    .action(async (files: string[]) => {
      const confirmDelete = await confirm({
        message: 'Do you really want to delete this files? This action cannot be undone.',
        default: false,
      });

      if (confirmDelete) {
        try {
          const tray = await Tray.initiateFromConfigFile();
          let globbed: any = [];

          files.forEach((file) => {
            if (hasMagic(file) || extname(file)) {
              globbed.push(...globSync(file, { nodir: true }));
            }
          });

          globbed = globbed.filter((path: string) => path !== 'config.json');

          ora().start().warn('Folder paths are not supported and will be ignored.');

          const loader = ora(`Deleting files...`).start();

          const response = await tray.remove(globbed);

          if (response.fails.length) {
            const errorCount = response.fails.length;
            const errors = response.fails
              .map((fail) => `${chalk.magenta(fail.file)} -> ${fail.error.message}`)
              .join(EOL);

            if (errorCount === response.total) {
              loader.fail(
                `Unable to delete files correctly due to errors. Files affected listed bellow:`
              );
            } else {
              loader.warn(`Files deleted with ${errorCount} errors. Files affected listed bellow:`);
            }

            console.log(errors);
          } else {
            loader.succeed(`Files deleted.`);
          }
        } catch (error) {
          ora()
            .start()
            .fail((error as Error).toString());
        }
      } else {
        ora().fail('Operation aborted by user');
      }
    });
}
