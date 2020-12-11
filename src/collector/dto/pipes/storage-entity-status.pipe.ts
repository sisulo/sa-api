import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { StorageEntityStatus } from '../../enums/storage-entity-status.enum';

@Injectable()
export class StorageEntityStatusPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body') {
      return this.transformBody(value);
    } else if (type === 'query') {
      return this.transformQuery(value);
    }

    return value;
  }

  transformBody(value: any) {
    if (typeof value !== 'object' || !value) {
      return value;
    }

    const { status } = value;
    if (status) {
      value.status = this.convertValue(status)[0];
    }

    return value;
  }

  private transformQuery(value: any) {
    if (typeof value === 'object' && !Array.isArray(value) || !value) {
      return value;
    }
    if (value) {
      return this.convertValue(value);
    }
  }

  private convertValue(value) {
    let convertedValue;
    if(Array.isArray(value)) {
      convertedValue = value.map(val => StorageEntityStatus[val]);
    } else {
      convertedValue = [StorageEntityStatus[value]];
    }

    if (convertedValue === undefined) {
      throw new HttpException(`Cannot convert \'${value}\' to ComponentStatus value.`, HttpStatus.BAD_REQUEST);
    }
    return convertedValue;
  }
}
