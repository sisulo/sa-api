import { SystemMetric } from '../models/metrics/SystemMetric';
import { SystemMetricType } from '../models/metrics/SystemMetricType';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { StorageEntityEntity } from '../../collector/entities/storage-entity.entity';
import { StorageEntityMetricDto, StorageMetricEntityHierarchyDto } from '../models/dtos/storage-metric-entity-hierarchy.dto';
import { StorageEntityType } from '../../collector/dto/owner.dto';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { ComponentStatus } from '../../collector/enums/component.status';
import { MetricEntityInterface } from '../../collector/entities/metric-entity.interface';
import { SystemMetricReadEntity } from '../../collector/entities/system-metric-read.entity';
import { StorageEntityTransformer } from '../../collector/transformers/storage-entity.transformer';
import { StorageMetricEntityFlatDto } from '../models/dtos/storage-metric-entity-flat.dto';

export class StorageEntityMetricTransformer {
  private static excludedMetric = [MetricType.CHANGE_DAY, MetricType.CHANGE_WEEK, MetricType.CHANGE_MONTH];

  public static async transformFlat(storageEntities: StorageEntityEntity[]): Promise<StorageMetricEntityFlatDto[]> {
    return Promise.all(
      storageEntities.map(
        async storageEntity => {
          const dto = new StorageMetricEntityFlatDto();
          this.transformStorageEntityBase(dto, storageEntity);
          if (storageEntity.parent !== undefined) {

            dto.parent = this.transformStorageEntityBase(new StorageMetricEntityFlatDto(), storageEntity.parent) as StorageMetricEntityFlatDto;
          }
          this.transformMetrics(storageEntity, dto);
          await this.transformExternals(storageEntity, dto);
          return dto;
        },
      ),
    );
  }

  public static async transform(dataCenterPromise: StorageEntityEntity[]): Promise<StorageMetricEntityHierarchyDto[]> {
    return Promise.all(dataCenterPromise.map(
      async storageEntity => {
        const dto = new StorageMetricEntityHierarchyDto();
        this.transformStorageEntityBase(dto, storageEntity);
        if (storageEntity.children !== undefined && !isEmpty(storageEntity.children)) {

          dto.children = await StorageEntityMetricTransformer.transform(storageEntity.children);
        } else {
          dto.children = [];
        }
        this.transformMetrics(storageEntity, dto);
        // await this.transformExternals(storageEntity, dto);
        return dto;
      },
    ));
  }

  private static transformStorageEntityBase(dto: StorageEntityMetricDto, storageEntity: StorageEntityEntity) {
    dto.id = storageEntity.id;
    dto.name = storageEntity.name;
    dto.type = StorageEntityType[storageEntity.idType];
    dto.status = ComponentStatus[storageEntity.idCatComponentStatus];
    dto.referenceId = storageEntity.serialNumber;
    return dto;
  }

  private static async transformExternals(storageEntity: StorageEntityEntity, dto: StorageEntityMetricDto) {
    const externals = await storageEntity.externals;
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
    if (metric instanceof SystemMetricReadEntity) {
      metricDetail.peak = metric.peak;
    }
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = metric.value;
    return metricDetail;
  }

}
