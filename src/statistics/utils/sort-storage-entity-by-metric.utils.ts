import { StorageEntityEntity } from '../../collector/entities/storage-entity.entity';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { OrderByVo } from './vo/order-by.vo';

export enum OrderByDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortStorageEntityByMetricUtils {
  public static sort(storageEntities: StorageEntityEntity[], orderBy: OrderByVo[]) {
    storageEntities.forEach(entity => {
      if (isEmpty(entity.children)) {
        return;
      } else {
        if (entity.children.some(child => !isEmpty(child.metrics))) {
          entity.children = this.sortByMetrics(entity.children, orderBy);
        } else {
          entity.children = this.sort(entity.children, orderBy);
        }
      }
    });
    return this.sortParentEntities(storageEntities, orderBy);
  }

  private static sortByMetrics(metrics: StorageEntityEntity[], orderBy: OrderByVo[]) {
    return metrics.sort((a, b) => this.compare(a, b, orderBy, (storageEntity, type) => this.getMetricValue(storageEntity, type)));
  }

  private static compare(a: StorageEntityEntity, b: StorageEntityEntity, orderBy: OrderByVo[], getMetric: (storageEntity, type) => number) {
    const orderByValue = orderBy[0];
    let aValue;
    let bValue;
    if (orderByValue.direction === OrderByDirection.ASC) {
      aValue = getMetric(a, orderByValue.type);
      bValue = getMetric(b, orderByValue.type);
    } else {
      aValue = getMetric(b, orderByValue.type);
      bValue = getMetric(a, orderByValue.type);
    }
    if (aValue > bValue) {
      return 1;
    }
    if (aValue < bValue) {
      return -1;
    }
    if (orderBy.length === 1) {
      return 0;
    }
    return this.compare(a, b, orderBy.slice(1), getMetric);
  }

  private static getMetricValue(storageEntity: StorageEntityEntity, type: MetricType) {
    const foundMetric = storageEntity.metrics.find(metric => metric.metricTypeEntity.id === type);
    if (foundMetric === undefined) {
      return null;
    }
    return foundMetric.value;
  }

  private static sortParentEntities(storageEntities: StorageEntityEntity[], orderBy: OrderByVo[]) {
    return storageEntities.sort((a, b) => this.compare(a, b, orderBy, (storageEntity, type) => this.getMetricValueFromParent(storageEntity, type)));
  }

  private static getMetricValueFromParent(storageEntity: StorageEntityEntity, type: MetricType) {
    if (!isEmpty(storageEntity.children)) {
      return this.getMetricValueFromParent(storageEntity.children[0], type);
    }
    if (!isEmpty(storageEntity.metrics)) {
      return this.getMetricValue(storageEntity, type);
    }
    return null;
  }
}
