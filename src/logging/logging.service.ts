import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { createWriteStream } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class LoggingService extends ConsoleLogger {
  constructor() {
    super('Log');
    this.setLogLevels(process.env.LOG_LEVELS.split(', ') as LogLevel[]);
  }

  ignoreIfNotEnabled(level: LogLevel) {
    if (!this.isLevelEnabled(level)) {
      return;
    }
  }

  async writeToFile(logMessage: string, options?: { isError?: boolean }) {
    const fileToWrite = join('./logs.md');
    const writeStream = createWriteStream(fileToWrite, { flags: 'a+' });
    writeStream.write(`${logMessage}\n`);

    if (options?.isError) {
      const errorFileToWrite = join('./errorLogs.md');
      const errorWriteStream = createWriteStream(errorFileToWrite, {
        flags: 'a+',
      });
      errorWriteStream.write(`${logMessage}\n`);
    }
  }

  error(message: string) {
    this.ignoreIfNotEnabled('error');
    super.error(message);
    this.writeToFile(message, { isError: true });
  }

  warn(message: string) {
    this.ignoreIfNotEnabled('warn');
    super.warn(message);
    this.writeToFile(message);
  }

  debug(message: string) {
    this.ignoreIfNotEnabled('debug');
    super.debug(message);
    this.writeToFile(message);
  }

  log(message: string) {
    this.ignoreIfNotEnabled('log');
    super.log(message);
    this.writeToFile(message);
  }

  verbose(message: string) {
    this.ignoreIfNotEnabled('verbose');
    super.verbose(message);
    this.writeToFile(message);
  }
}
