import { EOL } from 'os';

import { CliError } from './CliError';

export class SaveThemeAssetError extends CliError {
    constructor(details: string) {
        super({
            code: 'CLI::0004',
            message: 'Unable to save theme asset. See details for more information.',
            details,
        });
        this.name = 'SaveThemeAssetError';
    }

    toString(): string {
        return `[${this.name}] [${this.code}]: ${this.message}${EOL}${this.details}`;
    }
}
