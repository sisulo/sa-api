import { SaApiException } from '../../../errors/sa-api.exception';
import { ErrorCodeConst } from '../../../errors/error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class StorageEntityAlreadyExistsError extends SaApiException {
  constructor(msg: string) {
    super(ErrorCodeConst.ENTITY_ALREADY_EXISTS, msg, HttpStatus.CONFLICT);
  }
}
