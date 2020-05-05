import { SystemMetric } from '../models/metrics/SystemMetric';
import { SystemMetricType } from '../models/metrics/SystemMetricType';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { StorageEntityEntity } from '../../collector/entities/storage-entity.entity';
import { StorageEntityMetricDto } from '../models/dtos/storage-entity-metric.dto';
import { StorageEntityType } from '../../collector/dto/owner.dto';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { ComponentStatus } from '../../collector/enums/component.status';
import { MetricEntityInterface } from '../../collector/entities/metric-entity.interface';
import { SystemMetricReadEntity } from '../../collector/entities/system-metric-read.entity';

export class StorageEntityMetricTransformer {
  private static excludedMetric = [MetricType.CHANGE_DAY, MetricType.CHANGE_WEEK, MetricType.CHANGE_MONTH];

  public static transform(dataCenterPromise: StorageEntityEntity[]): StorageEntityMetricDto[] {
    return dataCenterPromise.map(
      storageEntity => {
        const dto = new StorageEntityMetricDto();
        dto.id = storageEntity.id;
        dto.name = storageEntity.name;
        dto.type = StorageEntityType[storageEntity.idType];
        dto.status = ComponentStatus[storageEntity.idCatComponentStatus];
        dto.serialNumber = storageEntity.serialNumber;
        if (storageEntity.children !== undefined && !isEmpty(storageEntity.children)) {

          dto.children = StorageEntityMetricTransformer.transform(storageEntity.children);
        } else {
          dto.children = [];
        }
        if (storageEntity.metrics !== undefined && !isEmpty(storageEntity.metrics)) {
          dto.metrics = storageEntity.metrics.map(StorageEntityMetricTransformer.createSystemMetric);
        } else {
          dto.metrics = [];
        }
        return dto;
      },
    );
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
