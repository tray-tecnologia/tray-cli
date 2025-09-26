import { parse } from 'node:path';

import { FileExtensionNotAllowedError, FolderNotAllowedError } from '#theme-sdk/errors';
import { camelCase } from './camelCase';

/**
 * Verify is extension is allowed.
 * @param {string} extension File extension
 * @return {promise} True if promises resolves, BaseError otherwise.
 * @internal
 */
function isExtensionValid(extension: string): Promise<boolean> {
  const allowedExtensions = [
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
    allowedExtensions.includes(extension)
      ? resolve(true)
      : reject(new FileExtensionNotAllowedError(allowedExtensions.join(', ')));
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

  if (!directories || directories === '') {
    return Promise.resolve(true);
  }

  // Normalize directory separators to support Windows and Unix
  const normalizedPath = directories.replace(/\\/g, '/');
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
  const rootFolder = cleanPath.split('/')[0];

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
  const allowedSubFolders = ['pages', 'elements', 'css', 'img', 'js'];

  if (!directories || directories === '') {
    return Promise.resolve(true);
  }

  // Normalize directory separators to support Windows and Unix
  const normalizedPath = directories.replace(/\\/g, '/');
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
  const folders = cleanPath.split('/');
  const rootFolder = folders[0];

  return new Promise((resolve, reject) => {
    if (folders.length > 1 && !allowedSubFolders.includes(rootFolder)) {
      return reject(
        new FolderNotAllowedError(
          `${camelCase(rootFolder)} does not allow subfolders. Allowed with subfolders: ${allowedSubFolders.join(', ')}`
        )
      );
    }

    if (rootFolder === 'pages') {
      if (folders.length > 2 || (folders.length === 2 && folders[1] !== 'lp')) {
        return reject(
          new FolderNotAllowedError('Pages only allows the lp subfolder with no additional levels')
        );
      }
    }

    if (rootFolder === 'elements') {
      if (folders.length > 2 || (folders.length === 2 && folders[1] !== 'snippets')) {
        return reject(
          new FolderNotAllowedError(
            'Elements only allows the snippets subfolder with no additional levels'
          )
        );
      }
    }
    resolve(true);
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
    .then(() => isFolderValid(directories))
    .then(() => isSubfoldersAllowed(directories));
}
