import { TransformationError } from './transformation.error';
import { MetricResponseDto } from '../dto/metric-response.dto';
import { MetricType } from '../enums/metric-type.enum';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { Owner, StorageEntityType } from '../dto/owner.dto';
import { SystemEntity } from '../entities/system.entity';
import { PoolEntity } from '../entities/pool.entity';
import { HostGroupEntity } from '../entities/host-group.entity';
import { ChaEntity } from '../entities/cha.entity';
import { PortEntity } from '../entities/port.entity';
import { SystemMetricEntity } from '../entities/system-metric.entity';
import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { PortMetricEntity } from '../entities/port-metric.entity';
import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { LatencyEntity } from '../entities/latency.entity';
import { ComponentStatus } from '../enums/component.status';
import { DataCenterEntity } from '../entities/data-center.entity';

export class MetricTransformer {

  public static transform(metricEntity: SystemMetricEntity | PoolMetricEntity |
    ChaMetricEntity | PortMetricEntity | HostGroupMetricEntity| LatencyEntity):
    MetricResponseDto {
    const dto = new MetricResponseDto();

    dto.idMetric = metricEntity.id;
    dto.metricType = MetricTransformer.transformMetricType(metricEntity.metricTypeEntity);
    dto.value = metricEntity.value;
    dto.date = metricEntity.date;
    if (metricEntity instanceof SystemMetricEntity && metricEntity.peak !== undefined) {
      dto.peak = metricEntity.peak;
    }

    dto.owner = MetricTransformer.transformOwner(metricEntity.owner);

    return dto;
  }

  private static transformMetricType(metricTypeEntity: CatMetricTypeEntity): string {
    if (metricTypeEntity !== undefined && MetricType[metricTypeEntity.id]) {
      return MetricType[metricTypeEntity.id];
    }
    throw new TransformationError(`Metric type from entity is not in enum 'MetricType'`);
  }

  public static transformOwner(metricOwner) {
    if (metricOwner === null) {
      throw new TransformationError(`Cannot transform owner because it is null`);
    }
    const dto = new Owner();
    dto.id = metricOwner.id;
    dto.name = metricOwner.name;
    dto.type = MetricTransformer.resolveOwnerType(metricOwner);
    dto.status = this.resolveStatus(metricOwner);
    if (metricOwner.parent !== undefined) {
      dto.parent = MetricTransformer.transformOwner(metricOwner.parent);
    }
    return dto;
  }

  private static resolveStatus(metricOwner) {
    return ComponentStatus[metricOwner.idCatComponentStatus];
  }
  private static resolveOwnerType(metricOwner) {
    switch (metricOwner.constructor) {
      case SystemEntity:
        return StorageEntityType[StorageEntityType.SYSTEM];
      case PoolEntity:
        return StorageEntityType[StorageEntityType.POOL];
      case HostGroupEntity:
        return StorageEntityType[StorageEntityType.HOST_GROUP];
      case ChaEntity:
        return StorageEntityType[StorageEntityType.ADAPTER];
      case PortEntity:
        return StorageEntityType[StorageEntityType.PORT];
      case DataCenterEntity:
        return StorageEntityType[StorageEntityType.DATA_CENTER];
      default:
        throw new TransformationError(`Type '${metricOwner.constructor.name}' is not possible to map to StorageEntityType`);
    }
  }
}
