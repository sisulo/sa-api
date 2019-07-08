import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMetricEntity } from './entities/system-metric.entity';
import { SystemMetricService } from './system-metric.service';
import { SystemMetricController } from './controllers/system-metric.controller';
import { CatMetricTypeEntity } from './entities/cat-metric-type.entity';
import { SystemEntity } from './entities/system.entity';
import { PoolMetricController } from './controllers/pool-metric.controller';
import { PoolMetricEntity } from './entities/pool-metric.entity';
import { PoolMetricService } from './pool-metric.service';
import { PoolEntity } from './entities/pool.entity';
import { SystemService } from './system.service';
import { PoolService } from './pool.service';
import { ChaMetricController } from './controllers/cha-metric.controller';
import { ChaMetricService } from './cha-metric.service';
import { ChaService } from './cha.service';
import { ChaMetricEntity } from './entities/cha-metric.entity';
import { ChaEntity } from './entities/cha.entity';
import { DataCenterEntity } from './entities/data-center.entity';
import { DataCenterService } from './data-center.service';

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
  providers: [SystemMetricService, PoolMetricService, PoolService, SystemService, ChaMetricService, ChaService, DataCenterService],
  controllers: [SystemMetricController, PoolMetricController, ChaMetricController],
  exports: [DataCenterService],
})
export class CollectorModule {
}
