import { MetricType } from '../enums/metric-type.enum';
import { LatencyRequestDto } from './latency-request.dto';
import { Operation } from '../enums/operation';

export class MetricRequestDto {

  readonly metricType: MetricType;

  readonly value: number;

  // @IsValidDate({ message: 'Date \'$value\' is not valid date value or it is in the future' })
  readonly date: Date;

  readonly data: LatencyRequestDto[];

  readonly operation: Operation;

}
