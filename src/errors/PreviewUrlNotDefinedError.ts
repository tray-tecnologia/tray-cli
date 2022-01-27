import { CliError } from './CliError';

export class PreviewUrlNotDefinedError extends CliError {
    constructor() {
        super({
            code: 'CLI::0003',
            message: 'Preview url not defined. Please verify config.yml file and try again.',
        });
        this.name = 'PreviewUrlNotDefinedError';
    }
}
