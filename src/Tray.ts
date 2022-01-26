import Sdk, { ApiError, ApiListThemesResponse, Config } from 'opencode-sdk';

import { CliError } from './errors/CliError';
import { SaveConfigurationFileError } from './errors/SaveConfigurationFileError';
import { ConfigurationFile } from './types/ConfigurationFile';
import { saveConfigurationFile } from './utils/SaveConfigurationFile';

export class Tray {
    readonly debug: boolean;
    readonly key: string;
    readonly password: string;
    readonly themeId: number | null;

    /**
     * Create new Tray instance
     * @param {Config}
     */
    constructor({ key, password, themeId, debug }: Config) {
        this.key = key;
        this.password = password;
        this.themeId = themeId;
        this.debug = debug ?? false;
    }

    /**
     * Create an sdk instance
     * @private
     */
    private createSdkInstance() {
        return new Sdk({
            key: this.key,
            password: this.password,
            themeId: this.themeId,
            debug: this.debug,
        });
    }

    /**
     * Configure CLI use generating config.yml file
     * @return {Promise} Return string if promise resolves, ApiError or CliError otherwise
     */
    configure(): Promise<string> {
        const api = this.createSdkInstance();

        return api
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
        const api = this.createSdkInstance();

        return api
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
        const api = this.createSdkInstance();

        return api
            .cleanCache(id)
            .then((success) => Promise.resolve(success))
            .catch((error) => Promise.reject(error));
    }
}
