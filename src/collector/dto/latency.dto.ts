import { PoolDto } from './pool.dto';

export class LatencyDto {
  id: number;
  blockSize: number;
  latency: number;
  count: number;
  metricType: string;
  pool: PoolDto;
}
