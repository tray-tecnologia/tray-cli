import { parse } from 'node:path';

import {
  FileExtensionNotAllowedError,
  FolderNotAllowedError,
  InvalidFilenameError,
} from '#theme-sdk/errors';
import { camelCase } from './camelCase';

/**
 * Verify if filename is allowed.
 * @param {string} filename File name
 * @return {promise} True if promises resolves, BaseError otherwise.
 * @internal
 */
function isNameValid(filename: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    /^[A-Za-z0-9._-]+$/.test(filename) ? resolve(true) : reject(new InvalidFilenameError());
  });
}

/**
 * Verify if extension is allowed.
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
    allowedExtensions.includes(extension.toLowerCase())
      ? resolve(true)
      : reject(new FileExtensionNotAllowedError(allowedExtensions.join(', ')));
  });
}

/**
 * Verify if folder is allowed.
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
 * Verify if path allow subfolders
 * @param {string} directories Folders path
 * @return {promise} True if promises resolves, BaseError otherwise.
 * @internal
 */
function isSubfoldersAllowed(directories: string): Promise<boolean> {
  const allowedSubFolders = ['pages', 'elements', 'css', 'img', 'js', 'configs'];

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

    if (rootFolder === 'configs') {
      if (folders.length > 3) {
        return reject(
          new FolderNotAllowedError(
            'Configs only allows up to 2 levels of subfolders (editor/sections)'
          )
        );
      }
      if (folders.length >= 2 && folders[1] !== 'editor') {
        return reject(
          new FolderNotAllowedError('Configs only allows the editor subfolder')
        );
      }
      if (folders.length === 3 && folders[2] !== 'sections') {
        return reject(
          new FolderNotAllowedError('Configs/editor only allows the sections subfolder')
        );
      }
    }

    resolve(true);
  });
}

/**
 * Verify if file follows specific rules for certain directories.
 * @param {string} filename File name
 * @param {string} extension File extension
 * @param {string} directories Folders path
 * @return {promise} True if promises resolves, BaseError otherwise.
 * @internal
 */
function isFileRulesValid(filename: string, extension: string, directories: string): Promise<boolean> {
  if (!directories || directories === '') {
    return Promise.resolve(true);
  }

  // Normalize directory separators to support Windows and Unix
  const normalizedPath = directories.replace(/\\/g, '/');
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
  const folders = cleanPath.split('/');

  return new Promise((resolve, reject) => {
    // Rules for configs/editor and configs/editor/sections
    if (folders[0] === 'configs' && folders.length >= 2 && folders[1] === 'editor') {
      // Only .json files allowed in configs/editor and configs/editor/sections
      if (extension.toLowerCase() !== '.json') {
        return reject(
          new FileExtensionNotAllowedError('.json')
        );
      }

      // configs/editor - only global.json allowed
      if (folders.length === 2 && filename !== 'global') {
        return reject(
          new FolderNotAllowedError('Only global.json is allowed in configs/editor directory')
        );
      }

      // configs/editor/sections - any name allowed (but only .json already validated)
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
  const { name, ext: extension, dir: directories } = parse(path);

  return isNameValid(name)
    .then(() => isExtensionValid(extension))
    .then(() => isFolderValid(directories))
    .then(() => isSubfoldersAllowed(directories))
    .then(() => isFileRulesValid(name, extension, directories));
}
