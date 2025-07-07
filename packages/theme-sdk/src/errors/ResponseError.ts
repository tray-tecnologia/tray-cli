import chalk from 'chalk';
import { EOL } from 'node:os';
import { BaseError } from './BaseError';
import type { ResponseErrorParams } from '#theme-sdk/types';

export class ResponseError extends BaseError {
  status: number;
  body: unknown;

  constructor({ code, message, status, body }: ResponseErrorParams) {
    super({
      code: code ?? 'SDK-9002',
      message: message ?? 'Bad response received from server. Please verify and try again.',
    });
    this.status = status;
    this.body = body;
    this.name = 'ResponseError';
  }

  toString() {
    return (
      `${chalk.bold.redBright(this.name + ':')}${EOL}` +
      `${chalk.cyan(`[${this.code}](${this.status})`)} ${chalk.yellow(`${this.message}${EOL}`)}` +
      `Body: ${JSON.stringify(this.body, null, 2)}`
    );
  }
}
