import { MetricType } from '../enums/metric-type.enum';

export class MetricRequestDto {

  readonly metricType: MetricType;

  readonly value: number;

  //@IsValidDate({ message: 'Date \'$value\' is not valid date value or it is in the future' })
  readonly date: Date;

}
