import { Controller, Get, Param, Query } from '@nestjs/common';
import { DataCenterStatisticsService } from '../data-center-statistics/data-center-statistics.service';
import { MetricGroup } from '../../collector/data-center.service';
import { StatisticParams } from './params/statistic.params';
import { StatisticQueryParams } from './params/statistics.query-params';
// Todo logging request/response
// Todo Configuration Module
@Controller('api/v1/datacenters/')
export class StatisticsController {
  constructor(private dataCenterStatisticsService: DataCenterStatisticsService) {
  }

  @Get(':idDataCenter/performance') // Todo better resource like API
  performanceStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.PERFORMANCE, params.idDataCenter, queryParams.date);
  }

  @Get(':idDataCenter/capacity')
  capacityStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.CAPACITY, params.idDataCenter, queryParams.date);
  }

  @Get(':idDataCenter/adapters')
  channelAdaptersStatistics(@Param() params: StatisticParams, @Query() queryParams: StatisticQueryParams) {
    return this.dataCenterStatisticsService.getMetricByIdDataCenter(MetricGroup.ADAPTERS, params.idDataCenter, queryParams.date);
  }

}
