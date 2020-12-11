import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { StorageEntityStatus } from '../../enums/storage-entity-status.enum';
import { StorageEntityType } from '../owner.dto';

@Injectable()
export class StorageEntityTypePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'query') {
      return this.transformQuery(value);
    }

    return value;
  }

  private transformQuery(value: any) {
    if (typeof value === 'object' || !value) {
      return value;
    }
    if (value) {
      return this.convertValue(value);
    }
  }

  private convertValue(value) {
    const convertedValue = StorageEntityType[value];
    if (convertedValue === undefined) {
      throw new HttpException(`Cannot convert \'${value}\' to StorageEntityType value.`, HttpStatus.BAD_REQUEST);
    }
    return convertedValue;
  }
}
