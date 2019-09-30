import { Controller, Get } from '@nestjs/common';
import { CapacityStatisticsService } from '../../collector/services/capacity-statistics.service';
import { GlobalCapacityTransformer } from '../global-capacity-transformer';
import { DataCenterStatisticsService } from '../services/data-center-statistics.service';
import { InfraStatisticsTransformer } from '../infra-statistics.transformer';

@Controller('api/v1/infrastructure')
export class InfrastructureStatisticsController {
  constructor(private capacityStatisticsService: CapacityStatisticsService,
              private dataCenterService: DataCenterStatisticsService) {
  }

  @Get('/capacity')
  public getInfrastructureCapacity() {
    return GlobalCapacityTransformer.transform(this.capacityStatisticsService.getCapacityStatistics());
  }

  @Get('/host-group-capacity')
  public getHostGroupCapacity() {
    return GlobalCapacityTransformer.transformHostGroups(this.capacityStatisticsService.getHostGroupCapacityStatistics());
  }

  @Get('alerts')
  public getInfrastructureAlerts() {
    return InfraStatisticsTransformer.transform(
      this.dataCenterService.getAlerts(),
      this.dataCenterService.getMetrics(),
    );
  }
}
