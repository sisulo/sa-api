import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { StorageEntityType } from '../owner.dto';

@Injectable()
export class DuplicateStorageEntityRequestPipe implements PipeTransform {
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

    const { types } = value;
    if (types) {
      value.types = types.map(item => {
        const convertedValue = StorageEntityType[item];
        if (convertedValue === undefined) {
          throw new HttpException(`Cannot convert \'${item}\' to StorageEntityType value.`, HttpStatus.BAD_REQUEST);
        }
        return convertedValue;
      });
    }
    return value;
  }
}
