import chalk from 'chalk';
import { EOL } from 'os';
import { BaseError } from './BaseError';
import type { RequestErrorParams } from '#theme-sdk/types.ts';

export class RequestError extends BaseError {
  details: string;
  request: object;

  constructor({ code, message, details, request }: RequestErrorParams) {
    super({
      code: code ?? 'SDK-9001',
      message:
        message ?? 'An error occurred while making the request. Please verify and try again.',
    });
    this.details = details;
    this.request = request;
    this.name = 'RequestError';
  }

  toString() {
    return (
      `${chalk.bold.redBright(this.name + ':')}${EOL}` +
      `${chalk.cyan(`[${this.code}]`)} ${chalk.yellow(`${this.message}${EOL}`)}` +
      `Details: ${this.details}`
    );
  }
}
