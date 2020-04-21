import { Controller, Get, Param, Query } from '@nestjs/common';
import { DataCenterStatisticsService } from '../services/data-center-statistics.service';
import { DataCenterService, MetricGroup } from '../../collector/services/data-center.service';
import { StatisticParams } from './params/statistic.params';
import { StatisticQueryParams } from './params/statistics.query-params';
import { StorageEntityTransformer } from '../../collector/transformers/storage-entity.transformer';
import { StorageEntityResponseDto } from '../../collector/dto/storage-entity-response.dto';
import { MetricType } from '../../collector/enums/metric-type.enum';

@Controller('api/v1/datacenters/')
export class DataCenterStatisticsController {
  constructor(private dataCenterStatisticsService: DataCenterStatisticsService,
              private dataCenterService: DataCenterService) {
  }

  @Get('/')
  async infrastructureMap(): Promise<StorageEntityResponseDto[]> {
    const entities = await this.dataCenterService.getAllDataCenters();
    return StorageEntityTransformer.transformAll(entities, true);
  }

  @Get('performance')
  performanceStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterService.getPerformanceMetrics([MetricType.WORKLOAD], []);
  }

  @Get(':idDataCenter/performance')
  performanceStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterService.getPerformanceMetrics([MetricType.WORKLOAD], []);
  }

  @Get('capacity')
  capacityStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterService.getPoolMetrics([MetricType.PHYSICAL_CAPACITY], []);
    // return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.CAPACITY, null);
  }

  @Get(':idDataCenter/capacity')
  capacityStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.CAPACITY, params.idDataCenter);
  }

  @Get('adapters')
  channelAdaptersStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterService.getChannelAdapterMetrics([MetricType.IMBALANCE_EVENTS, MetricType.PORT_IMBALANCE_EVENTS], []);
  }

  @Get(':idDataCenter/adapters')
  channelAdaptersStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    // return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.ADAPTERS, params.idDataCenter, queryParams.period);
  }

  @Get('sla')
  slaStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.SLA, null, queryParams.period);
  }

  @Get(':idDataCenter/sla')
  slaStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.SLA, params.idDataCenter, queryParams.period);
  }

  @Get('host-groups')
  hostGroupStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterService.getHostGroupMetrics([MetricType.NET_TOTAL], []);
  }

  @Get(':idDataCenter/host-groups')
  hostGroupStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.HOST_GROUPS, params.idDataCenter);
  }
}
