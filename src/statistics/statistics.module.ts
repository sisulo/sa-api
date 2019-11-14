import { Module } from '@nestjs/common';
import { DataCenterStatisticsController } from './controllers/data-center-statistics.controller';
import { DataCenterStatisticsService } from './services/data-center-statistics.service';
import { CollectorModule } from '../collector/collector.module';
import { InfrastructureStatisticsController } from './controllers/infrastructure-statistics.controller';
import { GraphDataService } from './services/graph-data.service';
import { PoolAggregatedMetricService } from './services/pool-aggregated-metric.service';
import { SystemAggregatedMetricService } from './services/system-aggregated-metric.service';

@Module({
  controllers: [DataCenterStatisticsController, InfrastructureStatisticsController],
  providers: [DataCenterStatisticsService, GraphDataService, PoolAggregatedMetricService, SystemAggregatedMetricService],
  imports: [CollectorModule],
})
export class StatisticsModule {
}
