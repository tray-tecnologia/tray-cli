#! /usr/bin/env node
import { program } from 'commander';

import cleanCache from './commands/CleanCache';
import configure from './commands/Configure';
import create from './commands/Create';
import list from './commands/List';
// import { deleteTheme } from './commands/deleteTheme';
// import { download } from './commands/download';
// import { upload } from './commands/upload';
// import { deleteFile } from './commands/deleteFile';
// import { watch } from './commands/watch';
import { open } from './commands/Open';

const pkg = require('../../package.json');

export function run() {
    configure();
    list();
    create();
    cleanCache();
    // deleteTheme();
    // download();
    // upload();
    // deleteFile();
    // watch();
    open();

    program
        .version(pkg.version, '--version', 'Display CLI version')
        .helpOption('--help', 'Display CLI help')
        .addHelpCommand('help [command]', 'Display help por command')
        .name('tray');

    program.parse(process.argv);
}
