import { Controller, Get, Param, Query } from '@nestjs/common';
import { DataCenterStatisticsService } from '../data-center-statistics/data-center-statistics.service';
import { MetricGroup } from '../../collector/data-center.service';

@Controller('api/v1/statistics/')
export class StatisticsController { // Todo rename controller
  constructor(private dataCenterStatisticsService: DataCenterStatisticsService) {
  }

  @Get('performance/:idDataCenter') // Todo better resource like API
  performanceStatistics(@Param('idDataCenter') idDataCenter: number, @Query('date') date: Date) {
    // Todo date, idDatacenter validation
    return this.dataCenterStatisticsService.getMetricByIdDatacenter(MetricGroup.PERFORMANCE, idDataCenter, date);
  }

  @Get('capacity/:idDataCenter')
  capacityStatistics(@Param('idDataCenter') idDataCenter: number, @Query('date') date: Date) {
    // Todo date, idDatacenter validation
    return this.dataCenterStatisticsService.getMetricByIdDatacenter(MetricGroup.CAPACITY, idDataCenter, date);
  }

  @Get('cha/:idDataCenter')
  channelAdaptersStatistics(@Param('idDataCenter') idDataCenter: number, @Query('date') date: Date) {
    // Todo date, idDatacenter validation
    return this.dataCenterStatisticsService.getMetricByIdDatacenter(MetricGroup.ADAPTERS, idDataCenter, date);
  }
}
