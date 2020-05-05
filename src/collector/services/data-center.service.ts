import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataCenterEntity } from '../entities/data-center.entity';
import { MetricType } from '../enums/metric-type.enum';
import { PeriodType } from '../enums/period-type.enum';
import { Region } from '../../statistics/models/dtos/region.enum';
import { ComponentStatus } from '../enums/component.status';
import { StorageEntityRepository } from '../repositories/storage-entity.repository';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { PoolMetricReadEntity } from '../entities/pool-metric-read.entity';
import { StorageEntityType } from '../dto/owner.dto';
import { SystemMetricReadEntity } from '../entities/system-metric-read.entity';
import { ChaMetricReadEntity } from '../entities/cha-metric-read.entity';
import { PortMetricReadEntity } from '../entities/port-metric-read.entity';
import { HostGroupMetricReadEntity } from '../entities/host-group-metric-read.entity';

export enum MetricGroup {
  PERFORMANCE = 1,
  CAPACITY = 2,
  ADAPTERS = 3,
  SLA = 4,
  HOST_GROUPS = 5,
}

@Injectable()
export class DataCenterService {

  private readonly regionDataCenters = [];

  constructor(
    @InjectRepository(DataCenterEntity)
    private readonly dataCenterRepository: Repository<DataCenterEntity>,
    private storageEntityRepository: StorageEntityRepository,
  ) {
    this.regionDataCenters.push({ type: Region.EUROPE, dataCenterIds: [1, 2] });
    this.regionDataCenters.push({ type: Region.ASIA, dataCenterIds: [3, 4] });
    this.regionDataCenters.push({ type: Region.AMERICA, dataCenterIds: [5, 6] });
  }

  async findById(idDataCenter: number): Promise<StorageEntityEntity[]> {
    return await this.storageEntityRepository.find({ where: { id: idDataCenter } });
  }

  getDataCenterIdByRegion(region: Region) {
    const foundItem = this.regionDataCenters.find(regionMapItem => regionMapItem.type === region);
    if (foundItem != null) {
      return foundItem.dataCenterIds;
    }
    return [];
  }

  async getMetricsByGroup(metricGroup: MetricGroup, idDataCenterParam: number, period: PeriodType): Promise<StorageEntityEntity[]> {
    const dcDao = await this.loadMetrics(metricGroup, idDataCenterParam, period);
    return dcDao || await this.getEmptyDatacenter(idDataCenterParam);
  }

