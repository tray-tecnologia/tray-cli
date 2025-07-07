import { parse } from 'node:path';

import { FileExtensionNotAllowedError } from '../errors/FileExtensionNotAllowedError';
import { FolderNotAllowedError } from '../errors/FolderNotAllowedError';

/**
 * Verify is extension is allowed.
 * @param {string} extension File extension
 * @return {promise} True if promises resolves, BaseError otherwise.
 * @internal
 */
function isExtensionValid(extension: string): Promise<boolean> {
  const allowedEextensions = [
    /* Fonts extensions */
    '.ttf',
    '.otf',
    '.eot',
    '.woff',
    '.woff2',

    /* Imagens extensions */
    '.jpg',
    '.jpeg',
    '.gif',
    '.png',
    '.svg',

    /* Styles extensions */
    '.css',
    '.scss',

    /* Other extensions */
    '.html',
    '.js',
    '.json',
  ];

  return new Promise((resolve, reject) => {
    allowedEextensions.includes(extension)
      ? resolve(true)
      : reject(new FileExtensionNotAllowedError(allowedEextensions.join(', ')));
  });
}

/**
 * Verify folder is allowed.
 * @param {string} directories Folders path
 * @return {promise} True if promises resolves, BaseError otherwise.
 * @internal
 */
function isFolderValid(directories: string): Promise<boolean> {
  const allowedFolders = ['configs', 'css', 'elements', 'img', 'js', 'layouts', 'pages'];
  const rootFolder = directories.substring(1).split('/')[0];

  return new Promise((resolve, reject) => {
    allowedFolders.includes(rootFolder)
      ? resolve(true)
      : reject(new FolderNotAllowedError(allowedFolders.join(', ')));
  });
}

/**
 * Verify path allow subfolders
 * @param {string} directories Folders path
 * @return {promise} True if promises resolves, BaseError otherwise.
 * @internal
 */
function isSubfoldersAllowed(directories: string): Promise<boolean> {
  const allowedSubFolders = ['css', 'elements', 'img', 'js'];
  const folders = directories.substring(1).split('/');
  const rootFolder = folders[0];

  return new Promise((resolve, reject) => {
    folders.length > 1 && !allowedSubFolders.includes(rootFolder)
      ? reject(new FolderNotAllowedError(allowedSubFolders.join(', ')))
      : resolve(true);
  });
}

/**
 * Verify file is allowed in theme structure.
 * Validades file extension, root folders and subfolders.
 * @param {string} path Complete file path
 * @return {promise} True if promises resolves, BaseError otherwise.
 */
export function isFileAllowed(path: string): Promise<boolean> {
  const { ext: extension, dir: directories } = parse(path);

  return isExtensionValid(extension)
    .then((data) => isFolderValid(directories))
    .then((data) => isSubfoldersAllowed(directories));
}
