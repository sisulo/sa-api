import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { StorageEntityType } from '../owner.dto';

@Injectable()
export class StorageEntityRequestPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body') {
      return this.transformQuery(value);
    }

    return value;
  }

  transformQuery(value: any) {
    if (typeof value !== 'object' || !value) {
      return value;
    }

    const { type } = value;
    if (type) {
      const convertedValue = StorageEntityType[type];
      if (convertedValue === undefined) {
        throw new HttpException(`Cannot convert \'${type}\' to StorageEntityType value.`, HttpStatus.BAD_REQUEST);
      }
      value.type = convertedValue;
    }

    return value;
  }
}
