import { MetricResponseDto } from './metric-response.dto';
import { OperationType } from '../enums/operation-type.enum';

export class LatencyMetricDto extends MetricResponseDto {
  blockSize: number;
  latency: number;
  operationType: OperationType;
}
