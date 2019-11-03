import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { CapacityStatisticsService } from '../../collector/services/capacity-statistics.service';
import { GlobalCapacityTransformer } from '../global-capacity-transformer';
import { DataCenterStatisticsService } from '../services/data-center-statistics.service';
import { InfraStatisticsTransformer } from '../infra-statistics.transformer';
import { GraphDataService } from '../services/graph-data.service';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { loggers } from 'winston';
import { GraphDataParams } from './params/graph-data.params';
import { GraphFilterPipe } from './pipes/graph-filter.pipe';
import { GraphDataTransformer } from '../graph-data.transformer';

@Controller('api/v1/infrastructure')
export class InfrastructureStatisticsController {
  private readonly logger = new Logger(InfrastructureStatisticsController.name);

  constructor(private capacityStatisticsService: CapacityStatisticsService,
              private dataCenterService: DataCenterStatisticsService,
              private graphDataService: GraphDataService) {
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
      this.dataCenterService.getCapacityMetrics(),
    );
  }

  @Get('performance/graph')
  public getGraphData(@Query(new GraphFilterPipe()) graphFilter: GraphDataParams) {
    this.logger.log(graphFilter);
    return GraphDataTransformer.transform(this.graphDataService.getGraphData(graphFilter));
  }
}
