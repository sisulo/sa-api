import { NotFoundException } from '@nestjs/common';

export class HostGroupNotFound extends NotFoundException {
  constructor(msg: string) {
    super(msg);
  }
}
