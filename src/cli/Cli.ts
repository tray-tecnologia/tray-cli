#! /usr/bin/env node
import { program } from 'commander';

import cleanCache from './commands/CleanCache';
import configure from './commands/Configure';
import list from './commands/List';

// import { newTheme } from './commands/newTheme';

// import { deleteTheme } from './commands/deleteTheme';
// import { download } from './commands/download';
// import { upload } from './commands/upload';
// import { deleteFile } from './commands/deleteFile';
// import { watch } from './commands/watch';
// import { open } from './commands/open';

const pkg = require('../../package.json');

export function run() {
    configure();
    list();

    // themes();
    // newTheme();
    cleanCache();
    // deleteTheme();
    // download();
    // upload();
    // deleteFile();
    // watch();
    // open();

    program.version(pkg.version).name('tray');
    program.parse(process.argv);
}
