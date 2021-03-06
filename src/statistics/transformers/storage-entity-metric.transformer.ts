import { SystemMetric } from '../models/metrics/SystemMetric';
import { SystemMetricType } from '../models/metrics/SystemMetricType';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { StorageEntityEntity } from '../../collector/entities/storage-entity.entity';
import { StorageEntityMetricDto, StorageMetricEntityHierarchyDto } from '../models/dtos/storage-metric-entity-hierarchy.dto';
import { StorageEntityType } from '../../collector/dto/owner.dto';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { StorageEntityStatus } from '../../collector/enums/storage-entity-status.enum';
import { MetricEntityInterface } from '../../collector/entities/metric-entity.interface';
import { SystemMetricReadEntity } from '../../collector/entities/system-metric-read.entity';
import { StorageEntityTransformer } from '../../collector/transformers/storage-entity.transformer';
import { StorageMetricEntityFlatDto } from '../models/dtos/storage-metric-entity-flat.dto';
import { ParityGroupMetricEntity } from '../../collector/entities/parity-group-metric.entity';

export class StorageEntityMetricTransformer {
  private static excludedMetric = [MetricType.CHANGE_DAY, MetricType.CHANGE_WEEK, MetricType.CHANGE_MONTH];

  public static transformFlat(storageEntities: StorageEntityEntity[]): StorageMetricEntityFlatDto[] {
    return storageEntities.map(
        storageEntity => {
          const dto = new StorageMetricEntityFlatDto();
          this.transformStorageEntityBase(dto, storageEntity);
          if (storageEntity.parent !== undefined) {

            dto.parent = this.transformStorageEntityBase(new StorageMetricEntityFlatDto(), storageEntity.parent) as StorageMetricEntityFlatDto;
          }
          this.transformMetrics(storageEntity, dto);
          this.transformExternals(storageEntity, dto);
          return dto;
        },
      );
  }

  public static transform(dataCenterPromise: StorageEntityEntity[]): StorageMetricEntityHierarchyDto[] {
    return dataCenterPromise.map(
      storageEntity => {
        const dto = new StorageMetricEntityHierarchyDto();
        this.transformStorageEntityBase(dto, storageEntity);
        if (storageEntity.children !== undefined && !isEmpty(storageEntity.children)) {

          dto.children = StorageEntityMetricTransformer.transform(storageEntity.children);
        } else {
          dto.children = [];
        }
        this.transformMetrics(storageEntity, dto);
        this.transformExternals(storageEntity, dto);
        return dto;
      },
    );
  }

  private static transformStorageEntityBase(dto: StorageEntityMetricDto, storageEntity: StorageEntityEntity) {
    dto.id = storageEntity.id;
    dto.name = storageEntity.name;
    dto.type = StorageEntityType[storageEntity.idType];
    dto.status = StorageEntityStatus[storageEntity.idCatComponentStatus];
    dto.referenceId = storageEntity.serialNumber;
    if (storageEntity.detail !== undefined && storageEntity.detail !== null) {
      dto.detail = StorageEntityTransformer.transformDetail(storageEntity.detail);
    }
    return dto;
  }

  private static transformExternals(storageEntity: StorageEntityEntity, dto: StorageEntityMetricDto) {
    const externals = storageEntity.externals;
    if (externals !== undefined && !isEmpty(externals)) {
      dto.externals = externals.map(externalEntity => StorageEntityTransformer.transformExternal(externalEntity));
    } else {
      dto.externals = [];
    }
  }

  private static transformMetrics(storageEntity: StorageEntityEntity, dto: StorageEntityMetricDto) {
    if (storageEntity.metrics !== undefined && !isEmpty(storageEntity.metrics)) {
      dto.metrics = storageEntity.metrics.map(StorageEntityMetricTransformer.createSystemMetric);
    } else {
      dto.metrics = [];
    }
  }

  private static createSystemMetric(metric: MetricEntityInterface): SystemMetric {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    if (StorageEntityMetricTransformer.excludedMetric.some(type => type === metric.metricTypeEntity.id)) {
      metricDetail.type = metric.metricTypeEntity.name;
    } else {
      metricDetail.type = metric.metricTypeEntity.name.replace(/(_WEEK)|(_MONTH)$/, '') as SystemMetricType;
    }
    if (metric instanceof SystemMetricReadEntity || metric instanceof ParityGroupMetricEntity) {
      metricDetail.peak = metric.peak;
    }
    if (metric instanceof ParityGroupMetricEntity) {
      metricDetail.startTime = metric.startTime.getTime();
      metricDetail.endTime = metric.endTime.getTime();
    }
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = metric.value;
    return metricDetail;
  }

}
