import { MetricType } from '../../collector/enums/metric-type.enum';
import { SystemMetricType } from '../models/metrics/SystemMetricType';

export class TypeMappingUtils {
  public static resolveMetricType(type: MetricType): SystemMetricType {
    switch (type) {
      case MetricType.TRANSFER:
        return SystemMetricType.TRANSFER;
      case MetricType.WORKLOAD:
        return SystemMetricType.WORKLOAD;
      case MetricType.CHANGE_MONTH:
        return SystemMetricType.CAPACITY_CHANGE_1M;
      case MetricType.SUBSCRIBED_CAPACITY:
        return SystemMetricType.SUBSCRIBED_CAPACITY;
      case MetricType.PHYSICAL_CAPACITY:
        return SystemMetricType.PHYSICAL_CAPACITY;
      case MetricType.LOGICAL_CAPACITY:
        return SystemMetricType.LOGICAL_CAPACITY;
      case MetricType.TOTAL_SAVING_EFFECT:
        return SystemMetricType.TOTAL_SAVING_EFFECT;
    }
  }
}
