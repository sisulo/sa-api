import { Controller, Get, Param, Query } from '@nestjs/common';
import { DataCenterStatisticsService } from '../services/data-center-statistics.service';
import { DataCenterService, MetricGroup } from '../../collector/services/data-center.service';
import { StatisticParams } from './params/statistic.params';
import { StatisticQueryParams } from './params/statistics.query-params';
import { InfrastructureTransformer } from '../infrastructure.transformer';

@Controller('api/v1/datacenters/')
export class DataCenterStatisticsController {
  constructor(private dataCenterStatisticsService: DataCenterStatisticsService,
              private dataCenterService: DataCenterService) {
  }

  @Get('/')
  async infrastructureMap() {
    const entities = await this.dataCenterService.getAllDataCenters();
    return InfrastructureTransformer.transform(entities);
  }

  @Get('performance')
  performanceStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.PERFORMANCE, null, queryParams.date);
  }

  @Get(':idDataCenter/performance')
  performanceStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.PERFORMANCE, params.idDataCenter, queryParams.date);
  }

  @Get('capacity')
  capacityStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.CAPACITY, null, queryParams.date);
  }

  @Get(':idDataCenter/capacity')
  capacityStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.CAPACITY, params.idDataCenter, queryParams.date);
  }

  @Get('adapters')
  channelAdaptersStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.ADAPTERS, null, queryParams.date);
  }

  @Get(':idDataCenter/adapters')
  channelAdaptersStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.ADAPTERS, params.idDataCenter, queryParams.date);
  }

  @Get('sla')
  slaStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.SLA, null, queryParams.date);
  }

  @Get(':idDataCenter/sla')
  slaStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.SLA, params.idDataCenter, queryParams.date);
  }

  @Get('host-groups')
  hostGroupStatisticsAll(@Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.HOSTGROUPS, null, queryParams.date);
  }

  @Get(':idDataCenter/host-groups')
  hostGroupStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.HOSTGROUPS, params.idDataCenter, queryParams.date);
  }
}
