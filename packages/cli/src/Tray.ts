import Sdk from '@tray-tecnologia/theme-sdk';
import { globSync } from 'glob';
import axios from 'axios';

import {
  SaveConfigurationFileError,
  ParameterNotDefinedError,
  ThemeFilesNotFoundError,
  FileNotFoundError,
} from '#cli/errors';
import type {
  ConfigurationFile,
  DownloadCommandResponse,
  DownloadError,
  RemoveCommandResponse,
  UploadCommandResponse,
} from '#cli/types';
import { loadConfigurationFile } from './utils/LoadConfigurationFile';
import { prepareToUpload } from './utils/PrepareToUpload';
import { saveConfigurationFile } from './utils/SaveConfigurationFile';
import { saveThemeAssetFile } from './utils/SaveThemeAssetFile';
import type { ThemeInstall, ThemeInstallAsset, GeneralResponse } from '@tray-tecnologia/theme-sdk';

export class Tray {
  readonly token: string;
  themeId?: number;
  previewUrl?: string;
  readonly debug: boolean;
  readonly api: Sdk;

  /**
   * Create new Tray instance
   * @param {ConfigurationFile}
   */
  constructor({ token, themeId, previewUrl, debug = false }: ConfigurationFile) {
    this.token = token;
    this.themeId = themeId;
    this.previewUrl = previewUrl;
    this.debug = debug;

    this.api = new Sdk({
      token: this.token,
      themeId: this.themeId,
      debug: this.debug,
    });
  }

  /**
   * Load configuration settings from config.json and create an instance of class.
   * @return {Promise<Tray>} Returns Tray instance if promises resolves, or CliError otherwise.
   */
  static async initiateFromConfigFile(): Promise<Tray> {
    return loadConfigurationFile()
      .then((config) => new this(config))
      .catch((error) => Promise.reject(error));
  }

  /**
   * Configure CLI use generating config.json file
   * @return {Promise} Return string if promise resolves, ApiError or CliError otherwise
   */
  async configure(): Promise<string> {
    return await this.api.getTheme().then((data) => {
      const fileData: ConfigurationFile = {
        token: this.token,
        themeId: this.themeId,
        previewUrl: data?.data?.preview ?? '',
        debug: this.debug,
      };

      return saveConfigurationFile(fileData)
        .then((success) => Promise.resolve(success))
        .catch((error: SaveConfigurationFileError) => Promise.reject(error));
    });
  }

  /**
   * List all available themes.
   * @return {Promise} Return ThemeInstall if promises resolves, BaseError or CliError otherwise.
   */
  async list(): Promise<void | ThemeInstall[]> {
    return await this.api.getThemes().then((response) => {
      return response?.data;
    });
  }

  /**
   * Create a clean theme
   * @returns Promise ThemeInstall.
   */
  async createCleanTheme(): Promise<void | ThemeInstall> {
    return await this.api.createCleanTheme().then((response) => {
      return response?.data;
    });
  }

  /**
   * Delete requested theme.
   * @param {number} id Theme id to be deleted
   * @return {Promise} Return true with promise resolves, CliError or BaseError otherwise.
   */
  async delete(id = this.themeId): Promise<void | GeneralResponse> {
    if (!id) throw new ParameterNotDefinedError('ThemeId');

    return await this.api.deleteTheme(id).then((success) => success?.data);
  }

