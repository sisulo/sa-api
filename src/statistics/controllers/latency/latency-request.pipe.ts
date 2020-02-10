import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { OperationType } from '../../../collector/enums/operation-type.enum';

@Injectable()
export class LatencyRequestPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body') {
      return this.transformOperation(value);
    }

    return value;
  }

  transformOperation(value: any) {
    if (typeof value !== 'object' || !value) {
      return value;
    }

    const { operations } = value;
    if (operations) {
      value.operations = operations.map(type => {
        return OperationType[type];
      });
    }

    return value;
  }
}
