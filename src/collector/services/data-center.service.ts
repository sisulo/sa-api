import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataCenterEntity } from '../entities/data-center.entity';
import { MetricType } from '../enums/metric-type.enum';
import { PeriodType } from '../enums/period-type.enum';
import { Region } from '../../statistics/models/dtos/region.enum';
import { ComponentStatus } from '../enums/component.status';

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
  ) {
    this.regionDataCenters.push({ type: Region.EUROPE, dataCenterIds: [1, 2] });
    this.regionDataCenters.push({ type: Region.ASIA, dataCenterIds: [3, 4] });
    this.regionDataCenters.push({ type: Region.AMERICA, dataCenterIds: [5, 6] });
  }

  async findById(idDataCenter: number): Promise<DataCenterEntity[]> {
    return await this.dataCenterRepository.find({ where: { idDatacenter: idDataCenter } });
  }

  getDataCenterIdByRegion(region: Region) {
    const foundItem = this.regionDataCenters.find(regionMapItem => regionMapItem.type === region);
    if (foundItem != null) {
      return foundItem.dataCenterIds;
    }
    return [];
  }

  async getMetricsByGroup(metricGroup: MetricGroup, idDataCenterParam: number, period: PeriodType): Promise<DataCenterEntity[]> {
    const dcDao = await this.loadMetrics(metricGroup, idDataCenterParam, period);
    return dcDao || await this.getEmptyDatacenter(idDataCenterParam);
  }

  async getPerformanceMetrics(metricTypes: MetricType[], idDataCenterParam: number[]): Promise<DataCenterEntity[]> {

    const query = this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.metrics', 'metrics', 'metrics.metricTypeEntity IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .andWhere('system.idCatComponentStatus = :idSystemStatus', {idSystemStatus : ComponentStatus.ACTIVE});
    if (idDataCenterParam.length > 0) {
      query.andWhere('datacenter.id_datacenter IN (:...idDatacenter)', { idDatacenter: idDataCenterParam });
    }

    return query.getMany();
  }

  getPoolMetrics(metricTypes: MetricType[], idDataCenterParam: number[]): Promise<DataCenterEntity[]> {

    const query = this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.pools', 'pool')
      .leftJoinAndSelect('pool.metrics', 'metrics', 'metrics.metricTypeEntity IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('pool.idCatComponentStatus = :idStatus', {idStatus: ComponentStatus.ACTIVE})
      .andWhere('system.idCatComponentStatus = :idSystemStatus', {idSystemStatus : ComponentStatus.ACTIVE});
    if (idDataCenterParam.length > 0) {
      query.andWhere('datacenter.id_datacenter IN (:...idDatacenter)', { idDatacenter: idDataCenterParam });
    }
    return query.getMany();
  }

  getChannelAdapterMetrics(metricTypes: MetricType[], idDataCenterParam: number): Promise<DataCenterEntity[]> {

    const query = this.dataCenterRepository.createQueryBuilder('datacenter')
      .innerJoinAndSelect('datacenter.systems', 'system')
      .innerJoinAndSelect('system.adapters', 'adapter')
      .innerJoinAndSelect('adapter.ports', 'port')
      .leftJoinAndSelect('port.metrics', 'port_metric', 'port_metric.metricTypeEntity IN (:...portMetrics)', { portMetrics: metricTypes })
      .leftJoinAndSelect('port_metric.metricTypeEntity', 'port_metric_type')
      .leftJoinAndSelect('adapter.metrics', 'metrics', 'metrics.metricTypeEntity IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('adapter.idCatComponentStatus = :idStatus', {idStatus: ComponentStatus.ACTIVE})
      .andWhere('system.idCatComponentStatus = :idSystemStatus', {idSystemStatus : ComponentStatus.ACTIVE})
      .andWhere('port.idCatComponentStatus = :idPortStatus', {idPortStatus : ComponentStatus.ACTIVE});
    if (idDataCenterParam != null) {
      query.where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam });
    }
    return query.getMany();
  }

  getHostGroupMetrics(metricTypes: MetricType[], idDataCenterParam: number): Promise<DataCenterEntity[]> {

    const query = this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.hostGroups', 'hostGroup')
      .leftJoinAndSelect('hostGroup.metrics', 'metrics', 'metrics.metricTypeEntity IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .leftJoinAndSelect('hostGroup.externals', 'external')
      .leftJoinAndSelect('external.externalTypeEntity', 'externalType')
      .where('hostGroup.idCatComponentStatus = :idStatus', {idStatus: ComponentStatus.ACTIVE})
      .andWhere('system.idCatComponentStatus = :idSystemStatus', {idSystemStatus : ComponentStatus.ACTIVE});
    if (idDataCenterParam != null) {
      query.andWhere('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam });
    }

    return query.getMany();
  }

  getEmptyDatacenter(idDataCenterParam: number): Promise<DataCenterEntity[]> {
    return this.findById(idDataCenterParam);
  }

  getAllDataCenters(): Promise<DataCenterEntity[]> {
    return this.dataCenterRepository.createQueryBuilder('datacenter')
      .innerJoinAndSelect('datacenter.systems', 'system')
      .where('system.idCatComponentStatus = :idSystemStatus', {idSystemStatus : ComponentStatus.ACTIVE})
      .getMany();
  }

  private loadMetrics(metricGroup: MetricGroup, idDataCenterParam: number, period: PeriodType) {
    const types: MetricType[] = this.resolveMetricTypes(metricGroup, period);
    let dataCenterIds = [];
    if (idDataCenterParam != null) {
      dataCenterIds = [idDataCenterParam];
    }
    switch (metricGroup) {
      case MetricGroup.PERFORMANCE:
        return this.getPerformanceMetrics(types, dataCenterIds);
      case MetricGroup.CAPACITY:
        return this.getPoolMetrics(types, dataCenterIds);
      case MetricGroup.ADAPTERS:
        return this.getChannelAdapterMetrics(types, idDataCenterParam);
      case MetricGroup.SLA:
        return this.getPoolMetrics(types, dataCenterIds);
      case MetricGroup.HOST_GROUPS:
        return this.getHostGroupMetrics(types, idDataCenterParam);
    }
  }

  private resolveMetricTypes(metricGroup: MetricGroup, period: PeriodType): MetricType[] {
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
