type ApiErrorParams = {
    code: string;
    message: string;
    details?: string;
    data?: object;
};

export class ApiError extends Error {
    code: string;
    details?: string;
    data?: object;

    constructor({ code, message, details, data }: ApiErrorParams) {
        super(message);
        this.code = code;
        this.details = details;
        this.data = data;
        this.name = 'ApiError';
    }

    toString() {
        return `[${this.name}] [${this.code}]: ${this.message}`;
    }
}
