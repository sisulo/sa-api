import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';
import { PortMetricEntity } from '../entities/port-metric.entity';
import { PortMetricResponseDto } from '../dto/port-metric-response.dto';

@Injectable()
export class PortMetricResponseTransformer extends BaseTransformer {
  private static readonly ENTITY_TYPE = 'PortEntity';
  private static readonly ENTITY_METRIC_TYPE = 'PortMetricEntity';

  public transform(metric: PortMetricEntity): PortMetricResponseDto {
    const response = new PortMetricResponseDto();
    this.assertNotNull(
      metric.owner,
      metric,
      PortMetricResponseTransformer.ENTITY_TYPE,
      PortMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.owner.system,
      metric,
      PortMetricResponseTransformer.ENTITY_TYPE,
      PortMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.owner.system.system,
      metric,
      PortMetricResponseTransformer.ENTITY_TYPE,
      PortMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.metricTypeEntity,
      metric,
      PortMetricResponseTransformer.ENTITY_TYPE,
      PortMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    response.idMetric = metric.id;
    response.idCha = metric.owner.system.id;
    response.chaName = metric.owner.system.name;
    response.value = metric.value;
    response.date = metric.date;
    response.metricType = metric.metricTypeEntity.name;
    response.idSystem = metric.owner.system.system.id;
    response.systemName = metric.owner.system.system.name;
    response.idPort = metric.owner.id;
    response.portName = metric.owner.name;
    return response;
  }
}
