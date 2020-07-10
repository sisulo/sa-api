import { TransformationError } from './transformation.error';
import { MetricResponseDto } from '../dto/metric-response.dto';
import { MetricType } from '../enums/metric-type.enum';
import { Owner, StorageEntityType } from '../dto/owner.dto';
import { SystemMetricEntity } from '../entities/system-metric.entity';
import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { PortMetricEntity } from '../entities/port-metric.entity';
import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { LatencyEntity } from '../entities/latency.entity';
import { ComponentStatus } from '../enums/component.status';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { StorageEntityTransformer } from './storage-entity.transformer';

export class MetricTransformer {

  public static transform(metricEntity: SystemMetricEntity | PoolMetricEntity |
    ChaMetricEntity | PortMetricEntity | HostGroupMetricEntity | LatencyEntity):
    MetricResponseDto {
    const dto = new MetricResponseDto();

    dto.idMetric = metricEntity.id;
    dto.metricType = MetricTransformer.transformMetricType(metricEntity.idType);
    dto.value = metricEntity.value;
    dto.date = metricEntity.date;
    if (metricEntity instanceof SystemMetricEntity && metricEntity.peak !== undefined) {
      dto.peak = metricEntity.peak;
    }

    dto.owner = StorageEntityTransformer.transformFromOwner(metricEntity.owner);

    return dto;
  }

  private static transformMetricType(type: MetricType): string {
    if (type !== undefined && MetricType[type]) {
      return MetricType[type];
    }
    throw new TransformationError(`Metric type \'${type}\' from entity is not in enum 'MetricType'`);
  }
}
