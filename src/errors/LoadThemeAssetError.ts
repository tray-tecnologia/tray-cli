import { EOL } from 'os';

import { CliError } from './CliError';

export class LoadThemeAssetError extends CliError {
    constructor(details: string) {
        super({
            code: 'CLI::0005',
            message: 'Unable to load theme asset data. See details for more information.',
            details,
        });
        this.name = 'LoadThemeAssetError';
    }

    toString(): string {
        return `[${this.name}] [${this.code}]: ${this.message}${EOL}${this.details}`;
    }
}
