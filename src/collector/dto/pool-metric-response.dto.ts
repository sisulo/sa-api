import { MetricResponseDto } from './metric-response.dto';

export class PoolMetricResponseDto extends MetricResponseDto {
  idPool: number;
  poolName: string;
}
