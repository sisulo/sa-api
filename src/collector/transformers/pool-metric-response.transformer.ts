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
    this.assertNotNull(metric.owner, metric, PoolMetricResponseTransformer.ENTITY_TYPE, PoolMetricResponseTransformer.ENTITY_METRIC_TYPE);
    this.assertNotNull(metric.owner.system, metric, PoolMetricResponseTransformer.ENTITY_TYPE, PoolMetricResponseTransformer.ENTITY_METRIC_TYPE);
    this.assertNotNull(metric.metricTypeEntity, metric, PoolMetricResponseTransformer.ENTITY_TYPE, PoolMetricResponseTransformer.ENTITY_METRIC_TYPE);
    response.idMetric = metric.id;
    response.date = metric.date;
    response.value = metric.value;
    response.idPool = metric.owner.id;
    response.poolName = metric.owner.name;
    response.idSystem = metric.owner.system.id;
    response.systemName = metric.owner.system.name;
    response.metricType = metric.metricTypeEntity.name;
    return response;
  }
}
