import { Module } from '@nestjs/common';
import { StatisticsController } from './controllers/statisticsController';
import { DataCenterStatisticsService } from './data-center-statistics/data-center-statistics.service';
import { CollectorModule } from '../collector/collector.module';

@Module({
  controllers: [StatisticsController],
  providers: [DataCenterStatisticsService],
  imports: [CollectorModule],
})
export class StatisticsModule {}
