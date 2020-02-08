import { MetricType } from '../enums/metric-type.enum';
import { LatencyRequestDto } from './latency-request.dto';
import { OperationType } from '../enums/operation-type.enum';

export class MetricRequestDto {

  readonly metricType: MetricType;

  readonly value: number;

  // @IsValidDate({ message: 'Date \'$value\' is not valid date value or it is in the future' })
  readonly date: Date;

  readonly data: LatencyRequestDto[];

  readonly operation: OperationType;

}
