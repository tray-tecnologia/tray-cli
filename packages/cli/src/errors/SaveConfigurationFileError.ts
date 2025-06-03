import { EOL } from 'os';

import { CliError } from './CliError';

export class SaveConfigurationFileError extends CliError {
    constructor(details: string) {
        super({
            code: 'CLI::0001',
            message: 'Unable to save configuration file. See details for more information.',
            details,
        });
        this.name = 'SaveConfigurationFileError';
    }

    toString(): string {
        return `[${this.name}] [${this.code}]: ${this.message}${EOL}${this.details}`;
    }
}
