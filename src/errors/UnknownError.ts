import { CliError } from './CliError';

export class UnknownError extends CliError {
    constructor(message?: string) {
        super({
            code: 'CLI::9999',
            message:
                message ??
                'Sorry, a not mapped error happened. Please tray again. If issue persists, open an issue to project.',
        });
        this.name = 'UnknownError';
    }
}
