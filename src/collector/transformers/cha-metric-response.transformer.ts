import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { ChaMetricResponseDto } from '../dto/cha-metric-response.dto';

export class ChaMetricResponseTransformer {
  static transform(metric: ChaMetricEntity): ChaMetricResponseDto {
    const response = new ChaMetricResponseDto();
    response.idMetric = metric.id;
    response.date = metric.date;
    response.value = metric.value;
    response.idCha = metric.adapter.idCha;
    response.chaName = metric.adapter.name;
    response.idSystem = metric.adapter.system.idSystem;
    response.systemName = metric.adapter.system.name;
    response.metricType = metric.metricTypeEntity.name;
    return response;
  }
}
