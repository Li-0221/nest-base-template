import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception.getStatus();

    // 获取 NestJS 抛出的原始错误信息
    // 可能是 string (如 throw new BadRequestException('msg'))
    // 也可能是 object (如 ValidationPipe 抛出的)
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let error = exception.name;

    if (typeof exceptionResponse === "string") {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
      const res = exceptionResponse as any;
      if (res.message) {
        // 兼容 ValidationPipe 的错误格式 { message: [ '...' ], ... }
        message = res.message;
      }
      if (res.error) {
        error = res.error;
      }
    }

    response.status(code).json({
      code,
      error,
      message,
      data: null,
      success: false
    });
  }
}

export default HttpExceptionFilter;
