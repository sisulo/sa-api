import { CapacityStatisticsEntity } from '../collector/entities/capacity-statistics.entity';
import { Metric } from './models/metrics/Metric';
import { GlobalCapacityStatisticsDto } from './models/dtos/global-capacity-statistics.dto';

export class GlobalCapacityTransformer {
  public static async transform(entities: Promise<CapacityStatisticsEntity[]>): Promise<GlobalCapacityStatisticsDto> {
    const data = await entities;
    const dto = new GlobalCapacityStatisticsDto();
    dto.metrics = data.map(entity => {
      const metric = new Metric();
      metric.value = entity.value;
      metric.unit = entity.metricTypeEntity.unit;
      metric.type = entity.metricTypeEntity.name;
      return metric;
    });
    return dto;
  }
}
