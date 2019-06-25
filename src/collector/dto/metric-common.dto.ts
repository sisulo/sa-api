import { MetricType } from '../enums/metric-type.enum';

export class MetricCommonDto {

  readonly metricType: MetricType;

  readonly value: string;

  readonly date: Date;

}
