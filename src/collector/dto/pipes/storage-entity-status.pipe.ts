import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { ComponentStatus } from '../../enums/component.status';

@Injectable()
export class StorageEntityStatusPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body') {
      return this.transformBody(value);
    }

    return value;
  }

  transformBody(value: any) {
    if (typeof value !== 'object' || !value) {
      return value;
    }

    const { status } = value;
    if (status) {
      const convertedValue = ComponentStatus[status];
      if (convertedValue === undefined) {
        throw new HttpException(`Cannot convert \'${status}\' to ComponentStatus value.`, HttpStatus.BAD_REQUEST);
      }
      value.status = convertedValue;
    }

    return value;
  }
}
