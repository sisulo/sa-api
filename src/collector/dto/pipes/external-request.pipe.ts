import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { ExternalType } from '../../enums/external-type.enum';

@Injectable()
export class ExternalRequestPipe implements PipeTransform {
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

    const { data } = value;
    if (data !== undefined && data.length) {
      value.data = data.map(item => {
        const convertedType = ExternalType[item.type];
        if (convertedType === undefined) {
          throw new HttpException(`Cannot convert \'${convertedType}\' to MetricType value.`, HttpStatus.BAD_REQUEST);
        }
        return { value: item.value, type: convertedType };
      });
    }

    return value;
  }
}
