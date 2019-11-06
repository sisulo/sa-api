import { Controller, Get, Logger, Query } from '@nestjs/common';
import { CapacityStatisticsService } from '../../collector/services/capacity-statistics.service';
import { GlobalCapacityTransformer } from '../global-capacity-transformer';
import { DataCenterStatisticsService } from '../services/data-center-statistics.service';
import { InfraStatisticsTransformer } from '../infra-statistics.transformer';
import { GraphDataService } from '../services/graph-data.service';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { GraphDataParams } from './params/graph-data.params';
import { GraphFilterPipe } from './pipes/graph-filter.pipe';
import { GraphDataTransformer } from '../graph-data.transformer';
import { AggregatedMetricService } from '../services/aggregated-metric.service';

@Controller('api/v1/infrastructure')
export class InfrastructureStatisticsController {
  private readonly logger = new Logger(InfrastructureStatisticsController.name);

  constructor(private capacityStatisticsService: CapacityStatisticsService,
              private dataCenterService: DataCenterStatisticsService,
              private graphDataService: GraphDataService,
              private aggregatedMetricService: AggregatedMetricService) {
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
      this.aggregatedMetricService.fetchAggregatedMetrics([
        MetricType.LOGICAL_CAPACITY,
        MetricType.SUBSCRIBED_CAPACITY,
        MetricType.TOTAL_SAVING_EFFECT,
        MetricType.CHANGE_MONTH,
        MetricType.PHYSICAL_CAPACITY]),
    );
  }

  @Get('performance/graph')
  public getGraphData(@Query(new GraphFilterPipe()) graphFilter: GraphDataParams) {
    this.logger.log(graphFilter);
    return GraphDataTransformer.transform(this.graphDataService.getGraphData(graphFilter));
  }

}
