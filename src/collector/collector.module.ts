import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMetricEntity } from './entities/system-metric.entity';
import { SystemMetricService } from './services/system-metric.service';
import { SystemMetricController } from './controllers/system-metric.controller';
import { CatMetricTypeEntity } from './entities/cat-metric-type.entity';
import { SystemEntity } from './entities/system.entity';
import { PoolMetricController } from './controllers/pool-metric.controller';
import { PoolMetricEntity } from './entities/pool-metric.entity';
import { PoolMetricService } from './services/pool-metric.service';
import { PoolEntity } from './entities/pool.entity';
import { SystemService } from './services/system.service';
import { PoolService } from './services/pool.service';
import { ChaMetricController } from './controllers/cha-metric.controller';
import { ChaMetricService } from './services/cha-metric.service';
import { ChaService } from './services/cha.service';
import { ChaMetricEntity } from './entities/cha-metric.entity';
import { ChaEntity } from './entities/cha.entity';
import { DataCenterEntity } from './entities/data-center.entity';
import { DataCenterService } from './services/data-center.service';
import { MetricTypeService } from './services/metric-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemMetricEntity]),
    TypeOrmModule.forFeature([CatMetricTypeEntity]),
    TypeOrmModule.forFeature([SystemEntity]),
    TypeOrmModule.forFeature([PoolMetricEntity]),
    TypeOrmModule.forFeature([PoolEntity]),
    TypeOrmModule.forFeature([ChaMetricEntity]),
    TypeOrmModule.forFeature([ChaEntity]),
    TypeOrmModule.forFeature([DataCenterEntity]),
  ],
  providers: [SystemMetricService, PoolMetricService, PoolService, SystemService, ChaMetricService, ChaService, DataCenterService, MetricTypeService],
  controllers: [SystemMetricController, PoolMetricController, ChaMetricController],
  exports: [DataCenterService],
})
export class CollectorModule {
}
