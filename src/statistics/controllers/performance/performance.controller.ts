import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { PerformanceMetricService } from '../../performance-metric/performance-metric.service';
import { CapacityMetricService } from '../../capacity-metric/capacity-metric.service';

@Controller('api/v1/statistics/')
export class PerformanceController { // Todo rename controller
  constructor(private performanceMetricService: PerformanceMetricService,
              private capacityMetricService: CapacityMetricService) {}
  @Get('performance/:idDataCenter') // Todo better resource like API
  performanceStatistics(@Param('idDataCenter') idDatacenter, @Query('date') date: Date) {
    // Todo date, idDatacenter validation
    return this.performanceMetricService.getMetricByIdDatacenter(idDatacenter, date);
  }

  @Get('capacity/:idDataCenter')
  capacityStatistics(@Param('idDataCenter') idDatacenter, @Query('date') date: Date) {
    // Todo date, idDatacenter validation
    return this.capacityMetricService.getMetricByIdDatacenter(idDatacenter, date);
  }
}
