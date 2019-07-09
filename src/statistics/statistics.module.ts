import { Module } from '@nestjs/common';
import { PerformanceController } from './controllers/performance/performance.controller';
import { PerformanceMetricService } from './performance-metric/performance-metric.service';
import { CollectorModule } from '../collector/collector.module';
import { CapacityMetricService } from './capacity-metric/capacity-metric.service';

@Module({
  controllers: [PerformanceController],
  providers: [PerformanceMetricService, CapacityMetricService],
  imports: [CollectorModule],
})
export class StatisticsModule {}
