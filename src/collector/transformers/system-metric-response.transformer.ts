import { SystemMetricEntity } from '../entities/system-metric.entity';
import { SystemMetricResponseDto } from '../dto/system-metric-response.dto';
import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';

@Injectable()
export class SystemMetricResponseTransformer extends BaseTransformer {
  private static readonly ENTITY_TYPE = 'SystemEntity';
  private static readonly ENTITY_METRIC_TYPE = 'SystemMetricEntity';

  public transform(metric: SystemMetricEntity): SystemMetricResponseDto {
    const response = new SystemMetricResponseDto();
    this.assertNotNull(
      metric.owner,
      metric,
      SystemMetricResponseTransformer.ENTITY_TYPE,
      SystemMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.metricTypeEntity,
      metric,
      SystemMetricResponseTransformer.ENTITY_TYPE,
      SystemMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    response.idMetric = metric.id;
    response.date = metric.date;
    response.value = metric.value;
    response.peak = metric.peak;
    response.idSystem = metric.owner.id;
    response.systemName = metric.owner.name;
    response.metricType = metric.metricTypeEntity.name;
    return response;
  }
}
