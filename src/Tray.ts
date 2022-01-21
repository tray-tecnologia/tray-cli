import Sdk from 'opencode-sdk';
import ora, { Ora } from 'ora';

import CliSaveConfigurationFileError from './errors/CliSaveConfigurationFileError';
import { ConfigurationFile } from './types/ConfigurationFile';
import { TrayConfig } from './types/TrayConfig';
import { saveConfigurationFile } from './utils/SaveConfigurationFile';

export default class Tray {
    readonly debug: boolean;
    readonly key: string;
    readonly password: string;
    readonly themeId: number | null;
    readonly verbose: boolean;
    loader: Ora | null;

    constructor({ key, password, themeId, debug, verbose = false }: TrayConfig) {
        this.key = key;
        this.password = password;
        this.themeId = themeId;
        this.debug = debug;
        this.verbose = verbose;
        this.loader = null;
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
     * Display message to user
     * @param {string} message Message to be shown
     * @param {'info' | 'succeed' | 'fail' | 'warn' | 'stop' | 'start'} type Type of verbose output. Same from Ora.
     * @private
     */
    private outputVerboseMode(
        message: string,
        type: 'info' | 'succeed' | 'fail' | 'warn' | 'stop' | 'start' = 'start'
    ) {
        if (this.verbose) {
            if (this.loader) {
                switch (type) {
                    case 'info':
                        this.loader.info(message);
                        this.loader = null;
                        break;

                    case 'succeed':
                        this.loader.succeed(message);
                        this.loader = null;
                        break;

                    case 'fail':
                        this.loader.fail(message);
                        this.loader = null;
                        break;

                    case 'warn':
                        this.loader.warn(message);
                        this.loader = null;
                        break;

                    case 'stop':
                    default:
                        this.loader.stop();
                        this.loader = null;
                        break;
                }
            } else if (type === 'start') {
                this.loader = ora(message).start();
            }
        }
    }

    /**
     * Configure CLI use generating config.yml file
     */
    configure() {
        const api = this.createSdkInstance();

        this.outputVerboseMode('Verifying data...', 'start');

        return api
            .checkConfiguration()
            .then((data) => {
                this.outputVerboseMode('Data verified', 'succeed');
                this.outputVerboseMode('Creating config.yml file...', 'start');

                const fileData: ConfigurationFile = {
                    key: this.key,
                    password: this.password,
                    themeId: this.themeId,
                    previewUrl: data.preview ?? '',
                    debug: this.debug,
                };

                return saveConfigurationFile(fileData)
                    .then((success) => {
                        this.outputVerboseMode(success, 'succeed');
                        return true;
                    })
                    .catch((error: CliSaveConfigurationFileError) => {
                        this.outputVerboseMode(error.toString(), 'fail');
                        return false;
                    });
            })
            .catch((error: any) => {
                this.outputVerboseMode(error.toString(), 'fail');
                return false;
            });
    }

    /**
     * List all available themes.
     * @param {'stdout' | 'data'} output How to return themes list. 'stdout' will show into console, 'data' will return an object.
     */
    list(output: 'stdout' | 'data' = 'data') {
        const api = this.createSdkInstance();

        this.outputVerboseMode('Getting all available themes', 'start');

        return api
            .getThemes()
            .then((data) => {
                this.outputVerboseMode(`Themes retrieved. Showing available:`, 'succeed');
                return output === 'stdout' ? console.table(data.themes) : data;
            })
            .catch((error) => {
                this.outputVerboseMode(error.toString(), 'fail');
                return false;
            });
    }
}
