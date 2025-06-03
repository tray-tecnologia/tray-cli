type CliErrorParams = {
    code: string;
    message: string;
    details?: string;
    data?: object;
};

export class CliError extends Error {
    code: string;
    details?: string;
    data?: object;

    constructor({ code, message, details, data }: CliErrorParams) {
        super(message);
        this.code = code;
        this.details = details;
        this.data = data;
        this.name = 'CliError';
    }

    toString() {
        return `[${this.name}] [${this.code}]: ${this.message}`;
    }
}
