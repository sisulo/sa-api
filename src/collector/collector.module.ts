import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMetricEntity } from './entities/system-metric.entity';
import { SystemMetricService } from './services/system-metric.service';
import { CatMetricTypeEntity } from './entities/cat-metric-type.entity';
import { SystemEntity } from './entities/system.entity';
import { PoolMetricEntity } from './entities/pool-metric.entity';
import { PoolMetricService } from './services/pool-metric.service';
import { PoolEntity } from './entities/pool.entity';
import { SystemService } from './services/system.service';
import { PoolService } from './services/pool.service';
import { ChaMetricService } from './services/cha-metric.service';
import { ChaService } from './services/cha.service';
import { ChaMetricEntity } from './entities/cha-metric.entity';
import { ChaEntity } from './entities/cha.entity';
import { DataCenterEntity } from './entities/data-center.entity';
import { DataCenterService } from './services/data-center.service';
import { MetricTypeService } from './services/metric-type.service';
import { CapacityStatisticsEntity } from './entities/capacity-statistics.entity';
import { CapacityStatisticsService } from './services/capacity-statistics.service';
import { MetricController } from './controllers/metric.controller';
import { HostGroupCollectorFactoryImpl } from './factory/collectors/host-group-collector-factory.impl';
import { HostGroupMetricService } from './services/host-group-metric.service';
import { HostGroupMetricResponseTransformer } from './transformers/host-group-metric-response.transformer';
import { HostGroupMetricEntity } from './entities/host-group-metric.entity';
import { HostGroupService } from './services/host-group.service';
import { HostGroupEntity } from './entities/host-group.entity';
import { ApiCollectorFactoryImpl } from './factory/collectors/api-collector-factory.impl';
import { PoolCollectorFactoryImpl } from './factory/collectors/pool-collector-factory.impl';
import { PoolMetricResponseTransformer } from './transformers/pool-metric-response.transformer';
import { ChaMetricResponseTransformer } from './transformers/cha-metric-response.transformer';
import { ChaCollectorFactoryImpl } from './factory/collectors/cha-collector-factory.impl';
import { SystemMetricResponseTransformer } from './transformers/system-metric-response.transformer';
import { SystemCollectorFactoryImpl } from './factory/collectors/system-collector-factory.impl';
import { SystemMetricReadEntity } from './entities/system-metric-read.entity';
import { PoolMetricReadEntity } from './entities/pool-metric-read.entity';
import { ChaMetricReadEntity } from './entities/cha-metric-read.entity';
import { PortCollectorFactoryImpl } from './factory/collectors/port-collector-factory.impl';
import { PortMetricService } from './services/port-metric.service';
import { PortMetricEntity } from './entities/port-metric.entity';
import { PortEntity } from './entities/port.entity';
import { PortMetricReadEntity } from './entities/port-metric-read.entity';
import { PortService } from './services/port.service';
import { PortMetricResponseTransformer } from './transformers/port-metric-response.transformer';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        SystemMetricEntity,
        SystemMetricReadEntity,
        CatMetricTypeEntity,
        SystemEntity,
        PoolMetricEntity,
        PoolMetricReadEntity,
        PoolEntity,
        ChaMetricEntity,
        ChaMetricReadEntity,
        ChaEntity,
        DataCenterEntity,
        CapacityStatisticsEntity,
        HostGroupMetricEntity,
        HostGroupEntity,
        PortEntity,
        PortMetricEntity,
        PortMetricReadEntity,
      ],
    ),

  ],
  providers: [
    PoolMetricService,
    PoolService,
    SystemMetricService,
    SystemService,
    ChaMetricService,
    ChaService,
    HostGroupMetricService,
    HostGroupService,
    DataCenterService,
    MetricTypeService,
    CapacityStatisticsService,
    HostGroupCollectorFactoryImpl,
    HostGroupMetricResponseTransformer,
    ChaMetricResponseTransformer,
    SystemMetricResponseTransformer,
    PoolMetricResponseTransformer,
    ApiCollectorFactoryImpl,
    PoolCollectorFactoryImpl,
    ChaCollectorFactoryImpl,
    SystemCollectorFactoryImpl,
    PortCollectorFactoryImpl,
    PortMetricService,
    PortService,
    PortMetricResponseTransformer,
    DataCenterService,
  ],
  controllers: [MetricController],
  exports: [DataCenterService,
    CapacityStatisticsService,
    ChaMetricService,
    PoolMetricService,
    PortMetricService,
    SystemMetricService,
    DataCenterService,
    MetricTypeService,
  ],
})
export class CollectorModule {
}
