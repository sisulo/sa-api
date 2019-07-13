import { SystemMetricResponseDto } from './system-metric-response.dto';

export class PoolMetricResponseDto extends SystemMetricResponseDto {
  idPool: number;
  poolName: string;
}
