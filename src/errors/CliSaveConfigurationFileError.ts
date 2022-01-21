import CliError from './CliError';

export default class CliSaveConfigurationFileError extends CliError {
    constructor(details: string) {
        super({
            code: 'CLI::0001',
            message: 'Unable to save configuration file. See details for more information.',
            details,
        });
        this.name = 'CliSaveConfigurationFileError';
    }
}
