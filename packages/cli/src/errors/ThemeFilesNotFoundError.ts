import { CliError } from './CliError';

export class ThemeFilesNotFoundError extends CliError {
    constructor() {
        super({
            code: 'CLI::0006',
            message: 'Themes files not found on current directory. Verify and try again.',
        });
        this.name = 'ThemeFilesNotFoundError';
    }
}
