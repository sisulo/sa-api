import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { ChaMetricResponseDto } from '../dto/cha-metric-response.dto';
import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';

@Injectable()
export class ChaMetricResponseTransformer extends BaseTransformer {
  private static readonly ENTITY_TYPE = 'ChaEntity';
  private static readonly ENTITY_METRIC_TYPE = 'ChaMetricEntity';

  public transform(metric: ChaMetricEntity): ChaMetricResponseDto {
    const response = new ChaMetricResponseDto();
    this.assertNotNull(metric.owner, metric, ChaMetricResponseTransformer.ENTITY_TYPE, ChaMetricResponseTransformer.ENTITY_METRIC_TYPE);
    this.assertNotNull(metric.owner.system, metric, ChaMetricResponseTransformer.ENTITY_TYPE, ChaMetricResponseTransformer.ENTITY_METRIC_TYPE);
    this.assertNotNull(metric.metricTypeEntity, metric, ChaMetricResponseTransformer.ENTITY_TYPE, ChaMetricResponseTransformer.ENTITY_METRIC_TYPE);
    response.idMetric = metric.id;
    response.idSystem = metric.owner.system.id;
    response.systemName = metric.owner.system.name;
    response.value = metric.value;
    response.date = metric.date;
    response.metricType = metric.metricTypeEntity.name;
    response.idCha = metric.owner.id;
    response.chaName = metric.owner.name;
    return response;
  }
}
