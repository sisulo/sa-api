import { Controller, Get } from '@nestjs/common';
import { CapacityStatisticsService } from '../../collector/services/capacity-statistics.service';

@Controller('api/v1/infrastructure')
export class InfrastructureStatisticsController {
  constructor(private capacityStatisticsService: CapacityStatisticsService) {
  }

  @Get('/capacity')
  public getInfrastructureCapacity() {
    return this.capacityStatisticsService.getCapacityStatistics();
  }
}
