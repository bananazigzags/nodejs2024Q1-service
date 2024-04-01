import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
  constructor() {
    super('Log');
    this.setLogLevels(process.env.LOG_LEVELS.split(', ') as LogLevel[]);
  }
}
