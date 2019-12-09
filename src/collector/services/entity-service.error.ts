import { BadRequestException } from '@nestjs/common';

export class EntityServiceError extends BadRequestException {
  constructor(msg: string) {
    super(msg);
  }
}
