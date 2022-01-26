import { CliError } from './CliError';

export class FileNotFoundError extends CliError {
    constructor(details: string) {
        super({
            code: 'CLI::0002',
            message: 'Config.yml file not found on current directory. Verify and try again.',
            details,
        });
        this.name = 'FileNotFoundError';
    }
}
