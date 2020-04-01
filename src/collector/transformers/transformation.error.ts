import { SaApiException } from '../../errors/sa-api.exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodeConst } from '../../errors/error-code.enum';

export class TransformationError extends SaApiException {
  constructor(msg: string) {
    super(ErrorCodeConst.UNKNOWN_ERROR, msg, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
