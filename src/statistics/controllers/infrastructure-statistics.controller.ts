import { Controller, Get, Logger, Query } from '@nestjs/common';
import { CapacityStatisticsService } from '../../collector/services/capacity-statistics.service';
import { GlobalCapacityTransformer } from '../transformers/global-capacity-transformer';
import { DataCenterStatisticsService } from '../services/data-center-statistics.service';
import { GraphDataService, ServiceType } from '../services/graph-data.service';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { GraphDataParams } from './params/graph-data.params';
import { GraphFilterPipe } from './pipes/graph-filter.pipe';
import { GraphDataTransformer } from '../transformers/graph-data.transformer';
import { Region } from '../models/dtos/region.enum';
import { InfraStatisticsTransformer } from '../transformers/infra-statistics.transformer';
import { PoolAggregatedMetricService } from '../services/pool-aggregated-metric.service';
import { SystemAggregatedMetricService } from '../services/system-aggregated-metric.service';
import { RegionMetricInterface } from '../services/aggregated-metric.service';

@Controller('api/v1/infrastructure')
export class InfrastructureStatisticsController {
  private readonly logger = new Logger(InfrastructureStatisticsController.name);

  constructor(private capacityStatisticsService: CapacityStatisticsService,
              private dataCenterService: DataCenterStatisticsService,
              private graphDataService: GraphDataService,
              private poolAggregatedMetricService: PoolAggregatedMetricService,
              private systemAggregatedMetricService: SystemAggregatedMetricService) {
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
  public async getInfrastructureAlerts() {
    const perfMetrics = await this.systemAggregatedMetricService.fetchAggregatedMetricsGrouped([
        MetricType.WORKLOAD,
        MetricType.TRANSFER,
      ],
      [Region.AMERICA, Region.EUROPE, Region.ASIA],
    );
    const capMetrics = await this.poolAggregatedMetricService.fetchAggregatedMetricsGrouped([
        MetricType.LOGICAL_CAPACITY,
        MetricType.SUBSCRIBED_CAPACITY,
        MetricType.TOTAL_SAVING_EFFECT,
        MetricType.CHANGE_MONTH,
        MetricType.PHYSICAL_CAPACITY],
      [Region.AMERICA, Region.EUROPE, Region.ASIA],
    );
    return InfraStatisticsTransformer.transform(
      this.dataCenterService.getAlerts(),
      this.mergeRegionMetrics(perfMetrics, capMetrics, [Region.AMERICA, Region.EUROPE, Region.ASIA]),
    );
  }

  @Get('performance/graph')
  public getPerformanceGraphData(@Query(new GraphFilterPipe()) graphFilter: GraphDataParams) {
    return GraphDataTransformer.transform(this.graphDataService.getGraphData(graphFilter, ServiceType.SYSTEM));
  }

  @Get('capacity/graph')
  public getCapacityGraphData(@Query(new GraphFilterPipe()) graphFilter: GraphDataParams) {
    return GraphDataTransformer.transform(this.graphDataService.getGraphData(graphFilter, ServiceType.POOL));
  }

  mergeRegionMetrics(performanceMetrics: RegionMetricInterface[], capacityMetrics: RegionMetricInterface[], returnedRegions: Region[]): RegionMetricInterface[] {
    const mergedMetrics = [];
    returnedRegions.forEach(regionVal => {
      const perf = this.findRegionMetrics(performanceMetrics, regionVal);
      const capMetrics = this.findRegionMetrics(capacityMetrics, regionVal);
      const allMetrics = { region: regionVal, metrics: [...perf.metrics, ...capMetrics.metrics] };
      mergedMetrics.push(allMetrics);
    });
    return mergedMetrics;
  }

  private findRegionMetrics(perfMetrics: RegionMetricInterface[], region: Region) {
    const regionData = perfMetrics.find(regionDataMetrics => regionDataMetrics.region === region);
    if (regionData === undefined) {
      return { region, metrics: [] };
    }
    return regionData;
  }
}
