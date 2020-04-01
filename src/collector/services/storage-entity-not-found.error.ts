import { NotFoundException } from '@nestjs/common';

export class StorageEntityNotFound extends NotFoundException {
  constructor(msg: string) {
    super(msg);
  }
}
