import Sdk, { ApiError, ApiListThemesResponse } from 'opencode-sdk';

import { CliError } from './errors/CliError';
import { SaveConfigurationFileError } from './errors/SaveConfigurationFileError';
import { ConfigurationFile } from './types/ConfigurationFile';
import { loadConfigurationFile } from './utils/LoadConfigurationFile';
import { saveConfigurationFile } from './utils/SaveConfigurationFile';

export class Tray {
    readonly key: string;
    readonly password: string;
    readonly themeId?: number;
    readonly previewUrl?: string;
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
}
