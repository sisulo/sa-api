import { Body, Controller, Get, Param } from '@nestjs/common';
import { PerformanceMetricService } from '../../performance-metric/performance-metric.service';


@Controller('api/v1/statistics/')
export class PerformanceController {
  constructor(private performanceMetricService: PerformanceMetricService) {}
  @Get('performance/:idDatacenter')
  performanceStatistics(@Param('idDatacenter') idDatacenter) {
    // TODO date in param
    return this.performanceMetricService.getMetricByIdDatacenter(idDatacenter, new Date());
  }
}
