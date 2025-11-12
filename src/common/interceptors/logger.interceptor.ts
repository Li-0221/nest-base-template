import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const { method, url, ip } = request;

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const delay = Date.now() - now;
          const statusCode = response.statusCode;
          this.logger.log(`${method} ${url} ${statusCode} - ${ip} +${delay}ms`);
        },
        error: err => {
          const delay = Date.now() - now;
          const status = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
          this.logger.error(`${method} ${url} ${status} - ${ip} +${delay}ms`);
        }
      })
    );
  }
}
