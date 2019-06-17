import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolMetric } from './entities/pool_metric';
import { PoolMetricService } from './pool-metric.service';
import { PoolMetricController } from './pool-metric.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PoolMetric])],
  providers: [PoolMetricService],
  controllers: [PoolMetricController],
})
export class CollectorModule {}
