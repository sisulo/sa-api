import { SystemMetricEntity } from '../entities/system-metric.entity';
import { SystemMetricResponseDto } from '../dto/system-metric-response.dto';

export class SystemMetricResponseTransformer {
  static transform(metric: SystemMetricEntity): SystemMetricResponseDto {
    const response = new SystemMetricResponseDto();
    response.idMetric = metric.id;
    response.date = metric.date;
    response.value = metric.value;
    response.idSystem = metric.idSystem;
    response.systemName = metric.system.name;
    response.metricType = metric.metricTypeEntity.name;
    return response;
  }
}
