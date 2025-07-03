#! /usr/bin/env node
import { program } from 'commander';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import configure from './commands/Configure';
import create from './commands/Create';
import del from './commands/Delete';
import download from './commands/Download';
import list from './commands/List';
import open from './commands/Open';
import remove from './commands/Remove';
import upload from './commands/Upload';
import watch from './commands/Watch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const pkg = require(join(__dirname, '../../package.json'));

export function run() {
  configure();
  list();
  create();
  del();
  download();
  upload();
  remove();
  watch();
  open();

  program
    .version(pkg.version, '--version', 'Display CLI version')
    .helpOption('--help', 'Display CLI help')
    .addHelpCommand('help [command]', 'Display help per command')
    .name('tray');

  program.parse(process.argv);
}
