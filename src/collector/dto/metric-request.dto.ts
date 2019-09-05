import { MetricType } from '../enums/metric-type.enum';
import { IsValidDate } from '../../statistics/controllers/params/is-valid-date.validator';

export class MetricRequestDto {

  readonly metricType: MetricType;

  readonly value: number;

  @IsValidDate({ message: 'Date \'$value\' is not valid date value or it is in the future' })
  readonly date: Date;

}
