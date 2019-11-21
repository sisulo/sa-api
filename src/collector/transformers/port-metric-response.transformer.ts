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
      metric.port,
      metric,
      PortMetricResponseTransformer.ENTITY_TYPE,
      PortMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.port.system,
      metric,
      PortMetricResponseTransformer.ENTITY_TYPE,
      PortMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.port.system.system,
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
    response.idCha = metric.port.system.idCha;
    response.chaName = metric.port.system.name;
    response.value = metric.value;
    response.date = metric.date;
    response.metricType = metric.metricTypeEntity.name;
    response.idSystem = metric.port.system.system.idSystem;
    response.systemName = metric.port.system.system.name;
    response.idPort = metric.port.idPort;
    response.portName = metric.port.name;
    return response;
  }
}
