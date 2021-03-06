import Sdk, { ApiError, ApiListThemesResponse } from '@tray-tecnologia/opencode-sdk';
import glob from 'glob';

import { CliError } from './errors/CliError';
import { ParameterNotDefinedError } from './errors/ParameterNotDefinedError';
import { SaveConfigurationFileError } from './errors/SaveConfigurationFileError';
import { ThemeFilesNotFoundError } from './errors/ThemeFilesNotFoundError';
import { ConfigurationFile } from './types/ConfigurationFile';
import { DownloadCommandResponse } from './types/DownloadCommandResponse';
import { DownloadError } from './types/DownloadError';
import { RemoveCommandResponse } from './types/RemoveCommandResponse';
import { UploadCommandResponse } from './types/UploadCommandResponse';
import { loadConfigurationFile } from './utils/LoadConfigurationFile';
import { prepareToUpload } from './utils/PrepareToUpload';
import { saveConfigurationFile } from './utils/SaveConfigurationFile';
import { saveThemeAssetFile } from './utils/SaveThemeAssetFile';

export class Tray {
    readonly key: string;
    readonly password: string;
    themeId?: number;
    previewUrl?: string;
    readonly debug: boolean;
    readonly api: Sdk;

    /**
     * Create new Tray instance
     * @param {ConfigurationFile}
     */
    constructor({ key, password, themeId, previewUrl, debug = false }: ConfigurationFile) {
        this.key = key;
        this.password = password;
        this.themeId = themeId;
        this.previewUrl = previewUrl;
        this.debug = debug;

        this.api = new Sdk({
            key: this.key,
            password: this.password,
            themeId: this.themeId,
            debug: this.debug,
        });
    }

    /**
     * Load configuration settings from config.yml and create an instance of class.
     * @return {Promise<Tray>} Returns Tray instance if promises resolves, or CliError otherwise.
     */
    static initiateFromConfigFile(): Promise<Tray> {
        return loadConfigurationFile()
            .then((config) => new this(config))
            .catch((error) => Promise.reject(error));
    }

    /**
     * Configure CLI use generating config.yml file
     * @return {Promise} Return string if promise resolves, ApiError or CliError otherwise
     */
    configure(): Promise<string> {
        return this.api
            .checkConfiguration()
            .then((data) => {
                const fileData: ConfigurationFile = {
                    key: this.key,
                    password: this.password,
                    themeId: this.themeId,
                    previewUrl: data.preview ?? '',
                    debug: this.debug,
                };

                return saveConfigurationFile(fileData)
                    .then((success) => Promise.resolve(success))
                    .catch((error: SaveConfigurationFileError) => Promise.reject(error));
            })
            .catch((error: ApiError | CliError) => Promise.reject(error));
    }

    /**
     * List all available themes.
     * @return {Promise} Return ApiListThemesResponse if promises resolves, ApiError or CliError otherwise.
     */
    list(): Promise<ApiListThemesResponse> {
        return this.api
            .getThemes()
            .then((data) => Promise.resolve(data))
            .catch((error) => Promise.reject(error));
    }

    /**
     * Clean cache for required theme
     * @param {?number} id Theme id to clean the cache
     * @return {Promise} Return true if promises resolves or ApiError otherwise.
     */
    cleanCache(id = this.themeId): Promise<boolean> {
        return this.api
            .cleanCache(id)
            .then((success) => Promise.resolve(success))
            .catch((error) => Promise.reject(error));
    }

    /**
     * Create a new theme in store
     * @param {string} name Theme name
     * @param {string} base Base theme for the new theme be created from.
     * @param {boolean} createConfigFile Specify if config.yml file need to be created on disk.
     * @return {Promise} Returns Tray class instance if promises resolves, CliError or ApiError otherwise.
     * If createConfigFile was true, file will be created on disk before return Tray instance.
     */
    create(name: string, base: string = 'default', createConfigFile = false): Promise<Tray> {
        return this.api
            .createTheme(name, base)
            .then((response) => {
                this.themeId = response.themeId;
                this.previewUrl = response.preview;

                if (createConfigFile) {
                    const config = {
                        key: this.key,
                        password: this.password,
                        themeId: this.themeId,
                        previewUrl: this.previewUrl,
                        debug: this.debug,
                    };

                    return saveConfigurationFile(config)
                        .then(() => Promise.resolve(this))
                        .catch((error) => {
                            const improvedError = error;

                            let message = `Theme create with success, but ${improvedError.message}`;
                            message = message
                                .split('.')
                                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                                .join('.');

                            improvedError.message = message;

                            return Promise.reject(improvedError);
                        });
                }

                return Promise.resolve(this);
            })
            .catch((error) => Promise.reject(error));
    }

