import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { PoolMetricResponseDto } from '../dto/pool-metric-response.dto';
import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';

@Injectable()
export class PoolMetricResponseTransformer extends BaseTransformer {
  private static readonly ENTITY_TYPE = 'PoolEntity';
  private static readonly ENTITY_METRIC_TYPE = 'PoolMetricEntity';

  transform(metric: PoolMetricEntity): PoolMetricResponseDto {
    const response = new PoolMetricResponseDto();
    this.assertNotNull(metric.pool, metric, PoolMetricResponseTransformer.ENTITY_TYPE, PoolMetricResponseTransformer.ENTITY_METRIC_TYPE);
    this.assertNotNull(metric.pool.system, metric, PoolMetricResponseTransformer.ENTITY_TYPE, PoolMetricResponseTransformer.ENTITY_METRIC_TYPE);
    this.assertNotNull(metric.metricTypeEntity, metric, PoolMetricResponseTransformer.ENTITY_TYPE, PoolMetricResponseTransformer.ENTITY_METRIC_TYPE);
    response.idMetric = metric.id;
    response.date = metric.date;
    response.value = metric.value;
    response.idPool = metric.pool.idPool;
    response.poolName = metric.pool.name;
    response.idSystem = metric.pool.system.idSystem;
    response.systemName = metric.pool.system.name;
    response.metricType = metric.metricTypeEntity.name;
    return response;
  }
}
