import { CliError } from './CliError';

export class ParameterNotDefinedError extends CliError {
    constructor(field: string) {
        super({
            code: 'CLI::0003',
            message: `${field} not defined. Please verify and try again.`,
        });
        this.name = 'ParameterNotDefinedError';
    }
}
