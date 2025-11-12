// NestJS 提供了多个内置异常类，用于常见的 HTTP 状态码，使用这些异常类可以进一步简化代码：

// BadRequestException - 400 错误
// UnauthorizedException - 401 错误
// ForbiddenException - 403 错误
// NotFoundException - 404 错误
// ConflictException - 409 错误
// GoneException - 410 错误
// InternalServerErrorException - 500 错误

// ----使用方法
// throw new InternalServerErrorException('An error');
// ----响应格式
// {
//   "data": {
//     "message": "An error",
//     "error": "Internal Server Error",
//     "statusCode": 500
//   },
//   "code": 500,
//   "success": false,
// }

import { Injectable, NestInterceptor, CallHandler } from "@nestjs/common";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

interface data<T> {
  data: T;
}

@Injectable()
class Response<T = any> implements NestInterceptor {
  intercept(_, next: CallHandler): Observable<data<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          data,
          code: 200,
          success: true
        };
      })
    );
  }
}

export default Response;
