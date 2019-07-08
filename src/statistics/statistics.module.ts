import { Module } from '@nestjs/common';
import { PerformanceController } from './controllers/performance/performance.controller';
import { PerformanceMetricService } from './performance-metric/performance-metric.service';
import { CollectorModule } from '../collector/collector.module';

@Module({
  controllers: [PerformanceController],
  providers: [PerformanceMetricService],
  imports: [CollectorModule],
})
export class StatisticsModule {}
