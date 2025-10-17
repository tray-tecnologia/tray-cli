import { CliError } from './CliError';

export class ThemeBlockedError extends CliError {
  constructor() {
    super({
      code: 'CLI::0007',
      message: 'Theme blocked from downloading and editing outside admin.',
    });
    this.name = 'ThemeBlockedError';
  }
}
