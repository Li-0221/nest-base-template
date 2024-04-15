// 请求日志中间件

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createLogger, transports, format } from 'winston';
import dayjs from 'dayjs';
import { isObjectEmpty } from '@/utils';

const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `logs/request.log`,
      maxsize: 1024 * 1024 * 10,
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      const time = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
      return `${time} [${level}]: ${message}`;
    }),
  ),
});

@Injectable()
class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl, ip, body, query } = req;
    console.log('\x1b[32m' + '-'.repeat(30) + '\x1b[0m');
    logger.info(`Method: ${method}, URL: ${baseUrl}, IP: ${ip}`);
    if (!isObjectEmpty(body)) logger.debug(` Body: ${JSON.stringify(body)}`);
    if (!isObjectEmpty(query)) logger.debug(` Query: ${JSON.stringify(query)}`);
    next();
  }
}

export default LoggerMiddleware;
