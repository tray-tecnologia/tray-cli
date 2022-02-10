import { CliError } from './CliError';

type foundError = {
    file?: string;
    details?: string;
};

export class FileNotFoundError extends CliError {
    constructor({ file, details }: foundError) {
        super({
            code: 'CLI::0002',
            message: `${file ? `${file}` : 'File'} not found on current directory. Verify and try again.`,
            details,
        });
        this.name = 'FileNotFoundError';
    }
}
