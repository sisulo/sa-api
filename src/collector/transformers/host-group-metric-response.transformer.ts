import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { HostGroupMetricResponseDto } from '../dto/host-group-metric-response.dto';
import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';

@Injectable()
export class HostGroupMetricResponseTransformer extends BaseTransformer {
  private static readonly ENTITY_TYPE = 'ChaEntity';
  private static readonly ENTITY_METRIC_TYPE = 'ChaMetricEntity';

  public transform(metric: HostGroupMetricEntity): HostGroupMetricResponseDto {
    // Todo duplicated code in pool, cha, sla transformers
    const response = new HostGroupMetricResponseDto();
    this.assertNotNull(
      metric.hostGroup,
      metric,
      HostGroupMetricResponseTransformer.ENTITY_TYPE,
      HostGroupMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.hostGroup.system,
      metric,
      HostGroupMetricResponseTransformer.ENTITY_TYPE,
      HostGroupMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(metric.metricTypeEntity,
      metric,
      HostGroupMetricResponseTransformer.ENTITY_TYPE,
      HostGroupMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    response.idMetric = metric.id;
    response.idSystem = metric.hostGroup.system.idSystem;
    response.systemName = metric.hostGroup.system.name;
    response.value = metric.value;
    response.date = metric.date;
    response.metricType = metric.metricTypeEntity.name;
    response.idHostGroup = metric.hostGroup.idHostGroup;
    response.hostGroupName = metric.hostGroup.name;
    return response;
  }
}
