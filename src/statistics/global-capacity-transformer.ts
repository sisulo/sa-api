import { GlobalCapacityStatisticsDto } from './models/dtos/global-capacity-statistics.dto';
import { SystemEntity } from '../collector/entities/system.entity';
import { CapacityMetricTransformer } from './capacity-metric.transformer';

export class GlobalCapacityTransformer {
  public static async transform(entities: Promise<SystemEntity[]>): Promise<GlobalCapacityStatisticsDto> {
    const data = await entities;
    const dto = new GlobalCapacityStatisticsDto();
    dto.systems = data.map(system => CapacityMetricTransformer.createSystemPool(system));
    return dto;
  }

}
