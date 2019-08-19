import { Module } from '@nestjs/common';
import { DataCenterStatisticsController } from './controllers/data-center-statistics.controller';
import { DataCenterStatisticsService } from './services/data-center-statistics.service';
import { CollectorModule } from '../collector/collector.module';
import { InfrastructureStatisticsController } from './controllers/infrastructure-statistics.controller';

@Module({
  controllers: [DataCenterStatisticsController, InfrastructureStatisticsController],
  providers: [DataCenterStatisticsService],
  imports: [CollectorModule],
})
export class StatisticsModule {}
