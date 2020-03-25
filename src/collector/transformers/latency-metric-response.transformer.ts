import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';
import { LatencyEntity } from '../entities/latency.entity';
import { LatencyResponseDto } from '../dto/latency-response.dto';
import { PoolDto } from '../dto/pool.dto';
import { SystemDto } from '../dto/system.dto';
import { LatencyDto } from '../dto/latency.dto';

@Injectable()
export class LatencyMetricResponseTransformer extends BaseTransformer {
  private static readonly ENTITY_TYPE = 'PoolEntity';
  private static readonly ENTITY_METRIC_TYPE = 'LatencyEntity';

  public transform(metrics: LatencyEntity[]): LatencyResponseDto {
    const response = new LatencyResponseDto();
    response.data = metrics.map(
      metric => this.tranformMetric(metric),
    );
    return response;
  }

  private tranformMetric(metric: LatencyEntity) {
    const response = new LatencyDto();
    this.assertNotNull(
      metric.pool,
      metric,
      LatencyMetricResponseTransformer.ENTITY_TYPE,
      LatencyMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.pool.system,
      metric,
      LatencyMetricResponseTransformer.ENTITY_TYPE,
      LatencyMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.metricTypeEntity,
      metric,
      LatencyMetricResponseTransformer.ENTITY_TYPE,
      LatencyMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    response.id = metric.idBlockSizeLatency;
    response.pool = new PoolDto();
    response.pool.idPool = metric.pool.id;
    response.pool.name = metric.pool.name;
    response.pool.system = new SystemDto();
    response.pool.system.idSystem = metric.pool.system.id;
    response.pool.system.name = metric.pool.system.name;
    response.metricType = metric.metricTypeEntity.name;
    response.blockSize = metric.blockSize;
    response.latency = metric.latency;
    response.count = metric.count;
    // response.id = metric.owner.owner.id;
    // response.systemName = metric.owner.owner.name;
    // response.value = metric.value;
    // response.date = metric.date;
    // response.metricType = metric.metricTypeEntity.name;
    // response.id = metric.owner.id;
    // response.hostGroupName = metric.owner.name;
    return response;
  }
}
