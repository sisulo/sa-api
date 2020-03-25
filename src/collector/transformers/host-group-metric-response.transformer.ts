import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { HostGroupMetricResponseDto } from '../dto/host-group-metric-response.dto';
import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';

@Injectable()
export class HostGroupMetricResponseTransformer extends BaseTransformer {
  private static readonly ENTITY_TYPE = 'ChaEntity';
  private static readonly ENTITY_METRIC_TYPE = 'ChaMetricEntity';

  public transform(metric: HostGroupMetricEntity): HostGroupMetricResponseDto {
    // Todo duplicated code in owner, cha, sla transformers
    const response = new HostGroupMetricResponseDto();
    this.assertNotNull(
      metric.owner,
      metric,
      HostGroupMetricResponseTransformer.ENTITY_TYPE,
      HostGroupMetricResponseTransformer.ENTITY_METRIC_TYPE,
    );
    this.assertNotNull(
      metric.owner.system,
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
    response.idSystem = metric.owner.system.id;
    response.systemName = metric.owner.system.name;
    response.value = metric.value;
    response.date = metric.date;
    response.metricType = metric.metricTypeEntity.name;
    response.idHostGroup = metric.owner.id;
    response.hostGroupName = metric.owner.name;
    return response;
  }
}
