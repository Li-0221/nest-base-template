// pipe校验错误时，返回的错误信息格式化

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const code = exception.getStatus();
    const data = exception.getResponse();

    response.status(code).json({
      data,
      code,
      path: request.url,
    });
  }
}

export default HttpFilter;
