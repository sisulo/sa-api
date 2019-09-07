import { Controller, Get } from '@nestjs/common';
import { CapacityStatisticsService } from '../../collector/services/capacity-statistics.service';
import { GlobalCapacityTransformer } from '../global-capacity-transformer';

@Controller('api/v1/infrastructure')
export class InfrastructureStatisticsController {
  constructor(private capacityStatisticsService: CapacityStatisticsService) {
  }

  @Get('/capacity')
  public getInfrastructureCapacity() {
    return GlobalCapacityTransformer.transform(this.capacityStatisticsService.getCapacityStatistics());
  }

  @Get('/host-group-capacity')
  public getHostGroupCapacity() {
    return GlobalCapacityTransformer.transformHostGroups(this.capacityStatisticsService.getHostGroupCapacityStatistics());
  }
}
