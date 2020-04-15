// import { HostGroupMetricEntity } from '../collector/entities/host-group-metric.entity';
// import { CatMetricTypeEntity } from '../collector/entities/cat-metric-type.entity';
// import { HostGroupEntity } from '../collector/entities/host-group.entity';
// import { SystemEntity } from '../collector/entities/system.entity';
// import { MetricType } from '../collector/enums/metric-type.enum';
// import { MetricRequestDto } from '../collector/dto/metric-request.dto';
// import { ChaMetricEntity } from '../collector/entities/cha-metric.entity';
// import { ChaEntity } from '../collector/entities/cha.entity';
// import { PoolMetricEntity } from '../collector/entities/pool-metric.entity';
// import { PoolEntity } from '../collector/entities/pool.entity';
// import { SystemMetricEntity } from '../collector/entities/system-metric.entity';
// import { PortMetricEntity } from '../collector/entities/port-metric.entity';
// import { PortEntity } from '../collector/entities/port.entity';
// import { MetricResponseDto } from '../collector/dto/metric-response.dto';
// import { Owner } from '../collector/dto/owner.dto';
// import { LatencyEntity } from '../collector/entities/latency.entity';
// import { LatencyResponseDto } from '../collector/dto/latency-response.dto';
// import { LatencyMetricDto } from '../collector/dto/latency-metric.dto';
// import { OperationType } from '../collector/enums/operation-type.enum';
// import { StorageEntityResponseDto } from '../collector/dto/storage-entity-response.dto';
// import { ExternalEntity } from '../collector/entities/external.entity';
// import { ExternalType } from '../collector/enums/external-type.enum';
// import { ExternalDto } from '../collector/dto/external.dto';
// import { ComponentStatus } from '../collector/enums/component.status';
//
// export class CollectorUtils {
//
//   private static readonly HOST_GROUP_NAME = 'host_group_1';
//   private static readonly SYSTEM_NAME = 'System_2';
//
//   static createHostGroupMetricEntity(): HostGroupMetricEntity {
//     const type = new CatMetricTypeEntity();
//     type.name = 'NET_TOTAL';
//     type.id = 29;
//     type.unit = 'TB';
//
//     const hostGroup = this.createHostGroupEntity();
//
//     const metric = new HostGroupMetricEntity();
//     metric.id = 1;
//     metric.metricTypeEntity = type;
//     metric.date = new Date('2019-08-29');
//     metric.value = 158.6;
//     metric.owner = hostGroup;
//
//     return metric;
//   }
//
//   static createHostGroupEntity(): HostGroupEntity {
//     const hostGroup = new HostGroupEntity();
//     hostGroup.id = 2;
//     hostGroup.name = this.HOST_GROUP_NAME;
//     hostGroup.idCatComponentStatus = ComponentStatus.ACTIVE;
//     hostGroup.parent = CollectorUtils.createSystemEntity();
//     return hostGroup;
//   }
//
//   static createExternal(): ExternalEntity {
//     const external = new ExternalEntity();
//
//     external.value = 'T1';
//     external.externalTypeEntity = { idCatExternalType: ExternalType.TIER, name: 'TIER' };
//     return external;
//   }
//
//   static createHostGroupMetricResponseDto(): MetricResponseDto {
//     const dto = new MetricResponseDto();
//     dto.date = new Date('2019-08-29');
//     dto.idMetric = 1;
//     dto.metricType = 'NET_TOTAL';
//     dto.value = 158.6;
//
//     dto.owner = this.createHostGroupDto();
//
//     return dto;
//
//   }
//
//   private static createHostGroupDto() {
//     const owner = new Owner();
//     owner.id = 2;
//     owner.name = CollectorUtils.HOST_GROUP_NAME;
//     owner.type = 'HOST_GROUP';
//     owner.status = 'ACTIVE';
//
//     owner.parent = this.createSystemDto();
//
//     return owner;
//   }
//
//   static createHostGroupResponseDto(): StorageEntityResponseDto {
//     const dto = new StorageEntityResponseDto();
//     dto.storageEntity = this.createHostGroupDto();
//
//     const external = new ExternalDto();
//     external.type = ExternalType.TIER;
//     external.value = 'T1';
//     dto.externals = [external];
//     return dto;
//   }
//
//   static createHostGroupMetricRequestDto(): MetricRequestDto {
//     return {
//       metricType: MetricType.NET_TOTAL,
//       value: 123,
//       date: new Date('2019-09-01'),
//     } as (MetricRequestDto);
//   }
//
//   static createChaMetricEntity(): ChaMetricEntity {
//     const entity = new ChaMetricEntity();
//     entity.id = 2;
//     entity.owner = CollectorUtils.createAdapter();
//     entity.value = 5;
//     entity.date = new Date('2019-09-01');
//     const metricTypeEntity = new CatMetricTypeEntity();
//     metricTypeEntity.name = 'SLA_EVENTS';
//     metricTypeEntity.id = 13;
//     metricTypeEntity.unit = '';
//     entity.metricTypeEntity = metricTypeEntity;
//     return entity;
//   }
//
//   static createPort(): PortEntity {
//     const entity = new PortEntity();
//     entity.id = 1;
//     entity.name = '1D,2D';
//     entity.idCatComponentStatus = ComponentStatus.ACTIVE;
//     entity.parent = CollectorUtils.createAdapter();
//
//     return entity;
//   }
//
//   static createAdapter(): ChaEntity {
//     const entity = new ChaEntity();
//     entity.id = 1;
//     entity.name = 'Cha_1';
//     entity.idCatComponentStatus = ComponentStatus.ACTIVE;
//     entity.parent = CollectorUtils.createSystemEntity();
//
//     return entity;
//   }
//
//   static createChaMetricOwnerResponseDto(): MetricResponseDto {
//     const dto = new MetricResponseDto();
//
//     dto.idMetric = 2;
//     dto.value = 5;
//     dto.metricType = 'SLA_EVENTS';
//     dto.date = new Date('2019-09-01');
//
//     dto.owner = CollectorUtils.createAdapterDto();
//
//     return dto;
//   }
//
//   private static createAdapterDto(): Owner {
//     const adapter = new Owner();
//     adapter.id = 1;
//     adapter.name = 'Cha_1';
//     adapter.type = 'ADAPTER';
//     adapter.status = 'ACTIVE';
//
//     adapter.parent = CollectorUtils.createSystemDto();
//
//     return adapter;
//   }
//
//   static createPortMetricEntity(): PortMetricEntity {
//     const entity = new PortMetricEntity();
//     entity.owner = CollectorUtils.createPort();
//     entity.id = 2;
//     const metricTypeEntity = new CatMetricTypeEntity();
//     metricTypeEntity.name = 'IMBALANCE_EVENTS';
//     metricTypeEntity.id = 15;
//     metricTypeEntity.unit = '';
//     entity.metricTypeEntity = metricTypeEntity;
//     entity.value = 5;
//     entity.date = new Date('2019-09-01');
//     return entity;
//   }
//
//   static createPortMetricOwnerResponseDto(): MetricResponseDto {
//     const dto = new MetricResponseDto();
//     dto.idMetric = 2;
//     dto.value = 5;
//     dto.metricType = 'IMBALANCE_EVENTS';
//     dto.date = new Date('2019-09-01');
//
//     dto.owner = CollectorUtils.createPortDto();
//
//     return dto;
//   }
//
//   static createPortDto(): Owner {
//     const owner = new Owner();
//     owner.id = 1;
//     owner.name = '1D,2D';
//     owner.type = 'PORT';
//     owner.status = 'ACTIVE';
//
//     owner.parent = CollectorUtils.createAdapterDto();
//     return owner;
//   }
//
//   static createPoolEntity(): PoolEntity {
//     const entity = new PoolEntity();
//     entity.id = 1;
//     entity.name = 'Pool_1';
//     entity.idCatComponentStatus = ComponentStatus.ACTIVE;
//
//     entity.parent = CollectorUtils.createSystemEntity();
//     return entity;
//   }
//
//   static createPoolMetricEntity(): PoolMetricEntity {
//     const entity = new PoolMetricEntity();
//     entity.id = 2;
//     entity.date = new Date('2019-09-01');
//     entity.value = 5;
//
//     const metricType = new CatMetricTypeEntity();
//     metricType.unit = '%';
//     metricType.id = 2;
//     metricType.name = 'PHYSICAL_SUBS_PERC';
//
//     entity.metricTypeEntity = metricType;
//
//     entity.owner = CollectorUtils.createPoolEntity();
//
//     return entity;
//   }
//
//   static createPoolMetricOwnerResponseDto(): MetricResponseDto {
//     const dto = new MetricResponseDto();
//     dto.idMetric = 2;
//     dto.date = new Date('2019-09-01');
//     dto.metricType = 'PHYSICAL_SUBS_PERC';
//     dto.value = 5;
//
//     dto.owner = this.createPoolDto();
//
//     return dto;
//   }
//
//   private static createPoolDto() {
//     const owner = new Owner();
//     owner.id = 1;
//     owner.name = 'Pool_1';
//     owner.type = 'POOL';
//     owner.status = 'ACTIVE';
//     owner.parent = CollectorUtils.createSystemDto();
//     return owner;
//   }
//
//   static createSystemEntity(): SystemEntity {
//     const system = new SystemEntity();
//     system.id = 2;
//     system.name = CollectorUtils.SYSTEM_NAME;
//     system.idCatComponentStatus = ComponentStatus.ACTIVE;
//
//     return system;
//   }
//
//   static createSystemMetricEntity(): SystemMetricEntity {
//     const entity = new SystemMetricEntity();
//     entity.id = 1;
//     entity.peak = 10;
//     entity.value = 5;
//     entity.date = new Date('2019-09-01');
//     entity.owner = CollectorUtils.createSystemEntity();
//
//     const metricType = new CatMetricTypeEntity();
//     metricType.unit = 'Mbps';
//     metricType.id = 7;
//     metricType.name = 'WORKLOAD';
//
//     entity.metricTypeEntity = metricType;
//     return entity;
//   }
//
//   static createSystemMetricOwnerResponseDto(): MetricResponseDto {
//     const dto = new MetricResponseDto();
//     dto.idMetric = 1;
//     dto.peak = 10;
//     dto.value = 5;
//     dto.date = new Date('2019-09-01');
//     dto.metricType = 'WORKLOAD';
//
//     dto.owner = CollectorUtils.createSystemDto();
//
//     return dto;
//   }
//
//   static createSystemDto(): Owner {
//     const owner = new Owner();
//     owner.id = 2;
//     owner.name = CollectorUtils.SYSTEM_NAME;
//     owner.type = 'SYSTEM';
//     owner.status = 'ACTIVE';
//
//     return owner;
//   }
//
//   static createLatencyMetricEntity(): LatencyEntity {
//     const dto = new LatencyEntity();
//     dto.id = 1;
//     dto.value = 5;
//     dto.latency = 0.5;
//     dto.blockSize = 8;
//     dto.date = new Date('2019-09-01');
//     dto.operationEntity = { id: 1, name: 'READ' };
//     dto.metricTypeEntity = { id: 72, name: 'LATENCY_PER_BLOCK_SIZE', unit: null, idCatMetricGroup: 1, threshold: null };
//     dto.owner = this.createPoolEntity();
//     return dto;
//   }
//
//   static createLatencyResponseDto(): LatencyResponseDto {
//     const dto = new LatencyResponseDto();
//     const latencyDto = new LatencyMetricDto();
//     latencyDto.idMetric = 1;
//     latencyDto.value = 5;
//     latencyDto.latency = 0.5;
//     latencyDto.blockSize = 8;
//     latencyDto.date = new Date('2019-09-01');
//     latencyDto.operationType = OperationType.READ;
//     latencyDto.metricType = 'LATENCY_PER_BLOCK_SIZE';
//     latencyDto.owner = this.createPoolDto();
//     dto.data.push(latencyDto);
//
//     return dto;
//   }
// }
