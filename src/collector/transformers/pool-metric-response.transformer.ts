import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { PoolMetricResponseDto } from '../dto/pool-metric-response.dto';

export class PoolMetricResponseTransformer {
  static transform(metric: PoolMetricEntity): PoolMetricResponseDto {
    const response = new PoolMetricResponseDto();
    response.idMetric = metric.id;
    response.date = metric.date;
    response.value = metric.value;
    response.idPool = metric.idPool;
    response.poolName = metric.pool.name;
    response.idSystem = metric.idSystem;
    response.systemName = metric.pool.system.name;
    response.metricType = metric.metricTypeEntity.name;
    return response;
  }
}
