import { ValueTransformer } from 'typeorm';
import { MetricType } from '../enums/metric-type.enum';

export const MetricTypeTransformer: ValueTransformer = {
  from: value => {
    return MetricType[value];
  },
  to: value => {
    return MetricType[value];
  }
}