  /**
   * Download configured theme
   * @param {string[]} files Files to be downloaded
   * @return {Promise} Returns DownloadCommandResponse when promises resolves
   */
  async download(files?: string[]): Promise<DownloadCommandResponse> {
    const errors: DownloadError[] = [];

    const assets = await this.api.getThemeAssets().then((response) => response?.data);
    if (!assets?.length) {
      throw new ThemeFilesNotFoundError();
    }

    let assetsToDownload: ThemeInstallAsset[] = [];

    if (files && files.length) {
      const filesWithSlash = files.map((file) => `/${file}`);
      const filter = assets.filter((asset) => filesWithSlash.includes(asset.path));

      assetsToDownload = filter;
    } else {
      assetsToDownload = assets;
    }

    const dynamicAssets = assetsToDownload.filter((asset) => asset.dynamic);
    const publicAssets = assetsToDownload.filter((asset) => asset.uri && !asset.dynamic);

    // Download paralelo de arquivos públicos
    const publicPromises = publicAssets.map(async (asset) => {
      try {
        const response = await axios.get(asset.uri as string, {
          responseType: 'arraybuffer',
          timeout: 30000,
        });

        const buffer = Buffer.from(response.data);
        await saveThemeAssetFile(asset.path, buffer);
      } catch (error) {
        errors.push({ file: asset.path, error: new FileNotFoundError({ file: asset.path }) });
      }
    });

    // Download paralelo de arquivos dinâmicos
    const dynamicPromises = dynamicAssets.map(async (file) => {
      try {
        const asset = await this.api.getThemeAsset(file.id);
        if (!asset?.data?.path) {
          throw new FileNotFoundError({ file: file.path });
        }

        const buffer = Buffer.from(asset.data.content ?? '', 'utf8');
        await saveThemeAssetFile(asset.data.path, buffer);
      } catch (error) {
        errors.push({ file: file.path, error: error as any });
      }
    });

    await Promise.all([...publicPromises, ...dynamicPromises]);

    return {
      total: assets.length,
      succeed: assets.length - errors.length,
      fails: errors,
    };
  }

  /**
   * Upload files to theme
   * @param {string[]} files Files to be uploaded. If not provided all files in current folder and subfolder will be uploaded.
   *                         Config.json and files starting with dot will always be ignored.
   * @return {Promise} Returns UploadCommandResponse object if promises resolves, CliError or ApiError otherwise.
   */
  async upload(files?: string[]): Promise<UploadCommandResponse> {
    const errors: any[] = [];

    const allFiles = await this.api.getThemeAssets();
    if (!allFiles?.data?.length) {
      throw new ThemeFilesNotFoundError();
    }

    let assets: string[];
    if (files && files.length) {
      assets = files;
    } else {
      let globbed = globSync('**/*', { nodir: true });
      globbed = globbed.filter((item) => item !== 'config.json');

      if (!globbed.length) {
        throw new ThemeFilesNotFoundError();
      }

      assets = globbed;
    }

    const uploadPromises = assets.map(async (file) => {
      try {
        const fileUpload = await prepareToUpload(file);
        const { filename: asset, content: data } = fileUpload;

        const contentBase64 = Buffer.from(data).toString('base64');

        const existingFile = allFiles.data.find((apiFile) => {
          return apiFile.path === asset;
        });

        if (existingFile) {
          await this.api.updateThemeAsset(existingFile.id, contentBase64);
        } else {
          await this.api.createThemeAsset(asset, contentBase64);
        }
      } catch (error) {
        errors.push({ file, error });
      }
    });

    await Promise.all(uploadPromises);

    return {
      total: assets.length,
      succeed: assets.length - errors.length,
      fails: errors,
    };
  }

  /**
   * Upload core files, excluding configs/settings.json and images folder.
   * Config.json and files starting with dot will always be ignored.
   * @return {Promise} Returns UploadCommandResponse object if promises resolves, CliError or ApiError otherwise.
   */
  uploadCore(): Promise<UploadCommandResponse> {
    let globbed = globSync('**/*', { nodir: true });
    globbed = globbed.filter(
      (path) => !path.match(/(img\/(.)*)|(configs\/settings.json)|(config.json)/)
    );

    if (!globbed.length) {
      return Promise.reject(new ThemeFilesNotFoundError());
    }

    return this.upload(globbed);
  }

  /**
   * Delete theme files
   * @param {string[]} files Files to be removes.
   * @return {Promise} Returns RemoveCommandResponse object if promises resolves, CliError or ApiError otherwise.
   */
  async remove(files: string[]): Promise<RemoveCommandResponse> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors: any[] = [];

    const themeFiles = await this.api.getThemeAssets();

    if (!themeFiles?.data) {
      throw new ThemeFilesNotFoundError();
    }

    const filesToRemove = themeFiles.data.filter((file) => {
      const normalizedPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;

      return files.includes(normalizedPath);
    });

    const promises = filesToRemove.map((file) =>
      this.api.deleteThemeAsset(file.id).catch((error) => errors.push({ file, error }))
    );

    return Promise.all(promises).then(() => {
      const succeedFiles = files.length - errors.length;

      const response: RemoveCommandResponse = {
        total: files.length,
        succeed: succeedFiles,
        fails: errors,
      };

      return Promise.resolve(response);
    });
  }
}
