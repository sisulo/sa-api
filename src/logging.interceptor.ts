import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export class RequestLogMessage {
  execTime;
  responseBody;
  error;
  private body;
  private path;
  private headers;
  private params;

  constructor(body, path, headers, params) {
    this.body = body;
    this.path = path;
    this.headers = headers;
    this.params = params;
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.getArgs()[0];
    if (request === undefined) {
      return;
    }

    const message = new RequestLogMessage(
      request.body,
      request.originalUrl,
      request.headers,
      request.params,
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        map(
          data => message.responseBody = data,
        ),
        tap(() => {
          const execTime = Date.now() - now;
          message.execTime = execTime;
          this.logger.log(message);
        }),
        catchError(
          err => {
            message.error = err;
            this.logger.error(message);
            return of({ level: err.severity, message: err.message });
          },
        ),
      );
  }
}
