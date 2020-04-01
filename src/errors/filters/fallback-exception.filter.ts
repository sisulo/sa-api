import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../error.dto';
import { ErrorCodeConst } from '../error-code.enum';

export class FallbackErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = new ErrorDto();
    error.message = ErrorCodeConst.UNKNOWN_ERROR.message;
    error.code = ErrorCodeConst.UNKNOWN_ERROR.code;

    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(error);
  }
}
