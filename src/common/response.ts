// 响应格式化

import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface data<T> {
  data: T;
}

@Injectable()
class Response<T = any> implements NestInterceptor {
  intercept(_, next: CallHandler): Observable<data<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
        };
      }),
    );
  }
}

export default Response;
