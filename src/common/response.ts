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
        const code = data.responseCode || 200;
        if (data.responseCode) delete data.responseCode;
        return {
          data,
          code,
          success: true,
        };
      }),
    );
  }
}

// 如果希望返回500
// return {
//   responseCode: 500,
//   message: `当前类别下有 个软件，无法删除`,
// };

// 返回的内容
// {
//   "data": {
//     "message": "当前类别下有 个软件，无法删除"
//   },
//   "code": 500,
//   "success": true
// }

export default Response;
