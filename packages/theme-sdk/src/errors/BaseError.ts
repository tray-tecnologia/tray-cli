import chalk from 'chalk';
import { EOL } from 'node:os';
import type { BaseErrorParams } from '#theme-sdk/types';

export class BaseError extends Error {
  code: string;

  constructor({ code, message }: BaseErrorParams) {
    super(message);
    this.code = code;
    this.name = 'BaseError';
  }

  toString() {
    return (
      `${chalk.bold.redBright(this.name + ':')}${EOL}` +
      `${chalk.cyan(`[${this.code}]`)} ${chalk.yellow(`${this.message}`)}`
    );
  }
}
