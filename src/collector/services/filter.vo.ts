import { MetricType } from '../enums/metric-type.enum';

export enum FilterOperator {
  GT = '>',
  EQ = '==',
  LT = '<',
}

export class FilterVo {
  type: MetricType;
  operator: FilterOperator;
  value: string;
}
