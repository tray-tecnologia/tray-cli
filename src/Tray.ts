import Sdk, { ApiError, ApiListThemesResponse } from 'opencode-sdk';

import { CliError } from './errors/CliError';
import { ParameterNotDefinedError } from './errors/ParameterNotDefinedError';
import { SaveConfigurationFileError } from './errors/SaveConfigurationFileError';
import { ConfigurationFile } from './types/ConfigurationFile';
import { loadConfigurationFile } from './utils/LoadConfigurationFile';
import { saveConfigurationFile } from './utils/SaveConfigurationFile';

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
}
