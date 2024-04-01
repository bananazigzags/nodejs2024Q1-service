import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
  constructor() {
    super('Log', {
      logLevels: (process.env.LOG_LEVELS.split(', ') as LogLevel[]) || [
        'log',
        'error',
        'warn',
        'debug',
        'verbose',
      ],
    });
  }
}