  async getPerformanceMetrics(metricTypes: MetricType[], idDataCenterParam: number[]): Promise<StorageEntityEntity[]> {

    const query = this.storageEntityRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.children', 'system', 'system.idType=:systemType', { systemType: StorageEntityType.SYSTEM })
      .leftJoinAndMapMany('system.metrics', SystemMetricReadEntity, 'metrics', 'metrics.owner = system.id AND metrics.idType IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'typeEntity')
      .andWhere('system.idCatComponentStatus = :idSystemStatus', { idSystemStatus: ComponentStatus.ACTIVE });
    if (idDataCenterParam.length > 0) {
      query.andWhere('datacenter.id IN (:...idDatacenter)', { idDatacenter: idDataCenterParam });
    }

    return query.getMany();
  }

  async getPoolMetrics(metricTypes: MetricType[], idDataCenterParam: number[]): Promise<StorageEntityEntity[]> {

    const query = this.storageEntityRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.children', 'system', 'system.parent = datacenter.id AND system.idType=:systemType', { systemType: StorageEntityType.SYSTEM })
      .leftJoinAndSelect('system.children', 'pool', 'pool.idType=:poolType', { poolType: StorageEntityType.POOL })
      .leftJoinAndMapMany('pool.metrics', PoolMetricReadEntity, 'metrics', 'metrics.owner = pool.id AND metrics.idType IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'typeEntity')
      .where('pool.idCatComponentStatus = :idStatus', { idStatus: ComponentStatus.ACTIVE })
      .andWhere('system.idCatComponentStatus = :idSystemStatus', { idSystemStatus: ComponentStatus.ACTIVE })
      .andWhere('datacenter.idType = :dataCenterType', { dataCenterType: StorageEntityType.DATA_CENTER });
    if (idDataCenterParam.length > 0) {
      query.andWhere('datacenter.id IN (:...idDatacenter)', { idDatacenter: idDataCenterParam });
    }
    return await query.getMany();
  }

  getChannelAdapterMetrics(metricTypes: MetricType[], idDataCenterParam: number[]): Promise<StorageEntityEntity[]> {

    const query = this.storageEntityRepository.createQueryBuilder('datacenter')
      .innerJoinAndSelect('datacenter.children', 'system', 'system.parent = datacenter.id AND system.idType=:systemType', { systemType: StorageEntityType.SYSTEM })
      .innerJoinAndSelect('system.children', 'adapter', 'adapter.idType=:adapterType', {adapterType: StorageEntityType.ADAPTER})
      .innerJoinAndSelect('adapter.children', 'port', 'port.idType=:portType', {portType: StorageEntityType.PORT})
      .leftJoinAndMapMany('port.metrics', PortMetricReadEntity, 'port_metrics', 'port_metrics.owner = port.id AND port_metrics.idType IN (:...portMetrics)', { portMetrics: metricTypes })
      .leftJoinAndSelect('port_metrics.metricTypeEntity', 'portTypeEntity')
      .leftJoinAndMapMany('adapter.metrics', ChaMetricReadEntity, 'adapter_metrics', 'adapter_metrics.owner = adapter.id AND adapter_metrics.idType IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('adapter_metrics.metricTypeEntity', 'adapterTypeEntity')
      .where('adapter.idCatComponentStatus = :idStatus', { idStatus: ComponentStatus.ACTIVE })
      .andWhere('system.idCatComponentStatus = :idSystemStatus', { idSystemStatus: ComponentStatus.ACTIVE })
      .andWhere('port.idCatComponentStatus = :idPortStatus', { idPortStatus: ComponentStatus.ACTIVE });
    if (idDataCenterParam.length > 0) {
      query.where('datacenter.id IN (:...idDatacenter)', { idDatacenter: idDataCenterParam });
    }
    return query.getMany();
  }

  getHostGroupMetrics(metricTypes: MetricType[], idDataCenterParam: number[]): Promise<StorageEntityEntity[]> {

    const query = this.storageEntityRepository.createQueryBuilder('datacenter')
      .innerJoinAndSelect('datacenter.children', 'system', 'system.idType=:systemType', { systemType: StorageEntityType.SYSTEM })
      .leftJoinAndSelect('system.children', 'hostGroup', 'hostGroup.idType=:hostGroupType', {hostGroupType: StorageEntityType.HOST_GROUP})
      .leftJoinAndMapMany('hostGroup.metrics', HostGroupMetricReadEntity,  'metrics', 'metrics.owner = hostGroup.id AND metrics.idType IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'typeEntity')
      .leftJoinAndSelect('hostGroup.externals', 'external')
      .where('hostGroup.idCatComponentStatus = :idStatus', { idStatus: ComponentStatus.ACTIVE })
      .andWhere('system.idCatComponentStatus = :idSystemStatus', { idSystemStatus: ComponentStatus.ACTIVE });
    if (idDataCenterParam.length > 0) {
      query.andWhere('datacenter.id IN (:...idDatacenter)', { idDatacenter: idDataCenterParam });
    }

    return query.getMany();
  }

  getEmptyDatacenter(idDataCenterParam: number): Promise<StorageEntityEntity[]> {
    return this.findById(idDataCenterParam);
  }

  async getAllDataCenters(): Promise<StorageEntityEntity[]> {
    return await this.storageEntityRepository.findDataCenters();
  }

  private loadMetrics(metricGroup: MetricGroup, idDataCenterParam: number, period: PeriodType): Promise<StorageEntityEntity[]> {
    const types: MetricType[] = DataCenterService.resolveMetricTypes(metricGroup, period);
    let dataCenterIds = [];
    if (idDataCenterParam !== null && idDataCenterParam !== undefined) {
      dataCenterIds = [idDataCenterParam];
    }
    switch (metricGroup) {
      case MetricGroup.PERFORMANCE:
        return this.getPerformanceMetrics(types, dataCenterIds);
      case MetricGroup.CAPACITY:
        return this.getPoolMetrics(types, dataCenterIds);
      case MetricGroup.ADAPTERS:
        return this.getChannelAdapterMetrics(types, dataCenterIds);
      case MetricGroup.SLA:
        return this.getPoolMetrics(types, dataCenterIds);
      case MetricGroup.HOST_GROUPS:
        return this.getHostGroupMetrics(types, dataCenterIds);
    }
  }

  private static resolveMetricTypes(metricGroup: MetricGroup, period: PeriodType): MetricType[] {
    let periodType = period;
    if (period == null) {
      periodType = PeriodType.DAY;
    }
    const metrics = [];
    metrics[MetricGroup.PERFORMANCE] = [];
    metrics[MetricGroup.PERFORMANCE][PeriodType.DAY] = [
      MetricType.WORKLOAD,
      MetricType.TRANSFER,
      MetricType.RESPONSE,
      MetricType.CPU_PERC,
      MetricType.HDD_PERC,
      MetricType.WRITE_PENDING_PERC,
    ];
    metrics[MetricGroup.PERFORMANCE][PeriodType.MONTH] = [
      MetricType.WORKLOAD_MONTH,
      MetricType.TRANSFER_MONTH,
      MetricType.RESPONSE_MONTH,
      MetricType.CPU_PERC_MONTH,
      MetricType.HDD_PERC_MONTH,
      MetricType.WRITE_PENDING_PERC_MONTH,
    ];
    metrics[MetricGroup.PERFORMANCE][PeriodType.WEEK] = [
      MetricType.WORKLOAD_WEEK,
      MetricType.TRANSFER_WEEK,
      MetricType.RESPONSE_WEEK,
      MetricType.CPU_PERC_WEEK,
      MetricType.HDD_PERC_WEEK,
      MetricType.WRITE_PENDING_PERC_WEEK,
    ];
    metrics[MetricGroup.CAPACITY] = [];
    metrics[MetricGroup.CAPACITY][PeriodType.DAY] = [
      MetricType.PHYSICAL_CAPACITY,
      MetricType.PHYSICAL_SUBS_PERC,
      MetricType.AVAILABLE_CAPACITY,
      MetricType.LOGICAL_USED_PERC,
      MetricType.PHYSICAL_USED_PERC,
      MetricType.COMPRESSION_RATIO,
      MetricType.CHANGE_DAY,
      MetricType.CHANGE_MONTH,
      MetricType.CHANGE_WEEK,
      MetricType.PREDICTION_L1,
      MetricType.PREDICTION_L2,
      MetricType.PREDICTION_L3,
      MetricType.CHANGE_DAY,
      MetricType.CHANGE_WEEK,
      MetricType.CHANGE_MONTH,
      MetricType.PHYSICAL_USED,
      MetricType.PHYSICAL_FREE,
      MetricType.LOGICAL_CAPACITY,
      MetricType.LOGICAL_USED,
      MetricType.LOGICAL_FREE,
      MetricType.NET_TOTAL,
      MetricType.NET_USED,
      MetricType.NET_FREE,
      MetricType.PHY_USED_BEF_SAVING,
      MetricType.DEDUP_RATIO,
      MetricType.TOTAL_SAVING_EFFECT,
      MetricType.SUBSCRIBED_CAPACITY,
      MetricType.LOGICAL_SUBS_PERC,
      MetricType.NET_SUBS_PERC,
      MetricType.NET_USED_PERC,
    ];
    metrics[MetricGroup.ADAPTERS] = [];
    metrics[MetricGroup.ADAPTERS][PeriodType.DAY] = [
      MetricType.IMBALANCE_EVENTS,
      MetricType.IMBALANCE_ABSOLUT,
      MetricType.IMBALANCE_PERC,
      MetricType.PORT_IMBALANCE_EVENTS,
      MetricType.PORT_IMBALANCE_ABSOLUT,
      MetricType.PORT_IMBALANCE_PERC,
    ];
    metrics[MetricGroup.ADAPTERS][PeriodType.WEEK] = [
      MetricType.IMBALANCE_EVENTS_WEEK,
      MetricType.IMBALANCE_ABSOLUT_WEEK,
      MetricType.IMBALANCE_PERC_WEEK,
      MetricType.PORT_IMBALANCE_EVENTS_WEEK,
      MetricType.PORT_IMBALANCE_ABSOLUT_WEEK,
      MetricType.PORT_IMBALANCE_PERC_WEEK,
    ];
    metrics[MetricGroup.ADAPTERS][PeriodType.MONTH] = [
      MetricType.IMBALANCE_EVENTS_MONTH,
      MetricType.IMBALANCE_ABSOLUT_MONTH,
      MetricType.IMBALANCE_PERC_MONTH,
      MetricType.PORT_IMBALANCE_EVENTS_MONTH,
      MetricType.PORT_IMBALANCE_ABSOLUT_MONTH,
      MetricType.PORT_IMBALANCE_PERC_MONTH,
    ];
    metrics[MetricGroup.SLA] = [];
    metrics[MetricGroup.SLA][PeriodType.DAY] = [
      MetricType.SLA_EVENTS,
      MetricType.OUT_OF_SLA_TIME,
    ];
    metrics[MetricGroup.SLA][PeriodType.WEEK] = [
      MetricType.SLA_EVENTS_WEEK,
      MetricType.OUT_OF_SLA_TIME_WEEK,
    ];
    metrics[MetricGroup.SLA][PeriodType.MONTH] = [
      MetricType.SLA_EVENTS_MONTH,
      MetricType.OUT_OF_SLA_TIME_MONTH,
    ];
    metrics[MetricGroup.HOST_GROUPS] = [];
    metrics[MetricGroup.HOST_GROUPS][PeriodType.DAY] = [
      MetricType.NET_TOTAL,
      MetricType.NET_USED,
      MetricType.NET_USED_PERC,
      MetricType.CHANGE_DAY,
      MetricType.CHANGE_WEEK,
      MetricType.CHANGE_MONTH,
    ];
    if (metrics[metricGroup][periodType] == null) {
      throw new BadRequestException(`Wrong metric group ${metricGroup} when resolving set of metric types`);
    }
    return metrics[metricGroup][periodType];
  }
}
