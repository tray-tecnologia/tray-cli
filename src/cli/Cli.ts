#! /usr/bin/env node
import { program } from 'commander';

import cleanCache from './commands/CleanCache';
import configure from './commands/Configure';
import create from './commands/Create';
import del from './commands/Delete';
import download from './commands/Download';
import list from './commands/List';
import open from './commands/Open';

// import upload from './commands/Upload';

// import { deleteFile } from './commands/deleteFile';
// import { watch } from './commands/watch';
// import { deleteTheme } from './commands/deleteTheme';

const pkg = require('../../package.json');

export function run() {
    configure();
    list();
    create();
    cleanCache();
    del();
    download();
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