    /**
     * Delete requested theme.
     * @param {number} id Theme id to be deleted
     * @return {Promise} Return true with promise resolves, CliError or ApiError otherwise.
     */
    delete(id = this.themeId): Promise<boolean> {
        if (!id) return Promise.reject(new ParameterNotDefinedError('ThemeId'));

        return this.api
            .deleteTheme(id)
            .then((success) => Promise.resolve(success))
            .catch((error) => Promise.reject(error));
    }

    /**
     * Download configured theme
     * @param {string[]} files Files to be donwloaded
     * @return {Promise} Returns DownloadCommandResponse when promises resolves
     */
    download(files?: string[]): Promise<DownloadCommandResponse> {
        const errors: DownloadError[] = [];

        const promise = new Promise<string[]>((resolve, reject) => {
            if (files && files.length) {
                resolve(files);
            } else {
                reject(new Error());
            }
        });

        return promise
            .catch(() =>
                this.api.getAssets().then((assets) => {
                    const filesPaths: string[] = assets.assets.map((asset) => asset.path);
                    return filesPaths;
                })
            )
            .then((assets: string[]) => {
                const promises = assets.map((file: string) =>
                    this.api
                        .getAsset(file.startsWith('/') ? file : `/${file}`)
                        .then((asset) => saveThemeAssetFile(asset.key, asset.content))
                        .catch((error) => errors.push({ file, error }))
                );

                return Promise.all(promises).then(() => {
                    const succeedFiles = assets.length - errors.length;

                    const response: DownloadCommandResponse = {
                        total: assets.length,
                        succeed: succeedFiles,
                        fails: errors,
                    };

                    return Promise.resolve(response);
                });
            });
    }

    /**
     * Upload files to theme
     * @param {string[]} files Files to be uploaded. If not provided all files in current folder and subfolder will be uploaded.
     *                         Config.yml and files starting with dot will always be ignored.
     * @return {Promise} Returns UploadCommandResponse object if promises resolves, CliError or ApiError otherwise.
     */
    upload(files?: string[]): Promise<UploadCommandResponse> {
        const errors: any[] = [];

        const promise = new Promise<string[]>((resolve, reject) => {
            if (files && files.length) {
                resolve(files);
            } else {
                reject(new Error());
            }
        });

        return promise
            .catch(() => {
                let globbed = glob.sync('**/*', { nodir: true }).flat();
                globbed = globbed.filter((item) => item !== 'config.yml');

                if (!globbed.length) {
                    return Promise.reject(new ThemeFilesNotFoundError());
                }

                return globbed;
            })
            .then((assets: string[]) => {
                const promises = assets.map((file: string) =>
                    prepareToUpload(file)
                        .then((fileUpload) => {
                            const { filename: asset, content: data, isBinary } = fileUpload;
                            return this.api.sendAsset({ asset, data, isBinary });
                        })
                        .catch((error) => errors.push({ file, error }))
                );

                return Promise.all(promises).then(() => {
                    const succeedFiles = assets.length - errors.length;

                    const response: UploadCommandResponse = {
                        total: assets.length,
                        succeed: succeedFiles,
                        fails: errors,
                    };

                    return Promise.resolve(response);
                });
            });
    }

    /**
     * Upload core files, excluding configs/settings.json and images folder.
     * Config.yml and files starting with dot will always be ignored.
     * @return {Promise} Returns UploadCommandResponse object if promises resolves, CliError or ApiError otherwise.
     */
    uploadCore(): Promise<UploadCommandResponse> {
        let globbed = glob.sync('**/*', { nodir: true }).flat();
        globbed = globbed.filter((path) => !path.match(/(img\/(.)*)|(configs\/settings.json)|(config.yml)/));

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
    remove(files: string[]): Promise<RemoveCommandResponse> {
        const errors: any[] = [];

        const promises = files.map((file: string) =>
            this.api
                .deleteAsset(file.startsWith('/') ? file : `/${file}`)
                .catch((error) => errors.push({ file, error }))
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
