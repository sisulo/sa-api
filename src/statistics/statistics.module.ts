import { Module } from '@nestjs/common';
import { DataCenterStatisticsController } from './controllers/data-center-statistics.controller';
import { DataCenterStatisticsService } from './services/data-center-statistics.service';
import { CollectorModule } from '../collector/collector.module';
import { InfrastructureStatisticsController } from './controllers/infrastructure-statistics.controller';
import { GraphDataService } from './services/graph-data.service';

@Module({
  controllers: [DataCenterStatisticsController, InfrastructureStatisticsController],
  providers: [DataCenterStatisticsService, GraphDataService],
  imports: [CollectorModule],
})
export class StatisticsModule {}
