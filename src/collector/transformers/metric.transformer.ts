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

    dto.owner = MetricTransformer.transformFromOwner(metricEntity.owner);

    return dto;
  }

  private static transformMetricType(type: MetricType): string {
    if (type !== undefined && MetricType[type]) {
      return MetricType[type];
    }
    throw new TransformationError(`Metric type \'${type}\' from entity is not in enum 'MetricType'`);
  }

  public static transformFromOwner(metricOwner, reverse = false) {
    if (metricOwner === null) {
      throw new TransformationError(`Cannot transform owner because it is null`);
    }
    const dto = new Owner();
    dto.id = metricOwner.id;
    dto.name = metricOwner.name;
    dto.type = MetricTransformer.resolveOwnerType(metricOwner);
    dto.status = this.resolveStatus(metricOwner);
    if (reverse === false && metricOwner.parent !== undefined && metricOwner.parent !== null) {
      dto.parent = MetricTransformer.transformFromOwner(metricOwner.parent);
    } else if (reverse === true && !isEmpty(metricOwner.children)) {
      dto.children = metricOwner.children.map(child => MetricTransformer.transformFromOwner(child, reverse));
    }
    if (metricOwner.serialNumber !== null) {
      dto.serialNumber = metricOwner.serialNumber;
    }
    return dto;
  }

  private static resolveStatus(metricOwner) {
    return ComponentStatus[metricOwner.idCatComponentStatus];
  }

  private static resolveOwnerType(metricOwner) {
    switch (metricOwner.idType) {
      case StorageEntityType.SYSTEM:
        return StorageEntityType[StorageEntityType.SYSTEM];
      case StorageEntityType.POOL:
        return StorageEntityType[StorageEntityType.POOL];
      case StorageEntityType.HOST_GROUP:
        return StorageEntityType[StorageEntityType.HOST_GROUP];
      case StorageEntityType.ADAPTER:
        return StorageEntityType[StorageEntityType.ADAPTER];
      case StorageEntityType.PORT:
        return StorageEntityType[StorageEntityType.PORT];
      case StorageEntityType.DATA_CENTER:
        return StorageEntityType[StorageEntityType.DATA_CENTER];
      default:
        throw new TransformationError(`Type '${metricOwner.constructor.name}' is not possible to map to StorageEntityType`);
    }
  }
}
