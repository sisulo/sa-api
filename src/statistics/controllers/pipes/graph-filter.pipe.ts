import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { MetricType } from '../../../collector/enums/metric-type.enum';

@Injectable()
export class GraphFilterPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'query') {
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
      value.types = types.map(type => {
        return MetricType[type];
      });
    }

    return value;
  }
}
