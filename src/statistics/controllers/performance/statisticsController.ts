import { Controller, Get, Param, Query } from '@nestjs/common';
import { PerformanceMetricService } from '../../performance-metric/performance-metric.service';
import { CapacityMetricService } from '../../capacity-metric/capacity-metric.service';
import { ChannelAdapterMetricService } from '../../channel-adapter-metric/channel-adapter-metric.service';

@Controller('api/v1/statistics/')
export class StatisticsController { // Todo rename controller
  constructor(private performanceMetricService: PerformanceMetricService,
              private capacityMetricService: CapacityMetricService,
              private adaptersMetricService: ChannelAdapterMetricService) {}
  @Get('performance/:idDataCenter') // Todo better resource like API
  performanceStatistics(@Param('idDataCenter') idDatacenter: number, @Query('date') date: Date) {
    // Todo date, idDatacenter validation
    return this.performanceMetricService.getMetricByIdDatacenter(idDatacenter, date);
  }

  @Get('capacity/:idDataCenter')
  capacityStatistics(@Param('idDataCenter') idDatacenter: number, @Query('date') date: Date) {
    // Todo date, idDatacenter validation
    return this.capacityMetricService.getMetricByIdDatacenter(idDatacenter, date);
  }

  @Get('cha/:idDataCenter')
  channelAdaptersStatistics(@Param('idDataCenter') idDatacenter: number, @Query('date') date: Date) {
    // Todo date, idDatacenter validation
    return this.adaptersMetricService.getMetricByIdDatacenter(idDatacenter, date);
  }
}
