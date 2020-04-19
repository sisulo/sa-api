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
import { CapacityStatisticsService } from './services/capacity-statistics.service';
import { MetricController } from './controllers/metric.controller';
import { HostGroupMetricEntity } from './entities/host-group-metric.entity';
import { HostGroupEntity } from './entities/host-group.entity';
import { SystemMetricReadEntity } from './entities/system-metric-read.entity';
import { PoolMetricReadEntity } from './entities/pool-metric-read.entity';
import { ChaMetricReadEntity } from './entities/cha-metric-read.entity';
import { PortMetricService } from './services/port-metric.service';
import { PortMetricEntity } from './entities/port-metric.entity';
import { PortEntity } from './entities/port.entity';
import { PortMetricReadEntity } from './entities/port-metric-read.entity';
import { PortService } from './services/port.service';
import { CatExternalTypeEntity } from './entities/cat-external-type.entity';
import { ExternalEntity } from './entities/external.entity';
import { ExternalService } from './services/external.service';
import { ExternalTypeService } from './services/external-type.service';
import { ExternalController } from './controllers/external.controller';
import { LatencyMetricTransformer } from './transformers/latency-metric.transformer';
import { LatencyEntity } from './entities/latency.entity';
import { LatencyMetricService } from './services/latency-metric.service';
import { OperationService } from './services/operation.service';
import { CatOperationEntity } from './entities/cat-operation.entity';
import { StorageEntityController } from './controllers/v2/storage-entity.controller';
import { StorageEntityService } from './services/storage-entity.service';
import { StorageEntityEntity } from './entities/storage-entity.entity';
import { StorageEntityRepository } from './repositories/storage-entity.repository';
import { MetricCollectorService } from './services/collect/metric-collector.service';
import { MetricRepositoryFactory } from './factory/metric-repository.factory';
import { MultiValueMetricCollectorService } from './services/collect/multi-value-metric-collector.service';

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
        HostGroupMetricEntity,
        HostGroupEntity,
        PortEntity,
        PortMetricEntity,
        PortMetricReadEntity,
        CatExternalTypeEntity,
        ExternalEntity,
        LatencyEntity,
        CatOperationEntity,
        StorageEntityEntity,
        /**
         * Custom repositories
         */
        StorageEntityRepository,
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
    DataCenterService,
    MetricTypeService,
    CapacityStatisticsService,
    PortMetricService,
    PortService,
    LatencyMetricTransformer,
    DataCenterService,
    ExternalService,
    ExternalTypeService,
    LatencyMetricService,
    OperationService,
    StorageEntityService,
    MetricCollectorService,
    MetricRepositoryFactory,
    MultiValueMetricCollectorService,
  ],
  controllers: [
    MetricController,
    ExternalController,
    StorageEntityController,
  ],
  exports: [DataCenterService,
    CapacityStatisticsService,
    ChaMetricService,
    PoolMetricService,
    PortMetricService,
    SystemMetricService,
    DataCenterService,
    MetricTypeService,
    LatencyMetricService,
    SystemService,
    StorageEntityService,
  ],
})
export class CollectorModule {
}
